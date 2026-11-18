import { createClient } from '@supabase/supabase-js';

interface NetlifyEvent {
  path: string;
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

function getServerSupabase() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '';
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

function jsonResponse(statusCode: number, data: unknown): NetlifyResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(data),
  };
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const rawPath = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '') || '/';
  const method = event.httpMethod.toUpperCase();

  // GET /api/health
  if (method === 'GET' && (rawPath === '/health' || rawPath === '/')) {
    return jsonResponse(200, {
      status: 'online',
      platform: 'ZYNIQ Blog Platform (Netlify Edge/Serverless)',
      version: '3.4.0',
      nodeEnv: process.env.NODE_ENV || 'production',
      supabaseConnected: Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
      timestamp: new Date().toISOString(),
    });
  }

  let parsedBody: Record<string, any> = {};
  if (event.body) {
    try {
      parsedBody = JSON.parse(event.body);
    } catch {
      return jsonResponse(400, { error: 'Invalid JSON payload.' });
    }
  }

  // POST /api/seo-audit
  if (method === 'POST' && rawPath === '/seo-audit') {
    const { title = '', metaDescription = '', content = '' } = parsedBody;
    const words = String(content).trim().split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    let score = 100;
    const suggestions: string[] = [];

    if (String(title).length < 30) {
      score -= 15;
      suggestions.push('Title is short. 30-60 characters recommended.');
    }
    if (String(metaDescription).length < 70) {
      score -= 15;
      suggestions.push('Meta description should be 70-160 characters.');
    }
    if (words < 250) {
      score -= 20;
      suggestions.push('Article length is under 250 words.');
    }

    return jsonResponse(200, {
      score: Math.max(10, score),
      words,
      readTimeMinutes,
      suggestions,
      status: 'audited',
    });
  }

  // POST /api/newsletter/subscribe
  if (method === 'POST' && rawPath === '/newsletter/subscribe') {
    const email = typeof parsedBody.email === 'string' ? parsedBody.email.trim().toLowerCase() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse(400, { error: 'Valid email address is required.' });
    }

    const timestamp = new Date().toISOString();
    const supabase = getServerSupabase();
    if (supabase) {
      try {
        await supabase.from('zyniq_subscribers').upsert(
          {
            email,
            subscribed_at: timestamp,
            status: 'active',
          },
          { onConflict: 'email' }
        );
      } catch {
        // non-blocking
      }
    }

    return jsonResponse(200, {
      status: 'subscribed',
      email,
      timestamp,
    });
  }

  // POST /api/contact
  if (method === 'POST' && rawPath === '/contact') {
    const {
      id = `inq-${Date.now()}`,
      department = 'ZYNIQ Solutions',
      name = '',
      email = '',
      message = '',
    } = parsedBody;

    if (!String(name).trim() || !String(email).trim() || !String(message).trim()) {
      return jsonResponse(400, { error: 'Name, email, and message are required.' });
    }

    const timestamp = new Date().toISOString();
    const supabase = getServerSupabase();
    if (supabase) {
      try {
        await supabase.from('zyniq_inquiries').upsert(
          {
            id,
            department: String(department).trim(),
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            message: String(message).trim(),
            created_at: timestamp,
          },
          { onConflict: 'id' }
        );
      } catch {
        // non-blocking
      }
    }

    return jsonResponse(200, {
      status: 'received',
      id,
      department,
      email: String(email).trim().toLowerCase(),
      timestamp,
    });
  }

  return jsonResponse(404, { error: `Endpoint not found: ${method} ${rawPath}` });
};

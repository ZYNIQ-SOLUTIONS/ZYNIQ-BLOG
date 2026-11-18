import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Backend API Endpoints for ZYNIQ Blog
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'online',
      platform: 'ZYNIQ Blog Platform',
      version: '3.4.0',
      nodeEnv: process.env.NODE_ENV || 'development',
      supabaseConnected: Boolean(process.env.VITE_SUPABASE_URL),
    });
  });

  // SEO Audit Endpoint
  app.post('/api/seo-audit', (req: Request, res: Response) => {
    const { title = '', metaDescription = '', content = '', focusKeywords = [] } = req.body;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    let score = 100;
    const suggestions: string[] = [];

    if (title.length < 30) {
      score -= 15;
      suggestions.push('Title is short. 30-60 characters recommended.');
    }
    if (metaDescription.length < 70) {
      score -= 15;
      suggestions.push('Meta description should be 70-160 characters.');
    }
    if (words < 250) {
      score -= 20;
      suggestions.push('Article length is under 250 words.');
    }

    res.json({
      score: Math.max(10, score),
      words,
      readTimeMinutes,
      suggestions,
      status: 'audited',
    });
  });

  // Newsletter Dispatch Subscription Endpoint
  const newsletterSubscribers = new Set<string>();
  app.post('/api/newsletter/subscribe', (req: Request, res: Response) => {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: 'Valid email address is required.' });
      return;
    }
    const normalized = email.trim().toLowerCase();
    const alreadySubscribed = newsletterSubscribers.has(normalized);
    newsletterSubscribers.add(normalized);
    res.json({
      status: 'subscribed',
      email: normalized,
      alreadySubscribed,
      subscriberCount: newsletterSubscribers.size,
      timestamp: new Date().toISOString(),
    });
  });

  // Contact Inquiry Endpoint
  app.post('/api/contact', (req: Request, res: Response) => {
    const { department = 'ZYNIQ Solutions', name = '', email = '', message = '' } = req.body || {};
    if (!name.trim() || !email.trim() || !message.trim()) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }
    res.json({
      status: 'received',
      department,
      email: email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Vite development middlewares or serve static build
  if (!isProd) {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZYNIQ Engine] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ZYNIQ Engine] Fatal boot error:', err);
  process.exit(1);
});

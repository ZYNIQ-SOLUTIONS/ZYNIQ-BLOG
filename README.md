# ZYNIQ Blog — Synthetic Intelligence, Systems & Design

Official editorial and research publication platform by **ZYNIQ Solutions**, engineered with React 19, Vite, Tailwind CSS v4, Netlify Functions, and Supabase Postgres persistence.

---

## Architecture & Features

- **Netlify + Supabase Persistence**:
  - Automatic synchronization with Supabase (`zyniq_posts`, `zyniq_comments`, `zyniq_subscribers`, `zyniq_inquiries`).
  - Automatic first-boot database seeding when connected to a fresh Supabase project with the schema applied.
  - Zero-blocker local fallback if Supabase credentials are not yet configured.
- **Production Read-Only Mode**:
  - In production builds, editorial controls (**Write Dispatch**, **New Post**, **Supabase Sync**) are hidden by default for public visitors.
  - Enable admin/editorial controls anytime via `VITE_ENABLE_ADMIN=true` or by visiting `/?admin=1` (disable with `/?admin=0`).
- **Netlify Serverless API (`netlify/functions/api.ts`)**:
  - `GET /api/health` — Platform & Supabase connectivity status
  - `POST /api/seo-audit` — Content & metadata SEO scoring
  - `POST /api/newsletter/subscribe` — Newsletter dispatch registration
  - `POST /api/contact` — Direct consultation inquiry routing

---

## 1. Supabase Setup

1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run [`supabase/migrations/001_init_schema.sql`](supabase/migrations/001_init_schema.sql).
3. Copy your **Project URL** and **Anon / Public Key** from **Project Settings → API**.

---

## 2. Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 3. Deploy to Netlify

This repository includes [`netlify.toml`](netlify.toml) pre-configured for one-click deployment:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

### Required Netlify Environment Variables
In your Netlify Site Dashboard (**Site configuration → Environment variables**), set:
- `VITE_SUPABASE_URL` — Your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` — Your Supabase Anon Public Key
- `VITE_ENABLE_ADMIN` *(optional)* — Set to `true` if you want editorial buttons visible to everyone, or leave `false` and append `?admin=1` to the URL when authoring dispatches.

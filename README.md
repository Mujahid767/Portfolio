# Tohidur Rahman Mujahid — Portfolio

A **luxurious, fully dynamic portfolio** built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion and Neon Postgres.

It has two modes:

- **Public Mode** — what visitors see at `/`
- **Admin Mode** — your private studio at `/admin` where you can edit *everything* (Hero, About, Skills, Projects, Experience, Education, Achievements, Stats, Social Links, Branding) with full CRUD. Visitors who message you go straight into your inbox.

All edits persist to your Neon PostgreSQL database — so changes are visible to the entire world the moment you save.

---

## Tech Stack

- **Framework** — Next.js 14 (App Router) + React + TypeScript
- **Styling** — Tailwind CSS, custom luxury design system, Framer Motion animations
- **Database** — Neon Serverless Postgres (`@neondatabase/serverless`)
- **Auth** — Signed JWT in HTTP-only cookies (`jose`)
- **Icons** — Lucide React

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the public site, and `http://localhost:3000/admin` for the editor.

The database schema is **auto-created and seeded** on first request — no migrations needed.

### Default admin credentials

Defined in `.env.local`:

```
ADMIN_EMAIL=admin@mujahid.dev
ADMIN_PASSWORD=Mujahid@2026
```

**Change these before deploying!**

---

## Environment Variables

`.env.local` (do not commit this — it's already in `.gitignore`):

```env
DATABASE_URL=postgresql://...
ADMIN_EMAIL=admin@mujahid.dev
ADMIN_PASSWORD=YourStrongPassword
AUTH_SECRET=long-random-secret-string-min-32-characters

# Where contact-form messages get emailed
CONTACT_EMAIL=mujuleet@gmail.com

# Optional — if set, contact form messages get emailed to CONTACT_EMAIL.
# Get a free API key at https://resend.com (3000 emails/month free).
# Without it, messages still save to the admin Inbox; only emailing is disabled.
RESEND_API_KEY=
RESEND_FROM=Portfolio Contact <onboarding@resend.dev>
```

### Enabling contact-form email delivery

1. Go to [resend.com](https://resend.com) and sign up with your Google account
2. Click **API Keys → Create API Key** and copy it
3. Paste it into `RESEND_API_KEY` in `.env.local`
4. Restart `npm run dev` (or redeploy on Vercel after adding it as a Vercel env var)

That's it — every contact form submission will now both:
- Save to your admin **Inbox** at `/admin`
- Send a beautifully styled email to `CONTACT_EMAIL` with a one-click reply link

> The default sender `onboarding@resend.dev` works without domain verification. If you want to send from a custom domain (e.g. `hello@mujahid.dev`), verify it in Resend and update `RESEND_FROM`.

---

## Project Structure

```
src/
├─ app/
│  ├─ page.tsx                 ← Public portfolio
│  ├─ layout.tsx
│  ├─ globals.css              ← Design system
│  ├─ admin/
│  │  ├─ page.tsx              ← Admin editor
│  │  └─ login/page.tsx        ← Sign in
│  └─ api/
│     ├─ contact/              ← Public contact form
│     ├─ auth/{login,logout}/  ← Sign in/out
│     └─ admin/                ← Protected CRUD
│        ├─ portfolio/         ← Hero/About/Stats/Social
│        ├─ skills/
│        ├─ projects/
│        ├─ experiences/
│        ├─ education/
│        ├─ achievements/
│        └─ messages/          ← Inbox
├─ components/
│  ├─ public/                  ← Public portfolio sections
│  └─ admin/                   ← Admin editor + section panels
└─ lib/
   ├─ db.ts                    ← Neon SQL client
   ├─ schema.ts                ← Auto-creates tables
   ├─ portfolio.ts             ← Data access layer
   ├─ defaults.ts              ← Initial seed data (your info)
   ├─ auth.ts                  ← JWT cookie auth
   └─ types.ts
```

---

## How to Edit Your Portfolio

1. Go to `/admin`
2. Sign in with your admin email + password
3. Use the sidebar to pick any section (Hero, About, Skills, Projects, etc.)
4. Make your edits and click **Save**
5. Your live portfolio updates immediately

You can also drag items up/down with the chevron arrows, mark featured projects with the star icon, and reply to incoming messages directly from your Inbox.

---

## Public Sections

- **Hero** — name, animated rotating titles, tagline, photo with floating glass cards, stats
- **About** — quote, story paragraphs, location, focus pillars (AI, Full-Stack, DB, CS)
- **Skills** — beautifully grouped categories
- **Selected Work** — featured project cards + grid of others
- **Journey** — timeline of experiences and education
- **Achievements** — milestone cards
- **Contact** — direct social links + working contact form (saves to your inbox)
- **Footer** — social icons + copyright

---

## Deploying to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the environment variables (`DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`)
4. Deploy. The Neon database works seamlessly on Vercel's edge / serverless runtime.

---

## Customization Tips

- **Profile photo** — replace `/public/profile.png` with your own (or use Admin → General → Photo URL)
- **Brand letter** — change in Admin → General
- **Colors** — edit `tailwind.config.js` (the `gold` palette controls the luxury accent color)
- **Fonts** — change Google Font imports in `src/app/layout.tsx` and the `--font-*` variables in `globals.css`

---

Crafted with care, in Dhaka.

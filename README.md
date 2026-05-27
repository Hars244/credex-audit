# SpendScan — Free AI Tool Spend Audit

SpendScan is a free web app that audits your team's
AI tool subscriptions and identifies exactly where
you're overspending — built as a lead-generation
tool for Credex, an AI infrastructure company.

**Live URL:** https://credex-audit-indol.vercel.app

---

## Screenshots

> Home page — spend input form

![Home page](https://credex-audit-indol.vercel.app/og-preview.png)

*Run the live app to see current screenshots*

**Screen recording:** https://credex-audit-indol.vercel.app

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Anthropic API key
- Resend API key

### Install and run locally

```bash
git clone https://github.com/Hars244/credex-audit.git
cd credex-audit
npm install
```

Create `.env.local` in the root:
```env
MONGODB_URI=your_mongodb_connection_string
ANTHROPIC_API_KEY=your_anthropic_key
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
```

Open http://localhost:3000

### Run tests
```bash
npm test
```

### Deploy to Vercel
1. Push to GitHub
2. Import repo on vercel.com
3. Add environment variables in Vercel dashboard
4. Deploy

---

## Decisions

### 1. Next.js over plain React
Next.js gives us both frontend and backend in one
project with file-based API routes. This meant one
codebase, one deployment, and no separate Express
server. The tradeoff is a larger framework dependency,
but for a full-stack app the productivity gain is
worth it.

### 2. MongoDB over Supabase
I'm familiar with MongoDB and Mongoose from previous
projects. Supabase would have been fine but using
an unfamiliar tool mid-assignment would have slowed
down development. The tradeoff is no SQL query power,
but for storing audits and leads, document storage
is a natural fit.

### 3. Hardcoded rules for audit logic, not AI
The assignment specifically tests whether you know
when NOT to use AI. Rule-based logic is auditable,
explainable, and reliable for financial
recommendations. A finance person can read every
if/else in auditEngine.ts and agree with the
reasoning. A black-box AI output cannot provide
this. AI is only used for the summary paragraph.

### 4. Honeypot over CAPTCHA for spam protection
CAPTCHA creates friction for real users and measurably
hurts conversion rates. A honeypot hidden field catches
the most common bots with zero UX impact. The tradeoff
is that sophisticated bots can bypass honeypots, but
for a week-1 launch this is the right call. Rate
limiting can be added later.

### 5. Downgraded from Next.js 16 to Next.js 14
Next.js 16's Turbopack bundler caused repeated fatal
panics in the development environment. Rather than
spend hours debugging an unstable bundler, I downgraded
to Next.js 14 with stable webpack. The tradeoff is
slower local compilation, but a reliable development
experience is worth more than marginally faster builds.
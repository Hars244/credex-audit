# Dev Log — Credex AI Spend Audit Tool

## Day 1 — 2026-05-21

**Hours worked:** 3

**What I did:**
- Set up Next.js project with TypeScript and Tailwind CSS
- Created MongoDB Atlas cloud database and connected it to the project
- Built folder structure (models, lib, components, api routes)
- Created Audit and Lead mongoose models
- Built the audit engine with pricing logic for 6 AI tools
- Set up environment variables

**What I learned:**
- How to set up MongoDB Atlas and get a cloud connection string
- How Next.js App Router folder structure works
- How mongoose models are defined with TypeScript interfaces

**Blockers / what I'm stuck on:**
- Need to understand how API routes work in Next.js App Router
- Anthropic API integration is for Day 4, need to read docs before then

**Plan for tomorrow:**
- Build the spend input form that users fill out
- Make form state persist across page reloads
- Style it with Tailwind CSS

## Day 2 — 2026-05-22

**Hours worked:** 4

**What I did:**
- Fixed Next.js App Router API route export issues
- Connected MongoDB Atlas successfully
- Built working POST and GET audit APIs
- Implemented dynamic results page using shareId
- Successfully stored and fetched audit data from MongoDB
- Tested full form → audit → results flow end-to-end

**What I learned:**
- Difference between default exports and named exports in Next.js App Router
- How dynamic API routes work using route params
- How MongoDB Atlas IP whitelisting works
- How frontend and backend communicate using fetch()

**Blockers / what I'm stuck on:**
- Need to improve UI styling and responsiveness
- Need to add AI-generated summaries

**Plan for tomorrow:**
- Improve overall UI and visual polish
- Add localStorage persistence to the form
- Improve audit recommendation quality

## Day 3 — 2026-05-23

**Hours worked:** 4

**What I did:**
- Completely redesigned the home page with better hero section,
  animated pulse badge, stats section and improved form UX
- Built a reusable Navbar component with SpendScan branding
- Updated layout.tsx to wrap all pages with the Navbar automatically
- Rebuilt the results page from scratch with a professional layout:
  - Big savings hero showing monthly + annual savings
  - Percentage badge showing savings vs current spend
  - Summary stats row (current spend, optimised spend, tools audited)
  - Credex consultation banner for high-value audits (>$500/mo savings)
  - Per-tool breakdown cards with recommended action + reasoning
  - Tools audited summary section
  - Shareable URL with copy button and "Copied!" feedback
- Added input validation — shows error if no monthly spend entered
- Added localStorage persistence so form data survives page refresh
- Tested full flow with real data: Cursor Business + ChatGPT Team
  triggering $60/mo ($720/year) in savings recommendations

**What I learned:**
- How layout.tsx in Next.js wraps every single page automatically —
  adding Navbar there means I never have to add it to each page
- How the reduce() array method works to sum up values from objects
- How to give instant UI feedback using useState with setTimeout
  (the Copy button changing to "Copied!" for 2 seconds)
- How percentage calculations work in savings context
- Why separating UI into components (Navbar.tsx) makes code cleaner
  and easier to maintain

**Blockers / what I'm stuck on:**
- The AI summary section is not built yet — need Anthropic API key
- Lead capture form not built yet — users cannot submit their email
- Need to verify all pricing numbers against official vendor pages
  before submission

**Plan for tomorrow:**
- Get Anthropic API key (free credits available)
- Build AI-generated summary using Anthropic API
- Add graceful fallback if API fails
- Write the prompt in PROMPTS.md as assignment requires

## Day 4 — 2026-05-24

**Hours worked:** 4

**What I did:**
- Got Anthropic API key from console.anthropic.com
- Built AI summary API route at /api/summary
- Integrated @anthropic-ai/sdk into the project
- Wrote two prompts — one for savings found case,
  one for already-optimal case
- Added graceful fallback when API fails —
  templated summary generated from audit data
- Added AI summary section to results page with
  loading spinner and "Powered by Claude" badge
- Created PROMPTS.md documenting all prompts,
  reasoning, and what did not work
- Fixed Turbopack panic bug — downgraded from
  Next.js 16 to Next.js 14 (stable webpack bundler)
- Fixed next.config.ts to next.config.js (Next.js 14
  does not support TypeScript config files)
- Fixed font import — Geist not available in
  Next.js 14, switched to Inter which looks similar
- Diagnosed MongoDB SRV DNS timeout — college WiFi
  blocks SRV record lookups, fixed by using
  mobile hotspot
- Tested full flow end-to-end on hotspot with
  AI summary working correctly

**What I learned:**
- How to write effective prompts — giving Claude
  a specific role, real data, and format constraints
  produces much better output than vague prompts
- How graceful API fallbacks work — always have
  a backup when calling external services
- ETIMEOUT on MongoDB SRV means the network is
  blocking DNS SRV record lookup — not a code bug
- Next.js 14 does not support next.config.ts —
  must use next.config.js
- Turbopack is Next.js 16 default bundler but
  unstable in some environments — downgrading to
  Next.js 14 uses webpack which is battle-tested
- React 19 is incompatible with Next.js 14 —
  had to downgrade React to 18.3.1 as well

**Blockers / what I'm stuck on:**
- College WiFi blocks MongoDB SRV DNS — must use
  hotspot for development
- Will test Anthropic API on stable connection
  to confirm real Claude output vs fallback

**Plan for tomorrow:**
- Build lead capture form after results page
- Set up Resend for transactional emails
- Store leads in MongoDB with isHighValue flag
- Add honeypot spam protection
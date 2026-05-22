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
# Reflection — SpendScan

## 1. The Hardest Bug

The hardest bug was a combination of two separate
issues that looked like one. On Day 4, after
integrating the Anthropic SDK, the Next.js development
server started crashing with repeated "FATAL: Turbopack
panic" errors every few seconds. The app technically
still served pages between crashes, but it was
completely unreliable.

My first hypothesis was that the Anthropic SDK was
incompatible with Turbopack's module bundler — some
Node.js native modules cause issues with experimental
bundlers. I tried adding the package to webpack
externals, modifying next.config.js, and searching
for the exact error string in GitHub issues. I found
reports of similar panics in Next.js 16.2.x with
certain SDK packages.

My second hypothesis was that the project move from
Desktop to a new folder had corrupted node_modules,
since the panics started around the same time. I
deleted node_modules and ran npm install fresh. The
panics continued.

What actually worked: downgrading from Next.js 16 to
Next.js 14. Next.js 16 uses Turbopack as the default
bundler — which is still experimental. Next.js 14
uses webpack, which is battle-tested. The downgrade
required also downgrading React from 19 to 18 due
to peer dependency conflicts, renaming next.config.ts
to next.config.js (Next.js 14 doesn't support
TypeScript config files), and switching the font from
Geist to Inter (Geist was added in Next.js 15).

The lesson: when an environment-level tool is causing
crashes, sometimes the right fix is to downgrade to
a stable version rather than fight the bug. Time spent
debugging an experimental bundler is time not spent
shipping features.

---

## 2. A Decision I Reversed

I initially planned to use Supabase as the database
because the assignment mentioned it as an option and
it has a nice visual dashboard. I spent about an hour
on Day 1 setting up a Supabase project and reading
their Next.js documentation.

I reversed this decision when I realised two things.
First, Supabase uses PostgreSQL which requires writing
SQL schemas and migrations — something I'd have to
learn from scratch mid-assignment. Second, MongoDB
with Mongoose was something I already knew from
previous projects. The audit data (tools, recommendations,
leads) is naturally document-shaped — there's no
relational structure that would benefit from SQL.

The reversal cost me about 90 minutes. But it was
the right call. Using a familiar tool let me move
faster on the features that actually mattered. The
assignment says "your call" on database choice —
the key word being "your." Using what you know well
is a legitimate engineering decision, not a cop-out.

---

## 3. What I Would Build in Week 2

The most valuable week-2 addition would be a
**benchmark mode** — "your AI spend per developer
is $X, companies your size average $Y."

Right now the audit tells you whether you're on the
wrong plan. But it doesn't tell you whether your
total spend is normal compared to similar teams.
A founder spending $500/month might be underspending
if their 20-person engineering team uses AI heavily,
or overspending if it's a solo project.

To build this I'd aggregate anonymised audit data
(opt-in) and compute spend-per-developer by team
size bucket. Even with 100 audits I'd have enough
data to show meaningful benchmarks for teams of
1-5, 5-20, and 20+ people.

I'd also add **PDF export** — the assignment lists
it as a bonus. The results page is screenshot-worthy
but a PDF with the Credex logo and a proper audit
header would be more shareable in a company context.
A founder could attach it to an internal Slack message
or send it to their CFO.

Finally, I'd instrument real analytics — currently
the stats (2,400+ audits, $340 avg savings) are
mocked. After a week of real traffic I'd have actual
numbers which would dramatically improve conversion
on the landing page.

---

## 4. How I Used AI Tools

I used Claude (via claude.ai) throughout the week
as a pair programmer. Specifically:

- **Boilerplate and setup** — Next.js project
  structure, MongoDB connection code, Mongoose model
  schemas. These are patterns I understand but are
  tedious to type. AI was fast here.

- **TypeScript types** — Writing interface definitions
  for AuditData, Recommendation, ToolEntry. AI
  correctly inferred the shape from how I described
  the data.

- **Tailwind CSS classes** — I described what I wanted
  visually and Claude suggested the right utility
  classes. Faster than reading docs.

- **Debugging error messages** — Pasting terminal
  errors and getting an explanation of what they mean.

What I did NOT trust AI with:
- The audit engine logic itself. I wrote every
  if/else in auditEngine.ts manually. The reasoning
  must be defensible by a finance person — I needed
  to understand and own every decision.
- The DEVLOG entries. These are my honest daily
  observations. AI-generated devlogs are obvious.
- Architecture decisions. AI would have suggested
  Supabase because it's in the assignment PDF.
  I chose MongoDB because I knew it.

**One time AI was wrong:** On Day 2, Claude suggested
using `export default function handler(req, res)`
for the API route — the old Next.js Pages Router
pattern. I caught it because the error message said
"Detected default export" and I knew we were using
the App Router which requires named exports like
`export async function POST`. This is a common
mistake because most training data predates the
App Router.

---

## 5. Self-Rating

**Discipline: 7/10**
I worked every day from Day 1 to Day 7 with real
commits on each day. I lost some time on Day 4
debugging the Turbopack issue which wasn't productive
work. Could have been more systematic about planning
each day's goals the night before.

**Code quality: 6/10**
The code is readable and TypeScript types are used
throughout. But I know there are areas that could be
cleaner — the results page component is too large
and should be split into smaller components. Error
handling in some API routes is minimal. With more
time I'd do a proper refactor pass.

**Design sense: 7/10**
The dark theme with green accents looks professional
and distinct from generic templates. The results page
is screenshot-worthy as required. The weakness is
mobile responsiveness — I tested it but didn't spend
time optimising the breakpoints.

**Problem-solving: 8/10**
When things broke I debugged systematically — formed
a hypothesis, tested it, moved to the next hypothesis
when it failed. The Turbopack issue is a good example.
I also made practical decisions quickly rather than
getting stuck (switch to MongoDB, downgrade Next.js).

**Entrepreneurial thinking: 6/10**
I understood the business model and built the lead
capture and Credex CTA as genuinely useful features,
not afterthoughts. But I didn't talk to enough
potential users early enough — the user interviews
happened late in the week when I should have done
them on Day 1 to inform the design.
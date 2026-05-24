# Prompts Used in SpendScan

## AI-Generated Audit Summary

### Location
`src/app/api/summary/route.ts`

### Purpose
Generate a personalised ~100-word paragraph summarising
the audit result for the specific user's tool stack,
team size, use case, and savings found.

### Prompt — Savings found version

You are a financial advisor specialising in AI tool
spend optimisation.

A startup team of {teamSize} people primarily uses
AI for {useCase}.
Their current AI tools are: {toolsList}.
Total current monthly spend: ${totalSpend}/mo.

Our audit found these savings opportunities:
{recsList}

Total potential savings: ${totalMonthlySavings}/mo
(${totalAnnualSavings}/year).

Write a concise, specific 80-100 word summary of their
situation — what they are overspending on, the key
recommendation, and the impact.
Reference their actual tools and numbers.

Tone: direct, confident, like a CFO giving advice.
No fluff. No bullet points. Plain paragraph only.

### Prompt — Already optimal version

You are a financial advisor specialising in AI tool
spend optimisation.

A startup team of {teamSize} people primarily uses
AI for {useCase}.
Their current AI tools are: {toolsList}.

After a thorough audit, their setup is already
well-optimised. Write a concise, encouraging 80-100
word summary telling them they are spending well,
what they are doing right, and one forward-looking
suggestion to keep costs lean as they scale.

Tone: professional but human. No bullet points.
Plain paragraph only.

### Why I wrote it this way
- Gave Claude a specific role ("financial advisor")
  so it adopts the right tone instead of being generic
- Included actual numbers in the prompt so the output
  references real data, not vague advice
- Specified "no bullet points, plain paragraph only"
  because the UI renders it as flowing text
- Kept max_tokens at 200 to enforce the ~100 word limit
- Added "like a CFO giving advice" to prevent overly
  cautious or hedged language
- Used two separate prompts for optimal vs savings
  cases — the tone should be different for each

### What I tried that didn't work
- First version had no role — output was too generic
  and did not reference the user's actual tools
- Tried asking for bullet points first — looked bad
  in the UI, switched to paragraph format
- Without specifying tone, Claude added too many
  disclaimers like "you may want to consult a
  professional"
- Tried combining both cases into one prompt — the
  output was inconsistent, split into two prompts

### Fallback behaviour
If the Anthropic API fails (timeout, rate limit,
network issue), the app falls back to a templated
summary generated from the audit data. This ensures
users always see a summary even if the API is down.
The fallback is clearly tested and working.

Example fallback for savings case:
"Your team is currently spending $X/month on AI tools
with $Y/month in identified savings. The key
opportunity is optimising your plan selection to
better match your actual team size and use case.
Implementing these changes could save your team
$Z annually."

### Model used
claude-sonnet-4-20250514

### Max tokens
200 (enforces ~100 word output)

### Temperature
Default — Claude's default gives consistent,
professional output for this use case. No need
for creative variation in financial summaries.
# Metrics — SpendScan

## North Star Metric

**Audits completed per week.**

Not email captures. Not page views. Audits completed.

Why: An audit completed means a user got value from
the product — they went through the whole flow, got
a real result, and saw their potential savings. This
is the moment that creates leads, shares, and word
of mouth. Everything else (email captures,
consultations, credit purchases) is downstream of
this number.

DAU would be wrong — people use this tool once per
quarter at most when reviewing their SaaS bills. A
tool people use rarely but get real value from is
different from a tool people open daily out of habit.

---

## 3 Input Metrics

**1. Form completion rate**
(Audits started → Audits completed)

Target: >70%. If below 50%, the form has too much
friction. Either it's too long, the fields are
confusing, or the value proposition isn't clear enough
to motivate completion. This is the first thing to fix.

**2. Email capture rate**
(Audits completed → Emails submitted)

Target: >20%. This measures whether the results page
delivers enough value that users want to save or share
the report. Below 15% means the results are not
compelling or the email ask is too early/aggressive.

**3. Share rate**
(Audits completed → Shareable URL copied/opened
by a different user)

Target: >5% of audits generate a second visit from
a different IP. This is the viral coefficient.
SpendScan is designed to be shared — the results page
is screenshot-worthy and the URL strips personal
details. If share rate is below 2%, the results
page needs to be more impressive.

---

## What to Instrument First

1. **Audit completion event** — fire when POST
   /api/audit returns 200. This is the North Star.

2. **Form abandonment point** — track which field
   users last interacted with before leaving. If
   most people abandon at "monthly spend," the
   field label or validation is confusing.

3. **Results page scroll depth** — do users read
   the full page or bounce after the hero number?
   If >60% don't scroll past the savings hero,
   the per-tool breakdown adds no value.

4. **Email capture submission** — fire on
   POST /api/leads 200.

5. **Credex CTA clicks** — how many high-value
   audit users click "Book a Free Credex
   Consultation." This is the direct revenue signal.

Implementation: Plausible Analytics (privacy-friendly,
no cookie banner needed, free tier available) or
a simple custom events table in MongoDB.

---

## Pivot Trigger

**If after 500 audits, email capture rate is below
10%, pivot the email ask.**

This would mean users are getting value from the
audit but not trusting SpendScan enough to give
their email. Two possible responses:

Option A: Remove the email gate entirely and make
the share URL the primary action. Rely on virality
over lead capture. This works if share rate is high.

Option B: Add social proof to the results page
before the email form — real testimonials from
users who found savings. This builds enough trust
to increase email conversion.

If after 1,000 audits, the Credex CTA (for high-value
audits) has zero consultation bookings, the tool is
generating leads but not converting them. This would
require a redesign of the consultation funnel —
likely adding a Calendly embed directly in the
high-value results page rather than redirecting
to credex.rocks.
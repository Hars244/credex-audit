import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tools,
      teamSize,
      useCase,
      totalMonthlySavings,
      totalAnnualSavings,
      recommendations,
      isOptimal,
    } = body;

    // Build a readable tools list for the prompt
    const toolsList = tools
      .map((t: { name: string; plan: string; seats: number; monthlySpend: number }) =>
        `${t.name} (${t.plan} plan, ${t.seats} seat(s), $${t.monthlySpend}/mo)`
      )
      .join(', ');

    const recsList = recommendations
      .map((r: { toolName: string; recommendedAction: string; savings: number }) =>
        `${r.toolName}: ${r.recommendedAction} — saves $${r.savings}/mo`
      )
      .join('\n');

    const prompt = isOptimal
      ? `You are a financial advisor specialising in AI tool spend optimisation.
         
A startup team of ${teamSize} people primarily uses AI for ${useCase}. 
Their current AI tools are: ${toolsList}.

After a thorough audit, their setup is already well-optimised. Write a 
concise, encouraging 80-100 word summary telling them they are spending well, 
what they are doing right, and one forward-looking suggestion to keep their 
costs lean as they scale. 

Tone: professional but human. No bullet points. Plain paragraph only.`
      : `You are a financial advisor specialising in AI tool spend optimisation.

A startup team of ${teamSize} people primarily uses AI for ${useCase}.
Their current AI tools are: ${toolsList}.
Total current monthly spend: $${tools.reduce((s: number, t: { monthlySpend: number }) => s + t.monthlySpend, 0)}/mo.

Our audit found these savings opportunities:
${recsList}

Total potential savings: $${totalMonthlySavings}/mo ($${totalAnnualSavings}/year).

Write a concise, specific 80-100 word summary of their situation — what they 
are overspending on, the key recommendation, and the impact. 
Reference their actual tools and numbers. 

Tone: direct, confident, like a CFO giving advice. No fluff. 
No bullet points. Plain paragraph only.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const summary =
      message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('AI summary error:', error);

    // Graceful fallback — assignment requires this
    return NextResponse.json({
      summary: null,
      fallback: true,
    });
  }
}
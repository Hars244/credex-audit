import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            email,
            companyName,
            role,
            teamSize,
            auditId,
            totalMonthlySavings,
            honeypot,
        } = body;

        // SPAM PROTECTION — honeypot field
        // Real users never fill this hidden field
        // Bots fill everything they see
        if (honeypot) {
            return NextResponse.json({ success: true });
        }

        // Basic validation
        if (!email || !auditId) {
            return NextResponse.json(
                { error: 'Email and auditId are required' },
                { status: 400 }
            );
        }

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        const isHighValue = totalMonthlySavings > 500;

        // Save lead to MongoDB
        await connectDB();
        const lead = await Lead.create({
            email,
            companyName: companyName || '',
            role: role || '',
            teamSize: teamSize || 0,
            auditId,
            totalMonthlySavings,
            isHighValue,
        });

        // Send confirmation email
        try {
            // NOTE: Resend free tier only sends to verified email.
            // In production, verify a domain at resend.com/domains
            // to send to any recipient email address.
            await resend.emails.send({
                from: 'SpendScan <onboarding@resend.dev>',
                to: email,
                subject: 'Your AI Spend Audit Report — SpendScan',
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #ffffff;">
            <div style="margin-bottom: 32px;">
              <span style="background: #22c55e; color: #000; font-weight: bold; padding: 6px 12px; border-radius: 6px; font-size: 14px;">SpendScan</span>
              <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">by Credex</span>
            </div>

            <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 8px; color: #ffffff;">
              Your audit report is ready
            </h1>

            <p style="color: #9ca3af; margin-bottom: 32px; font-size: 16px;">
              We found <strong style="color: #22c55e;">$${totalMonthlySavings}/month</strong> in potential savings for your team.
            </p>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/results/${auditId}"
               style="display: inline-block; background: #22c55e; color: #000; font-weight: bold; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 16px; margin-bottom: 32px;">
              View Full Audit Report →
            </a>

            ${isHighValue ? `
            <div style="background: #111827; border: 1px solid #22c55e33; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
              <p style="color: #22c55e; font-weight: bold; margin-bottom: 8px; font-size: 16px;">
                💡 You qualify for Credex credits
              </p>
              <p style="color: #9ca3af; margin-bottom: 16px; font-size: 14px;">
                With $${totalMonthlySavings}/month in identified savings, 
                our team will reach out to show you how Credex discounted 
                credits can save you even more.
              </p>
              <a href="https://credex.rocks"
                 style="color: #22c55e; text-decoration: underline; font-size: 14px;">
                Learn about Credex →
              </a>
            </div>
            ` : ''}

            <p style="color: #6b7280; font-size: 13px; border-top: 1px solid #1f2937; padding-top: 24px;">
              You're receiving this because you ran an audit on SpendScan.
              This is a free tool by Credex — we help startups spend less on AI infrastructure.
            </p>
          </div>
        `,
            });
        } catch (emailError) {
            // Email sending failed — still save the lead
            console.error('Email send failed:', emailError);
        }

        return NextResponse.json({
            success: true,
            isHighValue,
            leadId: lead._id,
        });

    } catch (error) {
        console.error('Lead capture error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
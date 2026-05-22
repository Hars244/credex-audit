import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Audit from '@/models/Audit';
import { runAudit } from '@/lib/auditEngine';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tools, teamSize, useCase } = body;

    if (!tools || !teamSize || !useCase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const auditResult = runAudit(tools, teamSize, useCase);
    const shareId = nanoid(10);

    await connectDB();
    const audit = await Audit.create({
      shareId,
      tools,
      teamSize,
      useCase,
      totalMonthlySavings: auditResult.totalMonthlySavings,
      totalAnnualSavings: auditResult.totalAnnualSavings,
      recommendations: auditResult.recommendations,
      aiSummary: '',
    });

    return NextResponse.json({
      shareId: audit.shareId,
      totalMonthlySavings: auditResult.totalMonthlySavings,
      totalAnnualSavings: auditResult.totalAnnualSavings,
      recommendations: auditResult.recommendations,
      isOptimal: auditResult.isOptimal,
      isHighValue: auditResult.isHighValue,
    });

  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
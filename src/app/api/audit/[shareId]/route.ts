import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Audit from '@/models/Audit';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ shareId: string }> }
) {
  try {
    await connectDB();

    const { shareId } = await context.params;

    const audit = await Audit.findOne({ shareId });

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(audit);

  } catch (error) {
    console.error('Fetch audit error:', error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
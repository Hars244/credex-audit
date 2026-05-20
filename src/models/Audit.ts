import mongoose, { Schema, Document } from 'mongoose';

export interface IAudit extends Document {
  shareId: string;
  tools: {
    name: string;
    plan: string;
    monthlySpend: number;
    seats: number;
  }[];
  teamSize: number;
  useCase: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: {
    toolName: string;
    currentSpend: number;
    recommendedAction: string;
    savings: number;
    reason: string;
  }[];
  aiSummary: string;
  createdAt: Date;
}

const AuditSchema = new Schema<IAudit>({
  shareId: { type: String, required: true, unique: true },
  tools: [
    {
      name: { type: String, required: true },
      plan: { type: String, required: true },
      monthlySpend: { type: Number, required: true },
      seats: { type: Number, required: true },
    },
  ],
  teamSize: { type: Number, required: true },
  useCase: { type: String, required: true },
  totalMonthlySavings: { type: Number, required: true },
  totalAnnualSavings: { type: Number, required: true },
  recommendations: [
    {
      toolName: { type: String, required: true },
      currentSpend: { type: Number, required: true },
      recommendedAction: { type: String, required: true },
      savings: { type: Number, required: true },
      reason: { type: String, required: true },
    },
  ],
  aiSummary: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Audit || mongoose.model<IAudit>('Audit', AuditSchema);
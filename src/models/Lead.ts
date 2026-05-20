import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  totalMonthlySavings: number;
  isHighValue: boolean;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>({
  email: { type: String, required: true },
  companyName: { type: String },
  role: { type: String },
  teamSize: { type: Number },
  auditId: { type: String, required: true },
  totalMonthlySavings: { type: Number, required: true },
  isHighValue: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
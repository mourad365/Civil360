import mongoose, { Schema, Document } from 'mongoose';

export interface IAiPlanAnalysis extends Document {
  projectId: mongoose.Types.ObjectId;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  status: 'processing' | 'completed' | 'failed' | 'queued';
  progress?: number;
  aiConfidence?: string;
  extractedData?: any;
  createdAt: Date;
  updatedAt: Date;
}

const AiPlanAnalysisSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  fileName: { type: String, required: true, trim: true },
  fileSize: { type: Number },
  fileType: { type: String },
  status: { type: String, enum: ['processing', 'completed', 'failed', 'queued'], default: 'processing' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  aiConfidence: { type: String },
  extractedData: { type: Schema.Types.Mixed }
}, { timestamps: true });

AiPlanAnalysisSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.model<IAiPlanAnalysis>('AiPlanAnalysis', AiPlanAnalysisSchema);

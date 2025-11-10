import mongoose, { Schema, Document } from 'mongoose';

export interface IAiPlanAnalysis extends Document {
  projectId: mongoose.Types.ObjectId;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  status?: string;
  progress?: number;
  aiConfidence?: string;
  extractedData?: any;
}

const AiPlanAnalysisSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  fileName: { type: String },
  fileSize: { type: Number },
  fileType: { type: String },
  status: { type: String },
  progress: { type: Number },
  aiConfidence: { type: String },
  extractedData: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<IAiPlanAnalysis>('AiPlanAnalysis', AiPlanAnalysisSchema);

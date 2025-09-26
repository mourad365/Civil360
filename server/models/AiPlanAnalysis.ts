import mongoose, { Schema, Document } from 'mongoose';

export interface IAiPlanAnalysis extends Document {
  projectId: mongoose.Types.ObjectId;
  fileName: string;
  fileSize?: number;
  fileType?: 'dwg' | 'ifc' | 'pdf' | 'rvt' | 'skp';
  status: 'processing' | 'completed' | 'failed' | 'queued';
  progress: number;
  aiConfidence?: string;
  extractedData?: {
    elements?: number;
    openings?: number;
    networks?: number;
    concrete?: string;
    steel?: string;
    formwork?: string;
    materials?: any[];
    quantities?: any[];
    [key: string]: any;
  };
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AiPlanAnalysisSchema: Schema = new Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  fileSize: {
    type: Number,
    min: 0
  },
  fileType: {
    type: String,
    enum: ['dwg', 'ifc', 'pdf', 'rvt', 'skp'],
    lowercase: true
  },
  status: {
    type: String,
    required: true,
    enum: ['processing', 'completed', 'failed', 'queued'],
    default: 'queued'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  aiConfidence: {
    type: String,
    trim: true
  },
  extractedData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  processingStartedAt: {
    type: Date
  },
  processingCompletedAt: {
    type: Date
  },
  errorMessage: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
AiPlanAnalysisSchema.index({ projectId: 1 });
AiPlanAnalysisSchema.index({ status: 1 });
AiPlanAnalysisSchema.index({ createdAt: -1 });

export default mongoose.model<IAiPlanAnalysis>('AiPlanAnalysis', AiPlanAnalysisSchema);

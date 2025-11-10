import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
  projectId: mongoose.Types.ObjectId;
  predictionType: 'delay' | 'cost' | 'risk' | 'quality' | 'resource' | 'weather';
  confidence: string;
  prediction: {
    delayDays?: string;
    costOverrun?: string;
    riskLevel?: string;
    qualityScore?: string;
    resourceNeeded?: string;
    weatherImpact?: string;
    causes?: string[];
    recommendations?: string[];
    timeline?: any;
    [key: string]: any;
  };
  basedOnData?: {
    historicalProjects?: number;
    currentMetrics?: any;
    externalFactors?: string[];
  };
  accuracy?: number;
  actualOutcome?: any;
  feedback?: {
    wasAccurate?: boolean;
    actualValues?: any;
    notes?: string;
  };
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PredictionSchema: Schema = new Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  predictionType: {
    type: String,
    required: true,
    enum: ['delay', 'cost', 'risk', 'quality', 'resource', 'weather']
  },
  confidence: {
    type: String,
    required: true,
    trim: true
  },
  prediction: {
    type: Schema.Types.Mixed,
    required: true
  },
  basedOnData: {
    historicalProjects: {
      type: Number,
      min: 0
    },
    currentMetrics: Schema.Types.Mixed,
    externalFactors: [String]
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 1
  },
  actualOutcome: {
    type: Schema.Types.Mixed
  },
  feedback: {
    wasAccurate: Boolean,
    actualValues: Schema.Types.Mixed,
    notes: {
      type: String,
      trim: true
    }
  },
  validUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
PredictionSchema.index({ projectId: 1 });
PredictionSchema.index({ predictionType: 1 });
PredictionSchema.index({ createdAt: -1 });
PredictionSchema.index({ validUntil: 1 });

export default mongoose.models.Prediction || mongoose.model<IPrediction>('Prediction', PredictionSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IQualityCheck extends Document {
  projectId: mongoose.Types.ObjectId;
  checkType: 'concrete' | 'steel' | 'visual' | 'electrical' | 'plumbing' | 'safety';
  location?: string;
  latitude?: string;
  longitude?: string;
  status: 'passed' | 'failed' | 'pending' | 'requires_review';
  aiScore?: string;
  imageUrl?: string;
  images?: string[];
  notes?: string;
  inspector?: string;
  inspectorId?: mongoose.Types.ObjectId;
  defects?: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendations?: string;
  }[];
  correctionRequired?: boolean;
  correctionDeadline?: Date;
  correctionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QualityCheckSchema: Schema = new Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  checkType: {
    type: String,
    required: true,
    enum: ['concrete', 'steel', 'visual', 'electrical', 'plumbing', 'safety']
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200
  },
  latitude: {
    type: String,
    trim: true
  },
  longitude: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['passed', 'failed', 'pending', 'requires_review'],
    default: 'pending'
  },
  aiScore: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  inspector: {
    type: String,
    trim: true,
    maxlength: 100
  },
  inspectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  defects: [{
    type: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical']
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    recommendations: {
      type: String,
      trim: true
    }
  }],
  correctionRequired: {
    type: Boolean,
    default: false
  },
  correctionDeadline: {
    type: Date
  },
  correctionNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
QualityCheckSchema.index({ projectId: 1 });
QualityCheckSchema.index({ status: 1 });
QualityCheckSchema.index({ checkType: 1 });
QualityCheckSchema.index({ inspectorId: 1 });
QualityCheckSchema.index({ createdAt: -1 });
QualityCheckSchema.index({ latitude: 1, longitude: 1 });

export default mongoose.model<IQualityCheck>('QualityCheck', QualityCheckSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IQualityCheck extends Document {
  projectId: mongoose.Types.ObjectId;
  checkType: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  status: 'passed' | 'failed' | 'pending' | 'recheck';
  aiScore?: string;
  imageUrl?: string;
  notes?: string;
  inspector?: string;
  inspectorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QualityCheckSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  checkType: { type: String, required: true },
  location: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  status: { type: String, enum: ['passed', 'failed', 'pending', 'recheck'], default: 'pending' },
  aiScore: { type: String },
  imageUrl: { type: String },
  notes: { type: String },
  inspector: { type: String },
  inspectorId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

QualityCheckSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.model<IQualityCheck>('QualityCheck', QualityCheckSchema);

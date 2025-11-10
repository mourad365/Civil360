import mongoose, { Schema, Document } from 'mongoose';

export interface IQualityCheck extends Document {
  checkType: string;
  status?: string;
}

const QualityCheckSchema: Schema = new Schema({
  checkType: { type: String },
  status: { type: String }
}, { timestamps: true });

export default mongoose.model<IQualityCheck>('QualityCheck', QualityCheckSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IOdooSync extends Document {
  entityType: string;
  entityId: string;
  syncType: 'import' | 'export';
  status: 'success' | 'pending' | 'failed';
  errorMessage?: string | null;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OdooSyncSchema: Schema = new Schema({
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  syncType: { type: String, enum: ['import', 'export'], required: true },
  status: { type: String, enum: ['success', 'pending', 'failed'], default: 'pending' },
  errorMessage: { type: String, default: null },
  lastSync: { type: Date, default: Date.now }
}, { timestamps: true });

OdooSyncSchema.index({ entityType: 1, entityId: 1 });

export default mongoose.models.OdooSync || mongoose.model<IOdooSync>('OdooSync', OdooSyncSchema);

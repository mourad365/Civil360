import mongoose, { Schema, Document } from 'mongoose';

export interface IMobileSyncQueue extends Document {
  deviceId: string;
  action: string;
  entityType: string;
  entityData?: any;
  synced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MobileSyncQueueSchema: Schema = new Schema({
  deviceId: { type: String, required: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityData: { type: Schema.Types.Mixed },
  synced: { type: Boolean, default: false }
}, { timestamps: true });

MobileSyncQueueSchema.index({ synced: 1, createdAt: 1 });

export default mongoose.model<IMobileSyncQueue>('MobileSyncQueue', MobileSyncQueueSchema);

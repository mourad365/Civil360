import mongoose, { Schema, Document } from 'mongoose';

export interface IMobileSyncQueue extends Document {
  payload: any;
  status?: string;
}

const MobileSyncQueueSchema: Schema = new Schema({
  payload: { type: Schema.Types.Mixed },
  status: { type: String }
}, { timestamps: true });

export default mongoose.model<IMobileSyncQueue>('MobileSyncQueue', MobileSyncQueueSchema);

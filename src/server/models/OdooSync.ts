import mongoose, { Schema, Document } from 'mongoose';

export interface IOdooSync extends Document {
  externalId?: string;
  status?: string;
}

const OdooSyncSchema: Schema = new Schema({
  externalId: { type: String },
  status: { type: String }
}, { timestamps: true });

export default mongoose.model<IOdooSync>('OdooSync', OdooSyncSchema);

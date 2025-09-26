import mongoose, { Schema, Document } from 'mongoose';

export interface IMobileSyncQueue extends Document {
  deviceId: string;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId?: string;
  entityData?: any;
  synced: boolean;
  syncAttempts: number;
  lastSyncAttempt?: Date;
  syncError?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

const MobileSyncQueueSchema: Schema = new Schema({
  deviceId: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete']
  },
  entityType: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  entityId: {
    type: String,
    trim: true
  },
  entityData: {
    type: Schema.Types.Mixed
  },
  synced: {
    type: Boolean,
    default: false
  },
  syncAttempts: {
    type: Number,
    default: 0,
    min: 0
  },
  lastSyncAttempt: {
    type: Date
  },
  syncError: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
MobileSyncQueueSchema.index({ deviceId: 1 });
MobileSyncQueueSchema.index({ synced: 1 });
MobileSyncQueueSchema.index({ entityType: 1 });
MobileSyncQueueSchema.index({ priority: 1, createdAt: 1 });
MobileSyncQueueSchema.index({ createdAt: -1 });

export default mongoose.model<IMobileSyncQueue>('MobileSyncQueue', MobileSyncQueueSchema);

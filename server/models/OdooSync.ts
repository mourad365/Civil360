import mongoose, { Schema, Document } from 'mongoose';

export interface IOdooSync extends Document {
  entityType: string;
  entityId: string;
  syncType: 'import' | 'export' | 'bidirectional';
  status: 'success' | 'failed' | 'pending' | 'in_progress';
  errorMessage?: string;
  lastSync?: Date;
  syncData?: any;
  retryCount: number;
  maxRetries: number;
  nextRetry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OdooSyncSchema: Schema = new Schema({
  entityType: {
    type: String,
    required: true,
    trim: true,
    enum: ['personnel', 'projects', 'facturation', 'inventory', 'purchases', 'timesheets']
  },
  entityId: {
    type: String,
    required: true,
    trim: true
  },
  syncType: {
    type: String,
    required: true,
    enum: ['import', 'export', 'bidirectional']
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'failed', 'pending', 'in_progress'],
    default: 'pending'
  },
  errorMessage: {
    type: String,
    trim: true
  },
  lastSync: {
    type: Date,
    default: Date.now
  },
  syncData: {
    type: Schema.Types.Mixed
  },
  retryCount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxRetries: {
    type: Number,
    default: 3,
    min: 0
  },
  nextRetry: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
OdooSyncSchema.index({ entityType: 1 });
OdooSyncSchema.index({ entityId: 1 });
OdooSyncSchema.index({ status: 1 });
OdooSyncSchema.index({ lastSync: -1 });
OdooSyncSchema.index({ nextRetry: 1 });

export default mongoose.model<IOdooSync>('OdooSync', OdooSyncSchema);

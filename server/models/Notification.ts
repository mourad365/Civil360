import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'urgent';
  category: 'project' | 'budget' | 'equipment' | 'delivery' | 'quality' | 'safety' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  recipients: Array<{
    user: mongoose.Types.ObjectId;
    role?: string;
    read: boolean;
    readAt?: Date;
  }>;
  relatedEntity: {
    entityType: 'project' | 'equipment' | 'order' | 'supplier' | 'user';
    entityId: mongoose.Types.ObjectId;
  };
  actions?: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
  autoResolve: boolean;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
  expiresAt?: Date;
  metadata: any;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success', 'urgent'],
    required: true
  },
  category: {
    type: String,
    enum: ['project', 'budget', 'equipment', 'delivery', 'quality', 'safety', 'system'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  recipients: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String },
    read: { type: Boolean, default: false },
    readAt: { type: Date }
  }],
  relatedEntity: {
    entityType: { type: String, enum: ['project', 'equipment', 'order', 'supplier', 'user'] },
    entityId: { type: Schema.Types.ObjectId }
  },
  actions: [{
    label: { type: String, required: true },
    action: { type: String, required: true },
    url: { type: String }
  }],
  autoResolve: { type: Boolean, default: false },
  resolvedAt: { type: Date },
  resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date },
  metadata: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Indexes for better performance
NotificationSchema.index({ 'recipients.user': 1 });
NotificationSchema.index({ type: 1, priority: 1 });
NotificationSchema.index({ category: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseOrder extends Document {
  orderNumber: string;
  project: mongoose.Types.ObjectId;
  supplier: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'confirmed' | 'partial_delivery' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dates: {
    created: Date;
    requested: Date;
    approved?: Date;
    expectedDelivery: Date;
    actualDelivery?: Date;
  };
  items: Array<{
    materialType: string;
    description: string;
    specification: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    deliveredQuantity: number;
    status: 'pending' | 'partial' | 'delivered' | 'cancelled';
  }>;
  delivery: {
    address: string;
    instructions: string;
    contactPerson: string;
    phone: string;
  };
  financial: {
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    paymentTerms: number;
  };
  tracking: Array<{
    status: string;
    date: Date;
    notes: string;
    updatedBy: mongoose.Types.ObjectId;
  }>;
  documents: Array<{
    name: string;
    type: 'po' | 'confirmation' | 'invoice' | 'delivery_note';
    url: string;
    uploadedAt: Date;
  }>;
  notes: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseOrderSchema: Schema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'sent', 'confirmed', 'partial_delivery', 'completed', 'cancelled'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dates: {
    created: { type: Date, default: Date.now },
    requested: { type: Date, required: true },
    approved: { type: Date },
    expectedDelivery: { type: Date, required: true },
    actualDelivery: { type: Date }
  },
  items: [{
    materialType: { type: String, required: true },
    description: { type: String, required: true },
    specification: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    deliveredQuantity: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['pending', 'partial', 'delivered', 'cancelled'], default: 'pending' }
  }],
  delivery: {
    address: { type: String, required: true },
    instructions: { type: String },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true }
  },
  financial: {
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    taxAmount: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'MAD' },
    paymentTerms: { type: Number, default: 30 }
  },
  tracking: [{
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  }],
  documents: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['po', 'confirmation', 'invoice', 'delivery_note'], required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes for better performance
// orderNumber is already unique, removing duplicate index
PurchaseOrderSchema.index({ project: 1 });
PurchaseOrderSchema.index({ supplier: 1 });
PurchaseOrderSchema.index({ status: 1 });
PurchaseOrderSchema.index({ 'dates.expectedDelivery': 1 });

export default mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);

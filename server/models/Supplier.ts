import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  code: string;
  contact: {
    primaryContact: string;
    email: string;
    phone: string;
    address: string;
    website?: string;
  };
  type: 'materials' | 'equipment' | 'services';
  categories: string[];
  rating: {
    quality: number;
    delivery: number;
    price: number;
    service: number;
    overall: number;
  };
  performance: {
    totalOrders: number;
    onTimeDeliveries: number;
    onTimePercentage: number;
    averageDeliveryTime: number;
    lastDelivery?: Date;
  };
  financial: {
    creditLimit: number;
    paymentTerms: number; // days
    currency: string;
    totalSpent: number;
    outstandingAmount: number;
  };
  contracts: Array<{
    type: 'framework' | 'fixed' | 'spot';
    startDate: Date;
    endDate: Date;
    amount: number;
    status: 'active' | 'expired' | 'pending';
    terms: string;
  }>;
  documents: Array<{
    name: string;
    type: 'certificate' | 'license' | 'insurance' | 'contract';
    url: string;
    expiryDate?: Date;
  }>;
  isActive: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  contact: {
    primaryContact: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    website: { type: String }
  },
  type: {
    type: String,
    enum: ['materials', 'equipment', 'services'],
    required: true
  },
  categories: [{ type: String }],
  rating: {
    quality: { type: Number, min: 0, max: 10, default: 5 },
    delivery: { type: Number, min: 0, max: 10, default: 5 },
    price: { type: Number, min: 0, max: 10, default: 5 },
    service: { type: Number, min: 0, max: 10, default: 5 },
    overall: { type: Number, min: 0, max: 10, default: 5 }
  },
  performance: {
    totalOrders: { type: Number, default: 0 },
    onTimeDeliveries: { type: Number, default: 0 },
    onTimePercentage: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 0 },
    lastDelivery: { type: Date }
  },
  financial: {
    creditLimit: { type: Number, default: 0 },
    paymentTerms: { type: Number, default: 30 },
    currency: { type: String, default: 'MAD' },
    totalSpent: { type: Number, default: 0 },
    outstandingAmount: { type: Number, default: 0 }
  },
  contracts: [{
    type: { type: String, enum: ['framework', 'fixed', 'spot'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['active', 'expired', 'pending'], default: 'pending' },
    terms: { type: String }
  }],
  documents: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['certificate', 'license', 'insurance', 'contract'], required: true },
    url: { type: String, required: true },
    expiryDate: { type: Date }
  }],
  isActive: { type: Boolean, default: true },
  notes: { type: String }
}, {
  timestamps: true
});

// Indexes for better performance
SupplierSchema.index({ code: 1 });
SupplierSchema.index({ type: 1 });
SupplierSchema.index({ categories: 1 });
SupplierSchema.index({ 'rating.overall': -1 });

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);

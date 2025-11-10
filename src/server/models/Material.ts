import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  name: string;
  code: string;
  category: 'concrete' | 'steel' | 'timber' | 'aggregate' | 'cement' | 'tools' | 'safety' | 'electrical' | 'plumbing' | 'other';
  subcategory: string;
  specifications: {
    grade?: string;
    strength?: string;
    dimensions?: string;
    weight?: number;
    color?: string;
    finish?: string;
  };
  unit: string;
  suppliers: Array<{
    supplier: mongoose.Types.ObjectId;
    unitPrice: number;
    minimumOrder: number;
    leadTime: number;
    isPreferred: boolean;
  }>;
  inventory: {
    totalStock: number;
    reservedStock: number;
    availableStock: number;
    minimumLevel: number;
    maximumLevel: number;
    reorderPoint: number;
    averageConsumption: number;
  };
  locations: Array<{
    project: mongoose.Types.ObjectId;
    warehouse?: string;
    quantity: number;
    lastUpdated: Date;
  }>;
  pricing: {
    averageCost: number;
    lastCost: number;
    standardCost: number;
    currency: string;
  };
  quality: {
    qualityGrade: 'A' | 'B' | 'C';
    certifications: string[];
    testResults: Array<{
      date: Date;
      testType: string;
      result: string;
      passed: boolean;
    }>;
  };
  usage: Array<{
    project: mongoose.Types.ObjectId;
    estimatedQuantity: number;
    actualUsed: number;
    wastage: number;
    efficiency: number;
  }>;
  documents: Array<{
    name: string;
    type: 'datasheet' | 'certificate' | 'test_report' | 'safety_sheet';
    url: string;
    uploadedAt: Date;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['concrete', 'steel', 'timber', 'aggregate', 'cement', 'tools', 'safety', 'electrical', 'plumbing', 'other'],
    required: true
  },
  subcategory: { type: String, required: true },
  specifications: {
    grade: { type: String },
    strength: { type: String },
    dimensions: { type: String },
    weight: { type: Number },
    color: { type: String },
    finish: { type: String }
  },
  unit: { type: String, required: true },
  suppliers: [{
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    unitPrice: { type: Number, required: true },
    minimumOrder: { type: Number, default: 1 },
    leadTime: { type: Number, default: 1 },
    isPreferred: { type: Boolean, default: false }
  }],
  inventory: {
    totalStock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },
    availableStock: { type: Number, default: 0 },
    minimumLevel: { type: Number, default: 0 },
    maximumLevel: { type: Number, default: 1000 },
    reorderPoint: { type: Number, default: 10 },
    averageConsumption: { type: Number, default: 0 }
  },
  locations: [{
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    warehouse: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }],
  pricing: {
    averageCost: { type: Number, default: 0 },
    lastCost: { type: Number, default: 0 },
    standardCost: { type: Number, default: 0 },
    currency: { type: String, default: 'MAD' }
  },
  quality: {
    qualityGrade: { type: String, enum: ['A', 'B', 'C'], default: 'B' },
    certifications: [{ type: String }],
    testResults: [{
      date: { type: Date, required: true },
      testType: { type: String, required: true },
      result: { type: String, required: true },
      passed: { type: Boolean, required: true }
    }]
  },
  usage: [{
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    estimatedQuantity: { type: Number, required: true },
    actualUsed: { type: Number, default: 0 },
    wastage: { type: Number, default: 0 },
    efficiency: { type: Number, default: 100 }
  }],
  documents: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['datasheet', 'certificate', 'test_report', 'safety_sheet'], required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes for better performance
MaterialSchema.index({ code: 1 });
MaterialSchema.index({ category: 1, subcategory: 1 });
MaterialSchema.index({ 'inventory.availableStock': 1 });

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);

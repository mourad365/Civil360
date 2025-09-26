import mongoose, { Schema, Document } from 'mongoose';

export interface IEquipment extends Document {
  name: string;
  code: string;
  type: 'compactor' | 'vibrator' | 'crane' | 'mixer' | 'excavator' | 'loader' | 'truck' | 'scaffolding' | 'other';
  category: 'owned' | 'rented' | 'leased';
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_order' | 'transferred';
  specifications: {
    model: string;
    manufacturer: string;
    year: number;
    capacity: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    fuelType?: string;
    powerRating?: string;
  };
  location: {
    currentProject?: mongoose.Types.ObjectId;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    lastUpdated: Date;
  };
  assignment: {
    assignedTo?: mongoose.Types.ObjectId;
    assignedProject?: mongoose.Types.ObjectId;
    assignedDate?: Date;
    expectedReturnDate?: Date;
  };
  utilization: {
    hoursUsed: number;
    totalHours: number;
    utilizationRate: number;
    lastUsed?: Date;
  };
  maintenance: {
    lastMaintenance?: Date;
    nextMaintenance?: Date;
    maintenanceType?: 'preventive' | 'corrective' | 'inspection';
    maintenanceHistory: Array<{
      date: Date;
      type: 'preventive' | 'corrective' | 'inspection';
      description: string;
      cost: number;
      performedBy: string;
      nextMaintenanceDate?: Date;
    }>;
  };
  rental: {
    supplier?: mongoose.Types.ObjectId;
    dailyRate?: number;
    weeklyRate?: number;
    monthlyRate?: number;
    rentalStartDate?: Date;
    rentalEndDate?: Date;
    totalRentalCost?: number;
  };
  financial: {
    purchasePrice?: number;
    currentValue?: number;
    depreciationRate?: number;
    insuranceValue?: number;
    totalMaintenanceCost: number;
  };
  transfers: Array<{
    fromProject?: mongoose.Types.ObjectId;
    toProject: mongoose.Types.ObjectId;
    transferDate: Date;
    requestedBy: mongoose.Types.ObjectId;
    approvedBy?: mongoose.Types.ObjectId;
    status: 'requested' | 'approved' | 'in_transit' | 'completed' | 'cancelled';
    estimatedArrival?: Date;
    actualArrival?: Date;
    transferCost?: number;
    notes?: string;
  }>;
  documents: Array<{
    name: string;
    type: 'manual' | 'certificate' | 'insurance' | 'maintenance' | 'rental';
    url: string;
    uploadedAt: Date;
  }>;
  alerts: Array<{
    type: 'maintenance_due' | 'rental_expiring' | 'low_utilization' | 'breakdown';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    createdAt: Date;
    resolved: boolean;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['compactor', 'vibrator', 'crane', 'mixer', 'excavator', 'loader', 'truck', 'scaffolding', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: ['owned', 'rented', 'leased'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'out_of_order', 'transferred'],
    default: 'available'
  },
  specifications: {
    model: { type: String, required: true },
    manufacturer: { type: String, required: true },
    year: { type: Number, required: true },
    capacity: { type: String },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    fuelType: { type: String },
    powerRating: { type: String }
  },
  location: {
    currentProject: { type: Schema.Types.ObjectId, ref: 'Project' },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    lastUpdated: { type: Date, default: Date.now }
  },
  assignment: {
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedProject: { type: Schema.Types.ObjectId, ref: 'Project' },
    assignedDate: { type: Date },
    expectedReturnDate: { type: Date }
  },
  utilization: {
    hoursUsed: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    utilizationRate: { type: Number, default: 0 },
    lastUsed: { type: Date }
  },
  maintenance: {
    lastMaintenance: { type: Date },
    nextMaintenance: { type: Date },
    maintenanceType: { type: String, enum: ['preventive', 'corrective', 'inspection'] },
    maintenanceHistory: [{
      date: { type: Date, required: true },
      type: { type: String, enum: ['preventive', 'corrective', 'inspection'], required: true },
      description: { type: String, required: true },
      cost: { type: Number, default: 0 },
      performedBy: { type: String, required: true },
      nextMaintenanceDate: { type: Date }
    }]
  },
  rental: {
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    dailyRate: { type: Number },
    weeklyRate: { type: Number },
    monthlyRate: { type: Number },
    rentalStartDate: { type: Date },
    rentalEndDate: { type: Date },
    totalRentalCost: { type: Number, default: 0 }
  },
  financial: {
    purchasePrice: { type: Number },
    currentValue: { type: Number },
    depreciationRate: { type: Number },
    insuranceValue: { type: Number },
    totalMaintenanceCost: { type: Number, default: 0 }
  },
  transfers: [{
    fromProject: { type: Schema.Types.ObjectId, ref: 'Project' },
    toProject: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    transferDate: { type: Date, required: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['requested', 'approved', 'in_transit', 'completed', 'cancelled'], default: 'requested' },
    estimatedArrival: { type: Date },
    actualArrival: { type: Date },
    transferCost: { type: Number },
    notes: { type: String }
  }],
  documents: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['manual', 'certificate', 'insurance', 'maintenance', 'rental'], required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  alerts: [{
    type: { type: String, enum: ['maintenance_due', 'rental_expiring', 'low_utilization', 'breakdown'], required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    createdAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes for better performance
EquipmentSchema.index({ code: 1 });
EquipmentSchema.index({ type: 1 });
EquipmentSchema.index({ status: 1 });
EquipmentSchema.index({ category: 1 });
EquipmentSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IEquipment>('Equipment', EquipmentSchema);

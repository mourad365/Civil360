import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  code: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  client: {
    name: string;
    contact: string;
    email: string;
    phone: string;
  };
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dates: {
    startDate: Date;
    endDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
  };
  budget: {
    estimated: number;
    allocated: number;
    spent: number;
    labor: number;
    materials: number;
    equipment: number;
    contingency: number;
  };
  structure: Array<{
    level: number;
    name: string;
    type: 'foundation' | 'floor' | 'roof' | 'infrastructure';
    surface: number;
    height: number;
    slabThickness: number;
    specifications: string;
    materials: Array<{
      type: string;
      quantity: number;
      unit: string;
      unitCost: number;
      totalCost: number;
    }>;
    labor: {
      hours: number;
      cost: number;
    };
  }>;
  phases: Array<{
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    duration: number;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    assignedTeam: mongoose.Types.ObjectId[];
    dependencies: string[];
    progress: number;
  }>;
  team: {
    projectManager: mongoose.Types.ObjectId;
    engineers: mongoose.Types.ObjectId[];
    workers: mongoose.Types.ObjectId[];
  };
  progress: {
    overall: number;
    phases: Array<{
      phaseId: string;
      completion: number;
    }>;
  };
  risks: Array<{
    type: 'budget' | 'schedule' | 'quality' | 'safety' | 'weather';
    description: string;
    impact: 'low' | 'medium' | 'high';
    probability: 'low' | 'medium' | 'high';
    mitigation: string;
    status: 'open' | 'mitigated' | 'closed';
  }>;
  documents: Array<{
    name: string;
    type: 'plan' | 'contract' | 'permit' | 'report';
    url: string;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
  }>;
  qualityChecks: Array<{
    date: Date;
    inspector: mongoose.Types.ObjectId;
    phase: string;
    results: Array<{
      criteria: string;
      status: 'pass' | 'fail' | 'warning';
      notes: string;
    }>;
  }>;
  dailyReports: Array<{
    date: Date;
    weather: string;
    workersPresent: number;
    materialsUsed: Array<{
      type: string;
      quantity: number;
    }>;
    hoursWorked: number;
    progress: string;
    issues: string[];
    photos: string[];
    reportedBy: mongoose.Types.ObjectId;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  client: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  dates: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    actualStartDate: Date,
    actualEndDate: Date
  },
  budget: {
    estimated: { type: Number, required: true },
    allocated: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    labor: { type: Number, default: 0 },
    materials: { type: Number, default: 0 },
    equipment: { type: Number, default: 0 },
    contingency: { type: Number, default: 0 }
  },
  structure: [{
    level: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['foundation', 'floor', 'roof', 'infrastructure'], required: true },
    surface: { type: Number, required: true },
    height: { type: Number, required: true },
    slabThickness: { type: Number, required: true },
    specifications: { type: String },
    materials: [{
      type: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
      unitCost: { type: Number, required: true },
      totalCost: { type: Number, required: true }
    }],
    labor: {
      hours: { type: Number, default: 0 },
      cost: { type: Number, default: 0 }
    }
  }],
  phases: [{
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'delayed'], default: 'pending' },
    assignedTeam: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dependencies: [{ type: String }],
    progress: { type: Number, default: 0, min: 0, max: 100 }
  }],
  team: {
    projectManager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    engineers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    workers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  progress: {
    overall: { type: Number, default: 0, min: 0, max: 100 },
    phases: [{
      phaseId: { type: String, required: true },
      completion: { type: Number, default: 0, min: 0, max: 100 }
    }]
  },
  risks: [{
    type: { type: String, enum: ['budget', 'schedule', 'quality', 'safety', 'weather'], required: true },
    description: { type: String, required: true },
    impact: { type: String, enum: ['low', 'medium', 'high'], required: true },
    probability: { type: String, enum: ['low', 'medium', 'high'], required: true },
    mitigation: { type: String },
    status: { type: String, enum: ['open', 'mitigated', 'closed'], default: 'open' }
  }],
  documents: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['plan', 'contract', 'permit', 'report'], required: true },
    url: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  qualityChecks: [{
    date: { type: Date, required: true },
    inspector: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    phase: { type: String, required: true },
    results: [{
      criteria: { type: String, required: true },
      status: { type: String, enum: ['pass', 'fail', 'warning'], required: true },
      notes: { type: String }
    }]
  }],
  dailyReports: [{
    date: { type: Date, required: true },
    weather: { type: String },
    workersPresent: { type: Number, default: 0 },
    materialsUsed: [{
      type: { type: String, required: true },
      quantity: { type: Number, required: true }
    }],
    hoursWorked: { type: Number, default: 0 },
    progress: { type: String },
    issues: [{ type: String }],
    photos: [{ type: String }],
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index for better performance
ProjectSchema.index({ code: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ 'dates.startDate': 1, 'dates.endDate': 1 });
ProjectSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IProject>('Project', ProjectSchema);

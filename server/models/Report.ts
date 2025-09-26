import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom' | 'financial' | 'progress' | 'equipment' | 'quality';
  category: 'project' | 'financial' | 'equipment' | 'procurement' | 'performance' | 'compliance';
  description: string;
  generatedBy: mongoose.Types.ObjectId;
  generatedFor: mongoose.Types.ObjectId[];
  scheduleType: 'manual' | 'automatic';
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  filters: {
    projects?: mongoose.Types.ObjectId[];
    departments?: string[];
    categories?: string[];
    status?: string[];
  };
  data: any;
  summary: {
    totalProjects?: number;
    totalBudget?: number;
    completionRate?: number;
    keyMetrics?: Array<{
      name: string;
      value: number;
      unit: string;
      trend?: 'up' | 'down' | 'stable';
    }>;
  };
  charts: Array<{
    type: 'bar' | 'line' | 'pie' | 'area' | 'gauge';
    title: string;
    data: any;
    config?: any;
  }>;
  recommendations: Array<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    suggestedAction: string;
  }>;
  export: {
    formats: Array<'pdf' | 'excel' | 'csv'>;
    urls: Array<{
      format: string;
      url: string;
      generatedAt: Date;
    }>;
  };
  status: 'generating' | 'completed' | 'failed' | 'scheduled';
  isRecurring: boolean;
  nextGeneration?: Date;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'custom', 'financial', 'progress', 'equipment', 'quality'],
    required: true
  },
  category: {
    type: String,
    enum: ['project', 'financial', 'equipment', 'procurement', 'performance', 'compliance'],
    required: true
  },
  description: { type: String },
  generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  generatedFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  scheduleType: {
    type: String,
    enum: ['manual', 'automatic'],
    default: 'manual'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly']
  },
  dateRange: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  filters: {
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    departments: [{ type: String }],
    categories: [{ type: String }],
    status: [{ type: String }]
  },
  data: { type: Schema.Types.Mixed },
  summary: {
    totalProjects: { type: Number },
    totalBudget: { type: Number },
    completionRate: { type: Number },
    keyMetrics: [{
      name: { type: String, required: true },
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      trend: { type: String, enum: ['up', 'down', 'stable'] }
    }]
  },
  charts: [{
    type: { type: String, enum: ['bar', 'line', 'pie', 'area', 'gauge'], required: true },
    title: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    config: { type: Schema.Types.Mixed }
  }],
  recommendations: [{
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    suggestedAction: { type: String, required: true }
  }],
  export: {
    formats: [{ type: String, enum: ['pdf', 'excel', 'csv'] }],
    urls: [{
      format: { type: String, required: true },
      url: { type: String, required: true },
      generatedAt: { type: Date, default: Date.now }
    }]
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'scheduled'],
    default: 'generating'
  },
  isRecurring: { type: Boolean, default: false },
  nextGeneration: { type: Date },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes for better performance
ReportSchema.index({ type: 1, category: 1 });
ReportSchema.index({ generatedBy: 1 });
ReportSchema.index({ createdAt: -1 });
ReportSchema.index({ nextGeneration: 1 });

export default mongoose.model<IReport>('Report', ReportSchema);

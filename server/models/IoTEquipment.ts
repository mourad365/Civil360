import mongoose, { Schema, Document } from 'mongoose';

export interface IIoTEquipment extends Document {
  name: string;
  type: 'crane' | 'excavator' | 'compactor' | 'mixer' | 'loader' | 'dump_truck' | 'other';
  projectId: mongoose.Types.ObjectId;
  status: 'active' | 'maintenance' | 'offline' | 'error';
  latitude?: string;
  longitude?: string;
  utilization: number;
  batteryLevel?: number;
  lastUpdate: Date;
  sensorData?: {
    temperature?: number;
    vibration?: string;
    fuelLevel?: number;
    loadCapacity?: string;
    windSpeed?: string;
    alert?: string;
    lastReading?: string;
    [key: string]: any;
  };
  maintenanceSchedule?: {
    nextMaintenance?: Date;
    lastMaintenance?: Date;
    maintenanceType?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const IoTEquipmentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['crane', 'excavator', 'compactor', 'mixer', 'loader', 'dump_truck', 'other']
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'maintenance', 'offline', 'error'],
    default: 'active'
  },
  latitude: {
    type: String,
    trim: true
  },
  longitude: {
    type: String,
    trim: true
  },
  utilization: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  sensorData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  maintenanceSchedule: {
    nextMaintenance: Date,
    lastMaintenance: Date,
    maintenanceType: {
      type: String,
      enum: ['routine', 'preventive', 'corrective', 'emergency']
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
IoTEquipmentSchema.index({ projectId: 1 });
IoTEquipmentSchema.index({ status: 1 });
IoTEquipmentSchema.index({ type: 1 });
IoTEquipmentSchema.index({ latitude: 1, longitude: 1 });
IoTEquipmentSchema.index({ lastUpdate: -1 });

// Update lastUpdate timestamp on save
IoTEquipmentSchema.pre('save', function(next) {
  this.lastUpdate = new Date();
  next();
});

export default mongoose.model<IIoTEquipment>('IoTEquipment', IoTEquipmentSchema);

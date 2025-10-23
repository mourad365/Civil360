import mongoose, { Schema, Document } from 'mongoose';

export interface IIoTEquipment extends Document {
  name: string;
  type?: string;
  projectId?: mongoose.Types.ObjectId;
  status?: 'active' | 'offline' | 'maintenance';
  latitude?: string;
  longitude?: string;
  utilization?: number;
  batteryLevel?: number;
  sensorData?: any;
  lastUpdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IoTEquipmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  status: { type: String, enum: ['active', 'offline', 'maintenance'], default: 'active' },
  latitude: { type: String },
  longitude: { type: String },
  utilization: { type: Number, default: 0 },
  batteryLevel: { type: Number, default: 0 },
  sensorData: { type: Schema.Types.Mixed },
  lastUpdate: { type: Date, default: Date.now }
}, { timestamps: true });

IoTEquipmentSchema.index({ projectId: 1 });
IoTEquipmentSchema.index({ status: 1 });

export default mongoose.model<IIoTEquipment>('IoTEquipment', IoTEquipmentSchema);

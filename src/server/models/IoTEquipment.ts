import mongoose, { Schema, Document } from 'mongoose';

export interface IIoTEquipment extends Document {
  name: string;
  type: string;
  status?: string;
}

const IoTEquipmentSchema: Schema = new Schema({
  name: { type: String },
  type: { type: String },
  status: { type: String }
}, { timestamps: true });

export default mongoose.model<IIoTEquipment>('IoTEquipment', IoTEquipmentSchema);

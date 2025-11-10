import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  nom: string;
  nom_ar: string;
  code: string;
  niveau_hierarchique: number;
  
  permissions_id: mongoose.Types.ObjectId;
  
  description: string;
  is_active: boolean;
}

const RoleSchema: Schema = new Schema({
  nom: { type: String, required: true, unique: true },
  nom_ar: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  niveau_hierarchique: { type: Number, required: true, min: 1, max: 10 },
  
  permissions_id: { type: Schema.Types.ObjectId, ref: 'Permission', required: true },
  
  description: { type: String, required: true },
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index pour améliorer les performances (removing duplicate indexes)
RoleSchema.index({ niveau_hierarchique: 1 });
RoleSchema.index({ is_active: 1 });

export default mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);

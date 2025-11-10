import mongoose, { Schema, Document } from 'mongoose';

// Interface pour un décompte de sous-traitant
export interface IDecompte extends Document {
  id_decompte: string;
  nom: string;
  telephone: string;
  chantier: string;
  date: Date;
  taches: Array<{
    description: string;
    quantite: number;
    unite: string;
    prix: number;
    avancement: number;
  }>;
  statut: 'pending' | 'paid';
  montantTotal: number;
}

const DecompteSchema: Schema = new Schema({
  id_decompte: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  telephone: { type: String, required: true },
  chantier: { type: String, required: true },
  date: { type: Date, required: true },
  taches: [{
    description: { type: String, required: true },
    quantite: { type: Number, required: true },
    unite: { type: String, required: true },
    prix: { type: Number, required: true },
    avancement: { type: Number, min: 0, max: 100, required: true }
  }],
  statut: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  montantTotal: { type: Number, required: true }
}, {
  timestamps: true
});

// Index pour améliorer les performances
DecompteSchema.index({ id_decompte: 1 });
DecompteSchema.index({ nom: 1 });
DecompteSchema.index({ chantier: 1 });
DecompteSchema.index({ statut: 1 });
DecompteSchema.index({ date: -1 });

export default mongoose.models.Decompte || mongoose.model<IDecompte>('Decompte', DecompteSchema);

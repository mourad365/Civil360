import mongoose, { Schema, Document } from 'mongoose';

export interface IDosage extends Document {
  nom: string;
  nom_ar: string;
  type: 'beton' | 'mortier' | 'enduit';
  classe?: string;
  usage: 'fondations' | 'poteaux' | 'poutres' | 'dalles' | 'murs' | 'enduits' | 'chapes';
  
  composition_m3: {
    ciment: {
      quantite_kg: number;
      type: string;
      poids_sac: number;
      nombre_sacs: number;
    };
    gravier?: {
      quantite_kg: number;
      granulometrie: string;
      masse_volumique: number;
    };
    sable: {
      quantite_kg: number;
      type: string;
      masse_volumique: number;
    };
    eau: {
      quantite_litres: number;
      ratio_eau_ciment: number;
    };
    adjuvants?: {
      quantite_kg: number;
      type: string;
    };
  };
  
  proprietes: {
    affaissement?: string;
    resistance_28j?: string;
    duree_malaxage_min: number;
    temps_prise_heures: number;
  };
  
  cout_m3: {
    ciment: number;
    gravier?: number;
    sable: number;
    eau: number;
    adjuvants?: number;
    total: number;
  };
  
  is_default: boolean;
  is_active: boolean;
  created_by: mongoose.Types.ObjectId;
}

const DosageSchema: Schema = new Schema({
  nom: { type: String, required: true },
  nom_ar: { type: String, required: true },
  type: {
    type: String,
    enum: ['beton', 'mortier', 'enduit'],
    required: true
  },
  classe: { type: String },
  usage: {
    type: String,
    enum: ['fondations', 'poteaux', 'poutres', 'dalles', 'murs', 'enduits', 'chapes'],
    required: true
  },
  
  composition_m3: {
    ciment: {
      quantite_kg: { type: Number, required: true },
      type: { type: String, required: true },
      poids_sac: { type: Number, default: 50 },
      nombre_sacs: { type: Number, required: true }
    },
    gravier: {
      quantite_kg: { type: Number },
      granulometrie: { type: String },
      masse_volumique: { type: Number }
    },
    sable: {
      quantite_kg: { type: Number, required: true },
      type: { type: String, required: true },
      masse_volumique: { type: Number, required: true }
    },
    eau: {
      quantite_litres: { type: Number, required: true },
      ratio_eau_ciment: { type: Number, required: true }
    },
    adjuvants: {
      quantite_kg: { type: Number },
      type: { type: String }
    }
  },
  
  proprietes: {
    affaissement: { type: String },
    resistance_28j: { type: String },
    duree_malaxage_min: { type: Number, required: true },
    temps_prise_heures: { type: Number, required: true }
  },
  
  cout_m3: {
    ciment: { type: Number, required: true },
    gravier: { type: Number },
    sable: { type: Number, required: true },
    eau: { type: Number, required: true },
    adjuvants: { type: Number },
    total: { type: Number, required: true }
  },
  
  is_default: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_by: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true }
}, {
  timestamps: true
});

// Index pour améliorer les performances
DosageSchema.index({ type: 1 });
DosageSchema.index({ usage: 1 });
DosageSchema.index({ is_default: 1 });
DosageSchema.index({ is_active: 1 });

export default mongoose.model<IDosage>('Dosage', DosageSchema);

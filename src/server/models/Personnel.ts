import mongoose, { Schema, Document } from 'mongoose';

// Interface pour un journalier (ouvrier)
export interface IPersonnel extends Document {
  id_personnel: string; // Utilise le téléphone comme ID unique
  nom: string;
  telephone: string;
  fonction: 'manoeuvre' | 'maçon' | 'ferrailleur' | 'coffreur' | 'grutier';
  pointages: Array<{
    semaine: string; // Format: YYYY-MM-DD (début de semaine)
    chantier: string;
    lundi: {
      present: boolean;
      heuresSupp: number;
    };
    mardi: {
      present: boolean;
      heuresSupp: number;
    };
    mercredi: {
      present: boolean;
      heuresSupp: number;
    };
    jeudi: {
      present: boolean;
      heuresSupp: number;
    };
    vendredi: {
      present: boolean;
      heuresSupp: number;
    };
    samedi: {
      present: boolean;
      heuresSupp: number;
    };
  }>;
  actif: boolean;
}

const PersonnelSchema: Schema = new Schema({
  id_personnel: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  telephone: { type: String, required: true, unique: true },
  fonction: {
    type: String,
    enum: ['manoeuvre', 'maçon', 'ferrailleur', 'coffreur', 'grutier'],
    required: true
  },
  pointages: [{
    semaine: { type: String, required: true },
    chantier: { type: String, required: true },
    lundi: {
      present: { type: Boolean, default: false },
      heuresSupp: { type: Number, default: 0 }
    },
    mardi: {
      present: { type: Boolean, default: false },
      heuresSupp: { type: Number, default: 0 }
    },
    mercredi: {
      present: { type: Boolean, default: false },
      heuresSupp: { type: Number, default: 0 }
    },
    jeudi: {
      present: { type: Boolean, default: false },
      heuresSupp: { type: Number, default: 0 }
    },
    vendredi: {
      present: { type: Boolean, default: false },
      heuresSupp: { type: Number, default: 0 }
    },
    samedi: {
      present: { type: Boolean, default: false },
      heuresSupp: { type: Number, default: 0 }
    }
  }],
  actif: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index pour améliorer les performances
PersonnelSchema.index({ id_personnel: 1 });
PersonnelSchema.index({ telephone: 1 });
PersonnelSchema.index({ fonction: 1 });
PersonnelSchema.index({ actif: 1 });

export default mongoose.models.Personnel || mongoose.model<IPersonnel>('Personnel', PersonnelSchema);

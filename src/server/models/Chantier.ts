import mongoose, { Schema, Document } from 'mongoose';

export interface IChantier extends Document {
  projet_id: mongoose.Types.ObjectId;
  nom: string;
  nom_ar: string;
  numero_phase: number;
  statut: 'planifie' | 'en_cours' | 'termine' | 'en_retard' | 'suspendu';
  
  calendrier: {
    date_debut_prevue: Date;
    date_fin_prevue: Date;
    date_debut_reelle?: Date;
    date_fin_reelle?: Date;
    retard_jours: number;
  };
  
  taches: Array<{
    nom: string;
    nom_ar: string;
    statut: 'en_attente' | 'en_cours' | 'termine' | 'en_retard';
    equipe_assignee: string;
    date_debut: Date;
    date_fin: Date;
    avancement: number;
    heures_main_oeuvre: {
      prevues: number;
      reelles: number;
    };
  }>;
  
  elements_structure: mongoose.Types.ObjectId[];
  materiaux_calcules: mongoose.Types.ObjectId[];
}

const ChantierSchema: Schema = new Schema({
  projet_id: { type: Schema.Types.ObjectId, ref: 'Projet', required: true },
  nom: { type: String, required: true },
  nom_ar: { type: String, required: true },
  numero_phase: { type: Number, required: true },
  statut: {
    type: String,
    enum: ['planifie', 'en_cours', 'termine', 'en_retard', 'suspendu'],
    default: 'planifie'
  },
  
  calendrier: {
    date_debut_prevue: { type: Date, required: true },
    date_fin_prevue: { type: Date, required: true },
    date_debut_reelle: { type: Date },
    date_fin_reelle: { type: Date },
    retard_jours: { type: Number, default: 0 }
  },
  
  taches: [{
    nom: { type: String, required: true },
    nom_ar: { type: String, required: true },
    statut: {
      type: String,
      enum: ['en_attente', 'en_cours', 'termine', 'en_retard'],
      default: 'en_attente'
    },
    equipe_assignee: { type: String, required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    avancement: { type: Number, default: 0, min: 0, max: 100 },
    heures_main_oeuvre: {
      prevues: { type: Number, required: true },
      reelles: { type: Number, default: 0 }
    }
  }],
  
  elements_structure: [{ type: Schema.Types.ObjectId, ref: 'ElementStructure' }],
  materiaux_calcules: [{ type: Schema.Types.ObjectId, ref: 'Materiau' }]
}, {
  timestamps: true
});

// Index pour améliorer les performances
ChantierSchema.index({ projet_id: 1 });
ChantierSchema.index({ statut: 1 });
ChantierSchema.index({ numero_phase: 1 });
ChantierSchema.index({ 'calendrier.date_debut_prevue': 1, 'calendrier.date_fin_prevue': 1 });

export default mongoose.models.Chantier || mongoose.model<IChantier>('Chantier', ChantierSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IJournalier extends Document {
  projet_id: mongoose.Types.ObjectId;
  chantier_id: mongoose.Types.ObjectId;
  date_rapport: Date;
  redige_par: mongoose.Types.ObjectId;
  
  meteo: {
    condition: 'ensoleille' | 'nuageux' | 'pluvieux' | 'venteux' | 'orageux' | 'brouillard';
    temperature: number;
    precipitation: number;
    vitesse_vent: number;
  };
  
  materiaux_consommes: Array<{
    materiau_id: mongoose.Types.ObjectId;
    nom: string;
    quantite_utilisee: number;
    unite: string;
    stock_restant: number;
  }>;
  
  main_oeuvre: Array<{
    equipe_nom: string;
    nombre_ouvriers: number;
    heures_travaillees: number;
    taches_realisees: string[];
    efficacite: number;
  }>;
  
  equipements_utilises: Array<{
    outil_id: mongoose.Types.ObjectId;
    nom: string;
    heures_utilisation: number;
    carburant_consomme?: number;
    unite_carburant?: string;
  }>;
  
  avancement_taches: Array<{
    tache_nom: string;
    avancement_prevu: number;
    avancement_reel: number;
    motifs_retard?: string[];
  }>;
  
  incidents: Array<{
    type: 'retard_livraison' | 'panne_equipement' | 'accident' | 'probleme_qualite' | 'meteo_defavorable';
    description: string;
    impact: string;
    action_corrective: string;
    severite: 'mineur' | 'moyen' | 'majeur' | 'critique';
  }>;
  
  photos: Array<{
    url: string;
    legende: string;
    timestamp: Date;
  }>;
  
  observations: string;
  note_journee: number;
}

const JournalierSchema: Schema = new Schema({
  projet_id: { type: Schema.Types.ObjectId, ref: 'Projet', required: true },
  chantier_id: { type: Schema.Types.ObjectId, ref: 'Chantier', required: true },
  date_rapport: { type: Date, required: true },
  redige_par: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  
  meteo: {
    condition: {
      type: String,
      enum: ['ensoleille', 'nuageux', 'pluvieux', 'venteux', 'orageux', 'brouillard'],
      required: true
    },
    temperature: { type: Number, required: true },
    precipitation: { type: Number, default: 0 },
    vitesse_vent: { type: Number, default: 0 }
  },
  
  materiaux_consommes: [{
    materiau_id: { type: Schema.Types.ObjectId, ref: 'Materiau', required: true },
    nom: { type: String, required: true },
    quantite_utilisee: { type: Number, required: true },
    unite: { type: String, required: true },
    stock_restant: { type: Number, required: true }
  }],
  
  main_oeuvre: [{
    equipe_nom: { type: String, required: true },
    nombre_ouvriers: { type: Number, required: true },
    heures_travaillees: { type: Number, required: true },
    taches_realisees: [{ type: String, required: true }],
    efficacite: { type: Number, min: 0, max: 10, required: true }
  }],
  
  equipements_utilises: [{
    outil_id: { type: Schema.Types.ObjectId, ref: 'Outil', required: true },
    nom: { type: String, required: true },
    heures_utilisation: { type: Number, required: true },
    carburant_consomme: { type: Number },
    unite_carburant: { type: String }
  }],
  
  avancement_taches: [{
    tache_nom: { type: String, required: true },
    avancement_prevu: { type: Number, min: 0, max: 100, required: true },
    avancement_reel: { type: Number, min: 0, max: 100, required: true },
    motifs_retard: [{ type: String }]
  }],
  
  incidents: [{
    type: {
      type: String,
      enum: ['retard_livraison', 'panne_equipement', 'accident', 'probleme_qualite', 'meteo_defavorable'],
      required: true
    },
    description: { type: String, required: true },
    impact: { type: String, required: true },
    action_corrective: { type: String, required: true },
    severite: {
      type: String,
      enum: ['mineur', 'moyen', 'majeur', 'critique'],
      required: true
    }
  }],
  
  photos: [{
    url: { type: String, required: true },
    legende: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  
  observations: { type: String, required: true },
  note_journee: { type: Number, min: 0, max: 10, required: true }
}, {
  timestamps: true
});

// Index pour améliorer les performances
JournalierSchema.index({ projet_id: 1 });
JournalierSchema.index({ chantier_id: 1 });
JournalierSchema.index({ date_rapport: 1 });
JournalierSchema.index({ redige_par: 1 });
JournalierSchema.index({ 'meteo.condition': 1 });

export default mongoose.model<IJournalier>('Journalier', JournalierSchema);

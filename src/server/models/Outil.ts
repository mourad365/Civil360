import mongoose, { Schema, Document } from 'mongoose';

export interface IOutil extends Document {
  code: string;
  nom: string;
  nom_ar: string;
  type: 'vibrateur' | 'grue' | 'betonniere' | 'coffrage' | 'echafaudage' | 'compacteur' | 'perceuse' | 'scie';
  categorie: 'compaction' | 'levage' | 'malaxage' | 'coffrages' | 'access' | 'coupe' | 'percage';
  marque: string;
  modele: string;
  
  specifications: {
    puissance?: string;
    frequence?: string;
    poids?: string;
    carburant?: string;
    capacite?: string;
    hauteur_max?: string;
    dimensions?: string;
  };
  
  statut: 'disponible' | 'en_utilisation' | 'en_maintenance' | 'en_reparation' | 'hors_service';
  etat: 'neuf' | 'bon' | 'moyen' | 'mauvais' | 'a_reparer';
  
  localisation: {
    projet_actuel_id?: mongoose.Types.ObjectId;
    site_nom?: string;
    derniere_mise_a_jour: Date;
    coordonnees?: {
      latitude: number;
      longitude: number;
    };
  };
  
  propriete: {
    type: 'possede' | 'loue' | 'sous_traitance';
    date_achat?: Date;
    prix_achat?: number;
    taux_amortissement?: number;
    valeur_actuelle?: number;
    proprietaire_externe?: string;
  };
  
  location: {
    tarif_jour: number;
    location_actuelle?: {
      projet_id: mongoose.Types.ObjectId;
      date_debut: Date;
      date_fin: Date;
      tarif_jour: number;
      cout_total: number;
    };
  };
  
  maintenance: {
    derniere_maintenance?: Date;
    prochaine_maintenance?: Date;
    intervalle_jours: number;
    heures_utilisation_totales: number;
    historique: Array<{
      date: Date;
      type: 'preventive' | 'corrective' | 'reparation';
      description: string;
      cout: number;
      technicien: string;
    }>;
  };
  
  transferts: Array<{
    de_projet_id?: mongoose.Types.ObjectId;
    vers_projet_id: mongoose.Types.ObjectId;
    date_prevue: Date;
    date_effective?: Date;
    statut: 'planifie' | 'en_cours' | 'termine' | 'annule';
  }>;
  
  utilisation: {
    taux_utilisation: number;
    jours_location_mois: number;
    revenu_genere_mois: number;
  };
}

const OutilSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  nom_ar: { type: String, required: true },
  type: {
    type: String,
    enum: ['vibrateur', 'grue', 'betonniere', 'coffrage', 'echafaudage', 'compacteur', 'perceuse', 'scie'],
    required: true
  },
  categorie: {
    type: String,
    enum: ['compaction', 'levage', 'malaxage', 'coffrages', 'access', 'coupe', 'percage'],
    required: true
  },
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  
  specifications: {
    puissance: { type: String },
    frequence: { type: String },
    poids: { type: String },
    carburant: { type: String },
    capacite: { type: String },
    hauteur_max: { type: String },
    dimensions: { type: String }
  },
  
  statut: {
    type: String,
    enum: ['disponible', 'en_utilisation', 'en_maintenance', 'en_reparation', 'hors_service'],
    default: 'disponible'
  },
  etat: {
    type: String,
    enum: ['neuf', 'bon', 'moyen', 'mauvais', 'a_reparer'],
    default: 'bon'
  },
  
  localisation: {
    projet_actuel_id: { type: Schema.Types.ObjectId, ref: 'Projet' },
    site_nom: { type: String },
    derniere_mise_a_jour: { type: Date, default: Date.now },
    coordonnees: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  
  propriete: {
    type: {
      type: String,
      enum: ['possede', 'loue', 'sous_traitance'],
      required: true
    },
    date_achat: { type: Date },
    prix_achat: { type: Number },
    taux_amortissement: { type: Number },
    valeur_actuelle: { type: Number },
    proprietaire_externe: { type: String }
  },
  
  location: {
    tarif_jour: { type: Number, required: true },
    location_actuelle: {
      projet_id: { type: Schema.Types.ObjectId, ref: 'Projet' },
      date_debut: { type: Date },
      date_fin: { type: Date },
      tarif_jour: { type: Number },
      cout_total: { type: Number }
    }
  },
  
  maintenance: {
    derniere_maintenance: { type: Date },
    prochaine_maintenance: { type: Date },
    intervalle_jours: { type: Number, default: 60 },
    heures_utilisation_totales: { type: Number, default: 0 },
    historique: [{
      date: { type: Date, required: true },
      type: {
        type: String,
        enum: ['preventive', 'corrective', 'reparation'],
        required: true
      },
      description: { type: String, required: true },
      cout: { type: Number, required: true },
      technicien: { type: String, required: true }
    }]
  },
  
  transferts: [{
    de_projet_id: { type: Schema.Types.ObjectId, ref: 'Projet' },
    vers_projet_id: { type: Schema.Types.ObjectId, ref: 'Projet', required: true },
    date_prevue: { type: Date, required: true },
    date_effective: { type: Date },
    statut: {
      type: String,
      enum: ['planifie', 'en_cours', 'termine', 'annule'],
      default: 'planifie'
    }
  }],
  
  utilisation: {
    taux_utilisation: { type: Number, default: 0, min: 0, max: 1 },
    jours_location_mois: { type: Number, default: 0 },
    revenu_genere_mois: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
OutilSchema.index({ code: 1 });
OutilSchema.index({ type: 1 });
OutilSchema.index({ statut: 1 });
OutilSchema.index({ 'localisation.projet_actuel_id': 1 });
OutilSchema.index({ 'propriete.type': 1 });

export default mongoose.model<IOutil>('Outil', OutilSchema);

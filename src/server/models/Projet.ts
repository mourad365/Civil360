import mongoose, { Schema, Document } from 'mongoose';

export interface IProjet extends Document {
  code: string;
  nom: string;
  nom_ar: string;
  type: 'residential_tower' | 'commercial_building' | 'infrastructure' | 'industrial' | 'residential_complex';
  statut: 'planification' | 'en_cours' | 'en_attente' | 'termine' | 'annule';
  
  localisation: {
    adresse: string;
    adresse_ar: string;
    ville: string;
    pays: string;
    coordonnees: {
      latitude: number;
      longitude: number;
    };
  };
  
  calendrier: {
    date_debut: Date;
    date_fin_prevue: Date;
    date_fin_reelle?: Date;
    duree_mois: number;
    ecart_jours: number;
  };
  
  budget: {
    total_alloue: number;
    total_depense: number;
    restant: number;
    devise: string;
    repartition: {
      main_oeuvre: {
        alloue: number;
        depense: number;
        pourcentage: number;
      };
      materiaux: {
        alloue: number;
        depense: number;
        pourcentage: number;
      };
      equipements: {
        alloue: number;
        depense: number;
        pourcentage: number;
      };
      imprevus: {
        alloue: number;
        depense: number;
        pourcentage: number;
      };
    };
  };
  
  avancement: {
    pourcentage_global: number;
    derniere_mise_a_jour: Date;
  };
  
  equipe: {
    chef_projet: mongoose.Types.ObjectId;
    ingenieur_principal: mongoose.Types.ObjectId;
    ingenieurs: mongoose.Types.ObjectId[];
  };
  
  alertes_actives: Array<{
    type: 'depassement_budget' | 'retard_planning' | 'qualite' | 'securite' | 'meteo';
    severite: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    date_creation: Date;
  }>;
  
  created_by: mongoose.Types.ObjectId;
}

const ProjetSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  nom_ar: { type: String, required: true },
  type: {
    type: String,
    enum: ['residential_tower', 'commercial_building', 'infrastructure', 'industrial', 'residential_complex'],
    required: true
  },
  statut: {
    type: String,
    enum: ['planification', 'en_cours', 'en_attente', 'termine', 'annule'],
    default: 'planification'
  },
  
  localisation: {
    adresse: { type: String, required: true },
    adresse_ar: { type: String, required: true },
    ville: { type: String, required: true },
    pays: { type: String, required: true },
    coordonnees: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  
  calendrier: {
    date_debut: { type: Date, required: true },
    date_fin_prevue: { type: Date, required: true },
    date_fin_reelle: { type: Date },
    duree_mois: { type: Number, required: true },
    ecart_jours: { type: Number, default: 0 }
  },
  
  budget: {
    total_alloue: { type: Number, required: true },
    total_depense: { type: Number, default: 0 },
    restant: { type: Number, required: true },
    devise: { type: String, default: 'EUR' },
    repartition: {
      main_oeuvre: {
        alloue: { type: Number, required: true },
        depense: { type: Number, default: 0 },
        pourcentage: { type: Number, required: true }
      },
      materiaux: {
        alloue: { type: Number, required: true },
        depense: { type: Number, default: 0 },
        pourcentage: { type: Number, required: true }
      },
      equipements: {
        alloue: { type: Number, required: true },
        depense: { type: Number, default: 0 },
        pourcentage: { type: Number, required: true }
      },
      imprevus: {
        alloue: { type: Number, required: true },
        depense: { type: Number, default: 0 },
        pourcentage: { type: Number, required: true }
      }
    }
  },
  
  avancement: {
    pourcentage_global: { type: Number, default: 0, min: 0, max: 100 },
    derniere_mise_a_jour: { type: Date, default: Date.now }
  },
  
  equipe: {
    chef_projet: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    ingenieur_principal: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    ingenieurs: [{ type: Schema.Types.ObjectId, ref: 'Utilisateur' }]
  },
  
  alertes_actives: [{
    type: {
      type: String,
      enum: ['depassement_budget', 'retard_planning', 'qualite', 'securite', 'meteo'],
      required: true
    },
    severite: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      required: true
    },
    message: { type: String, required: true },
    date_creation: { type: Date, default: Date.now }
  }],
  
  created_by: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true }
}, {
  timestamps: true
});

// Index pour améliorer les performances
ProjetSchema.index({ code: 1 });
ProjetSchema.index({ statut: 1 });
ProjetSchema.index({ 'calendrier.date_debut': 1, 'calendrier.date_fin_prevue': 1 });
ProjetSchema.index({ 'localisation.coordonnees': '2dsphere' });

export default mongoose.model<IProjet>('Projet', ProjetSchema);

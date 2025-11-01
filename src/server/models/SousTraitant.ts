import mongoose, { Schema, Document } from 'mongoose';

export interface ISousTraitant extends Document {
  code: string;
  nom: string;
  type: 'fournisseur_materiaux' | 'sous_traitant_construction' | 'prestataire_service' | 'transporteur';
  categories: string[];
  
  contact: {
    adresse: string;
    telephone: string;
    email: string;
    personne_contact: string;
    site_web?: string;
  };
  
  informations_financieres: {
    conditions_paiement: string;
    devise_preferee: string;
    numero_fiscal: string;
    coordonnees_bancaires: {
      iban: string;
      banque: string;
    };
  };
  
  performance: {
    note_globale: number;
    commandes_totales: number;
    taux_livraison_temps: number;
    note_qualite: number;
    note_prix: number;
    derniere_evaluation: Date;
  };
  
  catalogue: Array<{
    materiau_id: mongoose.Types.ObjectId;
    nom: string;
    prix: number;
    unite?: string;
    quantite_min: number;
    delai_livraison_jours: number;
  }>;
  
  contrats: Array<{
    numero_contrat: string;
    type: 'accord_cadre' | 'contrat_specifique' | 'marche_public';
    date_debut: Date;
    date_fin: Date;
    montant_total: number;
    statut: 'actif' | 'expire' | 'resilie' | 'en_negociation';
  }>;
  
  alertes: Array<{
    type: 'performance_baisse' | 'retard_livraison' | 'probleme_qualite' | 'depassement_prix';
    message: string;
    date_creation: Date;
    severite: 'info' | 'warning' | 'error' | 'critical';
  }>;
  
  is_active: boolean;
}

const SousTraitantSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  type: {
    type: String,
    enum: ['fournisseur_materiaux', 'sous_traitant_construction', 'prestataire_service', 'transporteur'],
    required: true
  },
  categories: [{ type: String, required: true }],
  
  contact: {
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    personne_contact: { type: String, required: true },
    site_web: { type: String }
  },
  
  informations_financieres: {
    conditions_paiement: { type: String, required: true },
    devise_preferee: { type: String, default: 'EUR' },
    numero_fiscal: { type: String, required: true },
    coordonnees_bancaires: {
      iban: { type: String, required: true },
      banque: { type: String, required: true }
    }
  },
  
  performance: {
    note_globale: { type: Number, min: 0, max: 10, default: 5 },
    commandes_totales: { type: Number, default: 0 },
    taux_livraison_temps: { type: Number, min: 0, max: 1, default: 0.95 },
    note_qualite: { type: Number, min: 0, max: 10, default: 5 },
    note_prix: { type: Number, min: 0, max: 10, default: 5 },
    derniere_evaluation: { type: Date, default: Date.now }
  },
  
  catalogue: [{
    materiau_id: { type: Schema.Types.ObjectId, ref: 'Materiau', required: true },
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    unite: { type: String },
    quantite_min: { type: Number, required: true },
    delai_livraison_jours: { type: Number, required: true }
  }],
  
  contrats: [{
    numero_contrat: { type: String, required: true },
    type: {
      type: String,
      enum: ['accord_cadre', 'contrat_specifique', 'marche_public'],
      required: true
    },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    montant_total: { type: Number, required: true },
    statut: {
      type: String,
      enum: ['actif', 'expire', 'resilie', 'en_negociation'],
      default: 'en_negociation'
    }
  }],
  
  alertes: [{
    type: {
      type: String,
      enum: ['performance_baisse', 'retard_livraison', 'probleme_qualite', 'depassement_prix'],
      required: true
    },
    message: { type: String, required: true },
    date_creation: { type: Date, default: Date.now },
    severite: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      required: true
    }
  }],
  
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index pour améliorer les performances
SousTraitantSchema.index({ code: 1 });
SousTraitantSchema.index({ nom: 1 });
SousTraitantSchema.index({ type: 1 });
SousTraitantSchema.index({ categories: 1 });
SousTraitantSchema.index({ is_active: 1 });
SousTraitantSchema.index({ 'performance.note_globale': -1 });

export default mongoose.models.SousTraitant || mongoose.model<ISousTraitant>('SousTraitant', SousTraitantSchema);

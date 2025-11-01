import mongoose, { Schema, Document } from 'mongoose';

export interface IAchat extends Document {
  numero_commande: string;
  projet_id: mongoose.Types.ObjectId;
  chantier_id?: mongoose.Types.ObjectId;
  fournisseur_id: mongoose.Types.ObjectId;
  statut: 'en_attente' | 'confirmee' | 'en_cours_livraison' | 'livre' | 'annulee';
  
  dates: {
    date_commande: Date;
    date_livraison_demandee: Date;
    date_livraison_effective?: Date;
    retard_jours: number;
  };
  
  articles: Array<{
    materiau_id: mongoose.Types.ObjectId;
    nom: string;
    quantite: number;
    unite: string;
    prix_unitaire: number;
    prix_total: number;
  }>;
  
  financier: {
    sous_total: number;
    taux_tva: number;
    montant_tva: number;
    total_ttc: number;
    devise: string;
  };
  
  livraison: {
    adresse: string;
    statut_livraison: 'en_attente' | 'en_cours' | 'livre' | 'retardee' | 'probleme';
    numero_suivi?: string;
    notes?: string;
  };
  
  validations: Array<{
    utilisateur_id: mongoose.Types.ObjectId;
    role: string;
    valide: boolean;
    date: Date;
    commentaire?: string;
  }>;
  
  created_by: mongoose.Types.ObjectId;
}

const AchatSchema: Schema = new Schema({
  numero_commande: { type: String, required: true, unique: true },
  projet_id: { type: Schema.Types.ObjectId, ref: 'Projet', required: true },
  chantier_id: { type: Schema.Types.ObjectId, ref: 'Chantier' },
  fournisseur_id: { type: Schema.Types.ObjectId, ref: 'SousTraitant', required: true },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmee', 'en_cours_livraison', 'livre', 'annulee'],
    default: 'en_attente'
  },
  
  dates: {
    date_commande: { type: Date, required: true },
    date_livraison_demandee: { type: Date, required: true },
    date_livraison_effective: { type: Date },
    retard_jours: { type: Number, default: 0 }
  },
  
  articles: [{
    materiau_id: { type: Schema.Types.ObjectId, ref: 'Materiau', required: true },
    nom: { type: String, required: true },
    quantite: { type: Number, required: true },
    unite: { type: String, required: true },
    prix_unitaire: { type: Number, required: true },
    prix_total: { type: Number, required: true }
  }],
  
  financier: {
    sous_total: { type: Number, required: true },
    taux_tva: { type: Number, default: 0.20 },
    montant_tva: { type: Number, required: true },
    total_ttc: { type: Number, required: true },
    devise: { type: String, default: 'EUR' }
  },
  
  livraison: {
    adresse: { type: String, required: true },
    statut_livraison: {
      type: String,
      enum: ['en_attente', 'en_cours', 'livre', 'retardee', 'probleme'],
      default: 'en_attente'
    },
    numero_suivi: { type: String },
    notes: { type: String }
  },
  
  validations: [{
    utilisateur_id: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    role: { type: String, required: true },
    valide: { type: Boolean, required: true },
    date: { type: Date, required: true },
    commentaire: { type: String }
  }],
  
  created_by: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true }
}, {
  timestamps: true
});

// Index pour améliorer les performances
// Removing duplicate indexes - numero_commande is already unique
AchatSchema.index({ projet_id: 1 });
AchatSchema.index({ fournisseur_id: 1 });
AchatSchema.index({ statut: 1 });
AchatSchema.index({ 'dates.date_commande': 1 });
AchatSchema.index({ 'dates.date_livraison_demandee': 1 });

export default mongoose.models.Achat || mongoose.model<IAchat>('Achat', AchatSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IDemande extends Document {
  numero_demande: string;
  projet_id: mongoose.Types.ObjectId;
  chantier_id?: mongoose.Types.ObjectId;
  element_structure_id?: mongoose.Types.ObjectId;
  
  type: 'materiau' | 'equipement' | 'main_oeuvre' | 'service';
  priorite: 'faible' | 'normale' | 'haute' | 'urgente';
  statut: 'brouillon' | 'soumise' | 'en_validation' | 'approuvee' | 'refusee' | 'commande_passee';
  
  demandeur: {
    utilisateur_id: mongoose.Types.ObjectId;
    nom: string;
    role: string;
  };
  
  materiaux_demandes: Array<{
    materiau_id: mongoose.Types.ObjectId;
    nom: string;
    quantite_demandee: number;
    unite: string;
    date_besoin: Date;
    justification: string;
  }>;
  
  budget_estime: {
    montant: number;
    devise: string;
  };
  
  workflow: Array<{
    etape: 'creation' | 'validation_ingenieur' | 'validation_directeur_achat' | 'commande_passee';
    utilisateur_id: mongoose.Types.ObjectId;
    date: Date;
    statut: 'en_attente' | 'approuve' | 'refuse' | 'termine';
    commentaire?: string;
    commande_id?: mongoose.Types.ObjectId;
  }>;
}

const DemandeSchema: Schema = new Schema({
  numero_demande: { type: String, required: true, unique: true },
  projet_id: { type: Schema.Types.ObjectId, ref: 'Projet', required: true },
  chantier_id: { type: Schema.Types.ObjectId, ref: 'Chantier' },
  element_structure_id: { type: Schema.Types.ObjectId, ref: 'ElementStructure' },
  
  type: {
    type: String,
    enum: ['materiau', 'equipement', 'main_oeuvre', 'service'],
    required: true
  },
  priorite: {
    type: String,
    enum: ['faible', 'normale', 'haute', 'urgente'],
    default: 'normale'
  },
  statut: {
    type: String,
    enum: ['brouillon', 'soumise', 'en_validation', 'approuvee', 'refusee', 'commande_passee'],
    default: 'brouillon'
  },
  
  demandeur: {
    utilisateur_id: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    nom: { type: String, required: true },
    role: { type: String, required: true }
  },
  
  materiaux_demandes: [{
    materiau_id: { type: Schema.Types.ObjectId, ref: 'Materiau', required: true },
    nom: { type: String, required: true },
    quantite_demandee: { type: Number, required: true },
    unite: { type: String, required: true },
    date_besoin: { type: Date, required: true },
    justification: { type: String, required: true }
  }],
  
  budget_estime: {
    montant: { type: Number, required: true },
    devise: { type: String, default: 'EUR' }
  },
  
  workflow: [{
    etape: {
      type: String,
      enum: ['creation', 'validation_ingenieur', 'validation_directeur_achat', 'commande_passee'],
      required: true
    },
    utilisateur_id: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    date: { type: Date, required: true },
    statut: {
      type: String,
      enum: ['en_attente', 'approuve', 'refuse', 'termine'],
      required: true
    },
    commentaire: { type: String },
    commande_id: { type: Schema.Types.ObjectId, ref: 'Achat' }
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances (removing duplicate indexes)
// numero_demande is already unique, no need for additional index
DemandeSchema.index({ projet_id: 1 });
DemandeSchema.index({ statut: 1 });
DemandeSchema.index({ priorite: 1 });
DemandeSchema.index({ 'demandeur.utilisateur_id': 1 });

export default mongoose.model<IDemande>('Demande', DemandeSchema);

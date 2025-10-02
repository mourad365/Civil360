import mongoose, { Schema, Document } from 'mongoose';

export interface IUtilisateur extends Document {
  username: string;
  email: string;
  password_hash: string;
  
  profil: {
    prenom: string;
    nom: string;
    nom_arabe?: string;
    role_id: mongoose.Types.ObjectId;
    departement: 'direction' | 'ingenierie' | 'achat' | 'logistique' | 'qualite' | 'maintenance' | 'finance';
    telephone: string;
    avatar?: string;
    langue_preference: 'fr' | 'ar' | 'en';
    fuseau_horaire: string;
  };
  
  derniere_connexion?: Date;
  is_active: boolean;
}

const UtilisateurSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  
  profil: {
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    nom_arabe: { type: String },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    departement: {
      type: String,
      enum: ['direction', 'ingenierie', 'achat', 'logistique', 'qualite', 'maintenance', 'finance'],
      required: true
    },
    telephone: { type: String, required: true },
    avatar: { type: String },
    langue_preference: {
      type: String,
      enum: ['fr', 'ar', 'en'],
      default: 'fr'
    },
    fuseau_horaire: { type: String, default: 'Africa/Nouakchott' }
  },
  
  derniere_connexion: { type: Date },
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index pour améliorer les performances
UtilisateurSchema.index({ username: 1 });
UtilisateurSchema.index({ email: 1 });
UtilisateurSchema.index({ 'profil.role_id': 1 });
UtilisateurSchema.index({ 'profil.departement': 1 });
UtilisateurSchema.index({ is_active: 1 });

export default mongoose.model<IUtilisateur>('Utilisateur', UtilisateurSchema);

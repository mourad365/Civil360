import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mourad2:mourad2@cluster0.mwhno36.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Define schemas directly in the script
const RoleSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  nom_ar: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  niveau_hierarchique: { type: Number, required: true, min: 1, max: 10 },
  permissions_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission', required: true },
  description: { type: String, required: true },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

const PermissionSchema = new mongoose.Schema({
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true, unique: true },
  modules: {
    projets: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      suppression: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    chantiers: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      suppression: { type: Boolean, default: false },
      validation: { type: Boolean, default: false }
    }
    // ... simplified for testing
  }
}, { timestamps: true });

const UtilisateurSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  profil: {
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    nom_arabe: { type: String },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
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
}, { timestamps: true });

// Create models
const Role = mongoose.model('Role', RoleSchema);
const Permission = mongoose.model('Permission', PermissionSchema);
const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);

const seedDatabase = async () => {
  try {
    console.log('🌱 Connexion à la base de données...');
    await connectDB();

    console.log('🗑️ Nettoyage des collections existantes...');
    await Promise.all([
      Role.deleteMany({}),
      Permission.deleteMany({}),
      Utilisateur.deleteMany({})
    ]);

    console.log('👥 Création des rôles et permissions...');
    
    const roleDirecteurGeneral = await Role.create({
      nom: "Directeur Général",
      nom_ar: "المدير العام",
      code: "director_general",
      niveau_hierarchique: 1,
      permissions_id: new mongoose.Types.ObjectId(),
      description: "Direction générale avec accès complet"
    });

    const roleIngenieur = await Role.create({
      nom: "Ingénieur",
      nom_ar: "مهندس",
      code: "ingenieur",
      niveau_hierarchique: 3,
      permissions_id: new mongoose.Types.ObjectId(),
      description: "Ingénieur de projet"
    });

    // Créer les permissions pour le directeur général (accès complet)
    await Permission.create({
      role_id: roleDirecteurGeneral._id,
      modules: {
        projets: { lecture: true, ecriture: true, suppression: true, export: true },
        chantiers: { lecture: true, ecriture: true, suppression: true, validation: true }
      }
    });

    // Permissions pour l'ingénieur
    await Permission.create({
      role_id: roleIngenieur._id,
      modules: {
        projets: { lecture: true, ecriture: true, suppression: false, export: true },
        chantiers: { lecture: true, ecriture: true, suppression: false, validation: false }
      }
    });

    console.log('👤 Création des utilisateurs...');
    
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const tijani = await Utilisateur.create({
      username: "tijani_dg",
      email: "tijani@civil360.com",
      password_hash: passwordHash,
      profil: {
        prenom: "Tijani",
        nom: "Directeur",
        nom_arabe: "تيجاني",
        role_id: roleDirecteurGeneral._id,
        departement: "direction",
        telephone: "+222 XX XX XX XX",
        avatar: "/uploads/avatars/tijani.jpg",
        langue_preference: "fr",
        fuseau_horaire: "Africa/Nouakchott"
      },
      is_active: true
    });

    const ahmed = await Utilisateur.create({
      username: "ahmed_ing",
      email: "ahmed@civil360.com",
      password_hash: passwordHash,
      profil: {
        prenom: "Ahmed",
        nom: "Jeddou",
        nom_arabe: "أحمد جدو",
        role_id: roleIngenieur._id,
        departement: "ingenierie",
        telephone: "+222 YY YY YY YY",
        langue_preference: "fr",
        fuseau_horaire: "Africa/Nouakchott"
      },
      is_active: true
    });

    console.log('✅ Test de base de données réussi!');
    console.log(`
📊 Données de test créées:
- ${await Role.countDocuments()} rôles
- ${await Permission.countDocuments()} permissions  
- ${await Utilisateur.countDocuments()} utilisateurs

👤 Utilisateurs créés:
- tijani_dg / password123 (Directeur Général)
- ahmed_ing / password123 (Ingénieur)

🎉 La connexion MongoDB et les schémas fonctionnent correctement!
    `);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter le script
seedDatabase();

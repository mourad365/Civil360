// CIVIL360 - MongoDB Database Setup Script
// Run this with: node setup_civil360.js

import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = "mongodb+srv://mourad2:mourad2@cluster0.mwhno36.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "civil360";

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log("✓ Connected to MongoDB");
    
    const db = client.db(DB_NAME);
    
    // Drop existing collections (optional - comment out if you want to keep existing data)
    console.log("\n🗑️  Dropping existing collections...");
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`  - Dropped ${collection.name}`);
    }
    
    // ========================================
    // 1. ROLES
    // ========================================
    console.log("\n📋 Creating roles...");
    const roles = await db.collection('roles').insertMany([
      {
        _id: new ObjectId(),
        nom: "Administrateur",
        nom_ar: "مدير",
        code: "ADMIN",
        niveau_hierarchique: 1,
        description: "Accès complet au système",
        is_active: true,
        created_at: new Date()
      },
      {
        _id: new ObjectId(),
        nom: "Chef de Projet",
        nom_ar: "رئيس المشروع",
        code: "CHEF_PROJET",
        niveau_hierarchique: 2,
        description: "Gestion des projets",
        is_active: true,
        created_at: new Date()
      },
      {
        _id: new ObjectId(),
        nom: "Ingénieur",
        nom_ar: "مهندس",
        code: "INGENIEUR",
        niveau_hierarchique: 3,
        description: "Suivi technique",
        is_active: true,
        created_at: new Date()
      },
      {
        _id: new ObjectId(),
        nom: "Chef de Chantier",
        nom_ar: "رئيس الورشة",
        code: "CHEF_CHANTIER",
        niveau_hierarchique: 4,
        description: "Gestion du chantier",
        is_active: true,
        created_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${roles.insertedCount} roles`);
    
    const roleIds = Object.values(roles.insertedIds);
    
    // ========================================
    // 2. UTILISATEURS
    // ========================================
    console.log("\n👥 Creating users...");
    const users = await db.collection('utilisateurs').insertMany([
      {
        _id: new ObjectId(),
        username: "admin",
        email: "admin@civil360.com",
        password_hash: "$2b$10$XYZ123", // Hash fictif
        prenom: "Mohammed",
        nom: "BENALI",
        nom_arabe: "محمد بنعلي",
        role_id: roleIds[0],
        departement: "Direction",
        telephone: "+222 22 45 67 89",
        langue_preference: "fr",
        fuseau_horaire: "Africa/Nouakchott",
        derniere_connexion: new Date(),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        username: "chef_projet1",
        email: "ahmed.salem@civil360.com",
        password_hash: "$2b$10$ABC456",
        prenom: "Ahmed",
        nom: "SALEM",
        nom_arabe: "أحمد سالم",
        role_id: roleIds[1],
        departement: "Gestion de Projets",
        telephone: "+222 22 34 56 78",
        langue_preference: "ar",
        fuseau_horaire: "Africa/Nouakchott",
        derniere_connexion: new Date(),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        username: "ingenieur1",
        email: "fatima.ould@civil360.com",
        password_hash: "$2b$10$DEF789",
        prenom: "Fatima",
        nom: "OULD MOHAMED",
        nom_arabe: "فاطمة ولد محمد",
        role_id: roleIds[2],
        departement: "Bureau d'Études",
        telephone: "+222 22 23 45 67",
        langue_preference: "fr",
        fuseau_horaire: "Africa/Nouakchott",
        derniere_connexion: new Date(),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${users.insertedCount} users`);
    
    const userIds = Object.values(users.insertedIds);
    
    // ========================================
    // 3. PARAMETRES DOSAGES
    // ========================================
    console.log("\n🧪 Creating dosage parameters...");
    const dosages = await db.collection('parametres_dosages').insertMany([
      {
        _id: new ObjectId(),
        nom: "Béton de Propreté",
        nom_ar: "خرسانة النظافة",
        code: "BP_150",
        type: "beton",
        usage: "fondations",
        ciment_kg: 150,
        ciment_type: "CPJ 35",
        ciment_sacs_nombre: 3,
        ciment_cout_sac: 2500,
        sable_kg: 800,
        sable_cout_tonne: 15000,
        gravier_kg: 1000,
        gravier_cout_tonne: 18000,
        cout_total_m3: 35000,
        is_default: false,
        is_active: true,
        created_by: userIds[0],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        nom: "Béton Armé Standard",
        nom_ar: "خرسانة مسلحة قياسية",
        code: "BA_350",
        type: "beton",
        usage: "poteaux",
        ciment_kg: 350,
        ciment_type: "CPJ 45",
        ciment_sacs_nombre: 7,
        ciment_cout_sac: 2800,
        sable_kg: 700,
        sable_cout_tonne: 15000,
        gravier_kg: 1100,
        gravier_cout_tonne: 18000,
        cout_total_m3: 52000,
        is_default: true,
        is_active: true,
        created_by: userIds[0],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        nom: "Béton Dalle",
        nom_ar: "خرسانة البلاطة",
        code: "BD_300",
        type: "beton",
        usage: "dalles",
        ciment_kg: 300,
        ciment_type: "CPJ 45",
        ciment_sacs_nombre: 6,
        ciment_cout_sac: 2800,
        sable_kg: 750,
        sable_cout_tonne: 15000,
        gravier_kg: 1050,
        gravier_cout_tonne: 18000,
        cout_total_m3: 45000,
        is_default: false,
        is_active: true,
        created_by: userIds[0],
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${dosages.insertedCount} dosage parameters`);
    
    const dosageIds = Object.values(dosages.insertedIds);
    
    // ========================================
    // 4. SOUS-TRAITANTS
    // ========================================
    console.log("\n🏢 Creating subcontractors...");
    const soustraitants = await db.collection('sous_traitants').insertMany([
      {
        _id: new ObjectId(),
        code: "FOURS001",
        nom: "CIMENT MAURITANIE",
        telephone: "+222 45 23 45 67",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "FOURS002",
        nom: "MATÉRIAUX DU SAHEL",
        telephone: "+222 45 34 56 78",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "FOURS003",
        nom: "ACIER & FER",
        telephone: "+222 45 45 67 89",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${soustraitants.insertedCount} subcontractors`);
    
    const soustraitantIds = Object.values(soustraitants.insertedIds);
    
    // ========================================
    // 5. PROJETS
    // ========================================
    console.log("\n🏗️  Creating projects...");
    const projets = await db.collection('projets').insertMany([
      {
        _id: new ObjectId(),
        code: "PRJ2025001",
        nom: "Complexe Résidentiel Al-Amal",
        nom_ar: "مجمع الأمل السكني",
        statut: "en_cours",
        adresse: "Tevragh Zeina, Nouakchott",
        adresse_ar: "تفرغ زينة، نواكشوط",
        ville: "Nouakchott",
        pays: "Mauritanie",
        latitude: 18.0856,
        longitude: -15.9785,
        date_debut: new Date("2025-01-15"),
        date_fin_prevue: new Date("2025-12-31"),
        date_fin_reelle: null,
        duree_mois: 12,
        ecart_jours: 0,
        budget_total_alloue: 150000000,
        budget_total_depense: 45000000,
        budget_restant: 105000000,
        devise: "MRU",
        pourcentage_global: 35,
        derniere_maj_avancement: new Date(),
        chef_projet_id: userIds[1],
        ingenieur_principal_id: userIds[2],
        created_at: new Date(),
        updated_at: new Date(),
        created_by: userIds[0]
      },
      {
        _id: new ObjectId(),
        code: "PRJ2025002",
        nom: "Immeuble Commercial Ksar",
        nom_ar: "مبنى قصر التجاري",
        statut: "en_cours",
        adresse: "Ksar, Nouakchott",
        adresse_ar: "القصر، نواكشوط",
        ville: "Nouakchott",
        pays: "Mauritanie",
        latitude: 18.0920,
        longitude: -15.9582,
        date_debut: new Date("2025-03-01"),
        date_fin_prevue: new Date("2026-02-28"),
        date_fin_reelle: null,
        duree_mois: 12,
        ecart_jours: 0,
        budget_total_alloue: 85000000,
        budget_total_depense: 15000000,
        budget_restant: 70000000,
        devise: "MRU",
        pourcentage_global: 18,
        derniere_maj_avancement: new Date(),
        chef_projet_id: userIds[1],
        ingenieur_principal_id: userIds[2],
        created_at: new Date(),
        updated_at: new Date(),
        created_by: userIds[0]
      },
      {
        _id: new ObjectId(),
        code: "PRJ2024003",
        nom: "Villa Moderne Sebkha",
        nom_ar: "فيلا سبخة الحديثة",
        statut: "termine",
        adresse: "Sebkha, Nouakchott",
        adresse_ar: "السبخة، نواكشوط",
        ville: "Nouakchott",
        pays: "Mauritanie",
        latitude: 18.0735,
        longitude: -15.9582,
        date_debut: new Date("2024-06-01"),
        date_fin_prevue: new Date("2024-12-31"),
        date_fin_reelle: new Date("2025-01-15"),
        duree_mois: 7,
        ecart_jours: 15,
        budget_total_alloue: 35000000,
        budget_total_depense: 36500000,
        budget_restant: -1500000,
        devise: "MRU",
        pourcentage_global: 100,
        derniere_maj_avancement: new Date(),
        chef_projet_id: userIds[1],
        ingenieur_principal_id: userIds[2],
        created_at: new Date("2024-05-15"),
        updated_at: new Date(),
        created_by: userIds[0]
      }
    ]);
    console.log(`  ✓ Created ${projets.insertedCount} projects`);
    
    const projetIds = Object.values(projets.insertedIds);
    
    // ========================================
    // 6. CHANTIERS
    // ========================================
    console.log("\n🏗️  Creating construction sites...");
    const chantiers = await db.collection('chantiers').insertMany([
      {
        _id: new ObjectId(),
        projet_id: projetIds[0],
        nom: "Fondations Bâtiment A",
        nom_ar: "أساسات المبنى أ",
        numero_phase: 1,
        statut: "termine",
        date_debut_prevue: new Date("2025-01-15"),
        date_fin_prevue: new Date("2025-03-15"),
        date_debut_reelle: new Date("2025-01-15"),
        date_fin_reelle: new Date("2025-03-10"),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        projet_id: projetIds[0],
        nom: "Structure Béton Armé Bâtiment A",
        nom_ar: "هيكل خرساني مسلح المبنى أ",
        numero_phase: 2,
        statut: "en_cours",
        date_debut_prevue: new Date("2025-03-16"),
        date_fin_prevue: new Date("2025-07-31"),
        date_debut_reelle: new Date("2025-03-16"),
        date_fin_reelle: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        projet_id: projetIds[0],
        nom: "Fondations Bâtiment B",
        nom_ar: "أساسات المبنى ب",
        numero_phase: 1,
        statut: "en_cours",
        date_debut_prevue: new Date("2025-04-01"),
        date_fin_prevue: new Date("2025-06-15"),
        date_debut_reelle: new Date("2025-04-05"),
        date_fin_reelle: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        projet_id: projetIds[1],
        nom: "Terrassement et Fondations",
        nom_ar: "الحفر والأساسات",
        numero_phase: 1,
        statut: "en_cours",
        date_debut_prevue: new Date("2025-03-01"),
        date_fin_prevue: new Date("2025-05-31"),
        date_debut_reelle: new Date("2025-03-01"),
        date_fin_reelle: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${chantiers.insertedCount} construction sites`);
    
    const chantierIds = Object.values(chantiers.insertedIds);
    
    // ========================================
    // 7. ELEMENTS STRUCTURE
    // ========================================
    console.log("\n🏛️  Creating structural elements...");
    const elements = await db.collection('elements_structure').insertMany([
      {
        _id: new ObjectId(),
        projet_id: projetIds[0],
        chantier_id: chantierIds[0],
        type_element: "semelle_isolee",
        designation: "Semelle S1 - 2.0x2.0x0.5m",
        designation_ar: "قاعدة S1",
        nombre: 12,
        longueur: 2.0,
        largeur: 2.0,
        hauteur: 0.5,
        volume: 2.0,
        quantite_ciment_sacs: 42,
        quantite_m3: 24,
        volume_total: 24,
        dosage_id: dosageIds[1],
        cout_materiaux: 1248000,
        cout_main_oeuvre: 360000,
        cout_total: 1608000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        projet_id: projetIds[0],
        chantier_id: chantierIds[1],
        type_element: "poteau",
        designation: "Poteau P1 - 0.3x0.3x3.5m",
        designation_ar: "عمود P1",
        nombre: 24,
        longueur: 0.3,
        largeur: 0.3,
        hauteur: 3.5,
        volume: 0.315,
        quantite_ciment_sacs: 53,
        quantite_m3: 7.56,
        volume_total: 7.56,
        dosage_id: dosageIds[1],
        cout_materiaux: 393120,
        cout_main_oeuvre: 226800,
        cout_total: 619920,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        projet_id: projetIds[0],
        chantier_id: chantierIds[1],
        type_element: "poutre",
        designation: "Poutre PR1 - 0.3x0.5x6.0m",
        designation_ar: "عارضة PR1",
        nombre: 16,
        longueur: 6.0,
        largeur: 0.3,
        hauteur: 0.5,
        volume: 0.9,
        quantite_ciment_sacs: 101,
        quantite_m3: 14.4,
        volume_total: 14.4,
        dosage_id: dosageIds[1],
        cout_materiaux: 748800,
        cout_main_oeuvre: 432000,
        cout_total: 1180800,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        projet_id: projetIds[0],
        chantier_id: chantierIds[1],
        type_element: "dalle",
        designation: "Dalle D1 - 12x8x0.2m",
        designation_ar: "بلاطة D1",
        nombre: 3,
        longueur: 12.0,
        largeur: 8.0,
        hauteur: 0.2,
        volume: 19.2,
        quantite_ciment_sacs: 346,
        quantite_m3: 57.6,
        volume_total: 57.6,
        dosage_id: dosageIds[2],
        cout_materiaux: 2592000,
        cout_main_oeuvre: 1728000,
        cout_total: 4320000,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${elements.insertedCount} structural elements`);
    
    const elementIds = Object.values(elements.insertedIds);
    
    // ========================================
    // 8. MATERIAUX
    // ========================================
    console.log("\n📦 Creating materials...");
    const materiaux = await db.collection('materiaux').insertMany([
      {
        _id: new ObjectId(),
        code: "CIM001",
        nom: "Ciment CPJ 45",
        nom_ar: "إسمنت CPJ 45",
        categorie: "ciment",
        prix_sac_50kg: 2800,
        stock_actuel: 450,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "CIM002",
        nom: "Ciment CPJ 35",
        nom_ar: "إسمنت CPJ 35",
        categorie: "ciment",
        prix_sac_50kg: 2500,
        stock_actuel: 200,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "SAB001",
        nom: "Sable de Dune",
        nom_ar: "رمل الكثبان",
        categorie: "sable",
        prix_sac_50kg: 750,
        stock_actuel: 15000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "GRA001",
        nom: "Gravier 15/25",
        nom_ar: "حصى 15/25",
        categorie: "gravier",
        prix_sac_50kg: 900,
        stock_actuel: 20000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "FER001",
        nom: "Fer à Béton HA Ø12",
        nom_ar: "حديد التسليح Ø12",
        categorie: "acier",
        prix_sac_50kg: 3500,
        stock_actuel: 5000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "BRI001",
        nom: "Briquette Creuse 15",
        nom_ar: "بلوك مجوف 15",
        categorie: "brique",
        prix_sac_50kg: 350,
        stock_actuel: 8000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${materiaux.insertedCount} materials`);
    
    // ========================================
    // 9. OUTILS
    // ========================================
    console.log("\n🔧 Creating tools...");
    const outils = await db.collection('outils').insertMany([
      {
        _id: new ObjectId(),
        code: "BET001",
        nom: "Bétonnière 350L",
        nom_ar: "خلاطة خرسانة 350 لتر",
        type: "Electrique",
        categorie: "betonnage",
        statut: "en_utilisation",
        etat: "bon",
        projet_actuel_id: projetIds[0],
        date_achat: new Date("2024-01-15"),
        prix_achat: 185000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "VIB001",
        nom: "Vibrateur à Béton",
        nom_ar: "هزاز خرسانة",
        type: "Electrique",
        categorie: "betonnage",
        statut: "disponible",
        etat: "excellent",
        projet_actuel_id: null,
        date_achat: new Date("2024-06-10"),
        prix_achat: 95000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "ECH001",
        nom: "Échafaudage Métallique 6m",
        nom_ar: "سقالة معدنية 6 متر",
        type: "Modulaire",
        categorie: "echafaudage",
        statut: "en_utilisation",
        etat: "bon",
        projet_actuel_id: projetIds[0],
        date_achat: new Date("2023-08-20"),
        prix_achat: 450000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        code: "PIL001",
        nom: "Pilonneuse Compacteuse",
        nom_ar: "آلة الدمك",
        type: "Thermique",
        categorie: "compaction",
        statut: "maintenance",
        etat: "moyen",
        projet_actuel_id: null,
        date_achat: new Date("2023-03-15"),
        prix_achat: 320000,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${outils.insertedCount} tools`);
    
    // ========================================
    // 10. DEMANDES
    // ========================================
    console.log("\n📋 Creating requests...");
    const demandes = await db.collection('demandes').insertMany([
      {
        _id: new ObjectId(),
        numero_demande: "DEM2025001",
        projet_id: projetIds[0],
        chantier_id: chantierIds[1],
        element_structure_id: elementIds[1],
        type: "materiau",
        priorite: "haute",
        statut: "approuvee",
        demandeur_id: userIds[2],
        demandeur_nom: "Fatima OULD MOHAMED",
        demandeur_role: "Ingénieur",
        created_at: new Date("2025-09-20"),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        numero_demande: "DEM2025002",
        projet_id: projetIds[0],
        chantier_id: chantierIds[1],
        element_structure_id: elementIds[3],
        type: "materiau",
        priorite: "urgente",
        statut: "commandee",
        demandeur_id: userIds[2],
        demandeur_nom: "Fatima OULD MOHAMED",
        demandeur_role: "Ingénieur",
        created_at: new Date("2025-09-25"),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        numero_demande: "DEM2025003",
        projet_id: projetIds[1],
        chantier_id: chantierIds[3],
        element_structure_id: null,
        type: "equipement",
        priorite: "normale",
        statut: "soumise",
        demandeur_id: userIds[1],
        demandeur_nom: "Ahmed SALEM",
        demandeur_role: "Chef de Projet",
        created_at: new Date("2025-09-28"),
        updated_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${demandes.insertedCount} requests`);
    
    // ========================================
    // 11. ACHATS
    // ========================================
    console.log("\n💰 Creating purchases...");
    const achats = await db.collection('achats').insertMany([
      {
        _id: new ObjectId(),
        numero_commande: "CMD2025001",
        projet_id: projetIds[0],
        chantier_id: chantierIds[1],
        fournisseur_id: soustraitantIds[0],
        statut: "livre",
        date_commande: new Date("2025-09-15"),
        date_livraison_demandee: new Date("2025-09-20"),
        date_livraison_effective: new Date("2025-09-19"),
        montant: 1260000,
        created_by: userIds[1],
        created_at: new Date("2025-09-15"),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        numero_commande: "CMD2025002",
        projet_id: projetIds[0],
        chantier_id: chantierIds[1],
        fournisseur_id: soustraitantIds[1],
        statut: "en_transit",
        date_commande: new Date("2025-09-26"),
        date_livraison_demandee: new Date("2025-10-01"),
        date_livraison_effective: null,
        montant: 847000,
        created_by: userIds[1],
        created_at: new Date("2025-09-26"),
        updated_at: new Date()
      },
      {
        _id: new ObjectId(),
        numero_commande: "CMD2025003",
        projet_id: projetIds[1],
        chantier_id: chantierIds[3],
        fournisseur_id: soustraitantIds[2],
        statut: "confirme",
        date_commande: new Date("2025-09-28"),
        date_livraison_demandee: new Date("2025-10-05"),
        date_livraison_effective: null,
        montant: 562000,
        created_by: userIds[1],
        created_at: new Date("2025-09-28"),
        updated_at: new Date()
      }
    ]);
    console.log(`  ✓ Created ${achats.insertedCount} purchases`);
    
    // ========================================
    // 12. MAIN D'OEUVRES
    // ========================================
    console.log("\n👷 Creating workforce records...");
    const mainOeuvres = await db.collection('main_oeuvres').insertMany([
      {
        _id: new ObjectId(),
        sous_traitants_id: soustraitantIds[0],
        telephone: 22456789,
        heures_travaillees: 1240.5
      },
      {
        _id: new ObjectId(),
        sous_traitants_id: soustraitantIds[1],
        telephone: 22567890,
        heures_travaillees: 856.0
      },
      {
        _id: new ObjectId(),
        sous_traitants_id: soustraitantIds[2],
        telephone: 22678901,
        heures_travaillees: 432.5
      }
    ]);
    console.log(`  ✓ Created ${mainOeuvres.insertedCount} workforce records`);
    
    // ========================================
    // 13. PERMISSIONS
    // ========================================
    console.log("\n🔐 Creating permissions...");
    const permissions = await db.collection('permissions').insertMany([
      {
        _id: new ObjectId(),
        role_id: roleIds[0],
        user_id: userIds[0]
      },
      {
        _id: new ObjectId(),
        role_id: roleIds[1],
        user_id: userIds[1]
      },
      {
        _id: new ObjectId(),
        role_id: roleIds[2],
        user_id: userIds[2]
      }
    ]);
    console.log(`  ✓ Created ${permissions.insertedCount} permissions`);
    
    // ========================================
    // 14. CREATE INDEXES
    // ========================================
    console.log("\n🔍 Creating indexes...");
    
    // Projets indexes
    await db.collection('projets').createIndex({ code: 1 }, { unique: true });
    await db.collection('projets').createIndex({ statut: 1 });
    await db.collection('projets').createIndex({ chef_projet_id: 1 });
    await db.collection('projets').createIndex({ date_debut: 1 });
    await db.collection('projets').createIndex({ latitude: 1, longitude: 1 }, { name: 'geo_index' });
    console.log("  ✓ Projets indexes created");
    
    // Chantiers indexes
    await db.collection('chantiers').createIndex({ projet_id: 1, numero_phase: 1 });
    await db.collection('chantiers').createIndex({ statut: 1 });
    await db.collection('chantiers').createIndex({ date_debut_prevue: 1 });
    console.log("  ✓ Chantiers indexes created");
    
    // Elements structure indexes
    await db.collection('elements_structure').createIndex({ projet_id: 1, chantier_id: 1 });
    await db.collection('elements_structure').createIndex({ type_element: 1 });
    console.log("  ✓ Elements structure indexes created");
    
    // Parametres dosages indexes
    await db.collection('parametres_dosages').createIndex({ code: 1 }, { unique: true });
    await db.collection('parametres_dosages').createIndex({ type: 1, is_active: 1 });
    console.log("  ✓ Parametres dosages indexes created");
    
    // Materiaux indexes
    await db.collection('materiaux').createIndex({ code: 1 }, { unique: true });
    await db.collection('materiaux').createIndex({ categorie: 1 });
    await db.collection('materiaux').createIndex({ is_active: 1 });
    console.log("  ✓ Materiaux indexes created");
    
    // Achats indexes
    await db.collection('achats').createIndex({ numero_commande: 1 }, { unique: true });
    await db.collection('achats').createIndex({ projet_id: 1, statut: 1 });
    await db.collection('achats').createIndex({ fournisseur_id: 1 });
    await db.collection('achats').createIndex({ date_commande: 1 });
    console.log("  ✓ Achats indexes created");
    
    // Demandes indexes
    await db.collection('demandes').createIndex({ numero_demande: 1 }, { unique: true });
    await db.collection('demandes').createIndex({ projet_id: 1, statut: 1 });
    await db.collection('demandes').createIndex({ statut: 1, priorite: 1 });
    console.log("  ✓ Demandes indexes created");
    
    // Utilisateurs indexes
    await db.collection('utilisateurs').createIndex({ username: 1 }, { unique: true });
    await db.collection('utilisateurs').createIndex({ email: 1 }, { unique: true });
    await db.collection('utilisateurs').createIndex({ role_id: 1, is_active: 1 });
    console.log("  ✓ Utilisateurs indexes created");
    
    // Roles indexes
    await db.collection('roles').createIndex({ code: 1 }, { unique: true });
    console.log("  ✓ Roles indexes created");
    
    // ========================================
    // SUMMARY
    // ========================================
    console.log("\n" + "=".repeat(50));
    console.log("✅ DATABASE SETUP COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\n📊 Summary:");
    console.log(`  - Database: ${DB_NAME}`);
    console.log(`  - Roles: ${roles.insertedCount}`);
    console.log(`  - Users: ${users.insertedCount}`);
    console.log(`  - Dosage Parameters: ${dosages.insertedCount}`);
    console.log(`  - Subcontractors: ${soustraitants.insertedCount}`);
    console.log(`  - Projects: ${projets.insertedCount}`);
    console.log(`  - Construction Sites: ${chantiers.insertedCount}`);
    console.log(`  - Structural Elements: ${elements.insertedCount}`);
    console.log(`  - Materials: ${materiaux.insertedCount}`);
    console.log(`  - Tools: ${outils.insertedCount}`);
    console.log(`  - Requests: ${demandes.insertedCount}`);
    console.log(`  - Purchases: ${achats.insertedCount}`);
    console.log(`  - Workforce Records: ${mainOeuvres.insertedCount}`);
    console.log(`  - Permissions: ${permissions.insertedCount}`);
    console.log("\n🔐 Test Credentials:");
    console.log("  Username: admin");
    console.log("  Email: admin@civil360.com");
    console.log("\n🌐 MongoDB URI:");
    console.log(`  ${MONGODB_URI}`);
    console.log("\n" + "=".repeat(50));
    
  } catch (error) {
    console.error("\n❌ Error setting up database:", error);
    throw error;
  } finally {
    await client.close();
    console.log("\n✓ MongoDB connection closed");
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log("\n✨ All done! Your CIVIL360 database is ready to use.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Setup failed:", error);
    process.exit(1);
  });
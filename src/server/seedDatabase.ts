import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/database';

// Import all models
import Projet from './models/Projet';
import Chantier from './models/Chantier';
import ElementStructure from './models/ElementStructure';
import Materiau from './models/Materiau';
import Dosage from './models/Dosage';
import Achat from './models/Achat';
import Demande from './models/Demande';
import Outil from './models/Outil';
import SousTraitant from './models/SousTraitant';
import Journalier from './models/Journalier';
import Utilisateur from './models/Utilisateur';
import Role from './models/Role';
import Permission from './models/Permission';

const seedDatabase = async () => {
  try {
    console.log('🌱 Connexion à la base de données...');
    await connectDB();

    console.log('🗑️ Nettoyage des collections existantes...');
    await Promise.all([
      Projet.deleteMany({}),
      Chantier.deleteMany({}),
      ElementStructure.deleteMany({}),
      Materiau.deleteMany({}),
      Dosage.deleteMany({}),
      Achat.deleteMany({}),
      Demande.deleteMany({}),
      Outil.deleteMany({}),
      SousTraitant.deleteMany({}),
      Journalier.deleteMany({}),
      Utilisateur.deleteMany({}),
      Role.deleteMany({}),
      Permission.deleteMany({})
    ]);

    // 1. Créer les rôles et permissions
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

    const roleDirecteurAchat = await Role.create({
      nom: "Directeur Achat",
      nom_ar: "مدير المشتريات",
      code: "directeur_achat",
      niveau_hierarchique: 2,
      permissions_id: new mongoose.Types.ObjectId(),
      description: "Responsable des achats et approvisionnements"
    });

    // Créer les permissions pour le directeur général (accès complet)
    await Permission.create({
      role_id: roleDirecteurGeneral._id,
      modules: {
        projets: { lecture: true, ecriture: true, suppression: true, export: true },
        chantiers: { lecture: true, ecriture: true, suppression: true, validation: true },
        elements_structure: { lecture: true, ecriture: true, calcul: true, export: true },
        achats: { lecture: true, ecriture: true, validation: true, export: true },
        demandes: { lecture: true, ecriture: true, validation: true, approbation: true },
        materiaux: { lecture: true, ecriture: true, gestion_stock: true, prix: true },
        outils: { lecture: true, ecriture: true, maintenance: true, transfert: true },
        sous_traitants: { lecture: true, ecriture: true, evaluation: true, contrats: true },
        journaliers: { lecture: true, ecriture: true, validation: true, export: true },
        utilisateurs: { lecture: true, ecriture: true, gestion_roles: true, suppression: true },
        rapports: { lecture: true, generation: true, export: true, dashboards: true },
        parametrage: { lecture: true, ecriture: true, systeme: true, backup: true }
      }
    });

    // Permissions pour l'ingénieur
    await Permission.create({
      role_id: roleIngenieur._id,
      modules: {
        projets: { lecture: true, ecriture: true, suppression: false, export: true },
        chantiers: { lecture: true, ecriture: true, suppression: false, validation: false },
        elements_structure: { lecture: true, ecriture: true, calcul: true, export: true },
        achats: { lecture: true, ecriture: false, validation: false, export: false },
        demandes: { lecture: true, ecriture: true, validation: false, approbation: false },
        materiaux: { lecture: true, ecriture: false, gestion_stock: false, prix: false },
        outils: { lecture: true, ecriture: true, maintenance: false, transfert: true },
        sous_traitants: { lecture: true, ecriture: false, evaluation: false, contrats: false },
        journaliers: { lecture: true, ecriture: true, validation: false, export: true },
        utilisateurs: { lecture: false, ecriture: false, gestion_roles: false, suppression: false },
        rapports: { lecture: true, generation: true, export: true, dashboards: true },
        parametrage: { lecture: false, ecriture: false, systeme: false, backup: false }
      }
    });

    // Permissions pour le directeur achat
    await Permission.create({
      role_id: roleDirecteurAchat._id,
      modules: {
        projets: { lecture: true, ecriture: false, suppression: false, export: true },
        chantiers: { lecture: true, ecriture: false, suppression: false, validation: false },
        elements_structure: { lecture: true, ecriture: false, calcul: false, export: true },
        achats: { lecture: true, ecriture: true, validation: true, export: true },
        demandes: { lecture: true, ecriture: true, validation: true, approbation: true },
        materiaux: { lecture: true, ecriture: true, gestion_stock: true, prix: true },
        outils: { lecture: true, ecriture: false, maintenance: false, transfert: false },
        sous_traitants: { lecture: true, ecriture: true, evaluation: true, contrats: true },
        journaliers: { lecture: true, ecriture: false, validation: false, export: true },
        utilisateurs: { lecture: false, ecriture: false, gestion_roles: false, suppression: false },
        rapports: { lecture: true, generation: true, export: true, dashboards: true },
        parametrage: { lecture: false, ecriture: false, systeme: false, backup: false }
      }
    });

    // 2. Créer les utilisateurs
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

    const mohamed = await Utilisateur.create({
      username: "mohamed_achat",
      email: "mohamed@civil360.com",
      password_hash: passwordHash,
      profil: {
        prenom: "Mohamed",
        nom: "Ould Saleck",
        nom_arabe: "محمد ولد سالك",
        role_id: roleDirecteurAchat._id,
        departement: "achat",
        telephone: "+222 ZZ ZZ ZZ ZZ",
        langue_preference: "fr",
        fuseau_horaire: "Africa/Nouakchott"
      },
      is_active: true
    });

    // 3. Créer les sous-traitants/fournisseurs
    console.log('🏢 Création des fournisseurs...');
    
    const lafarge = await SousTraitant.create({
      code: "FRS-LAF-001",
      nom: "Lafarge",
      type: "fournisseur_materiaux",
      categories: ["beton", "ciment", "agregats"],
      contact: {
        adresse: "Zone Industrielle, Nouakchott",
        telephone: "+222 XX XX XX XX",
        email: "contact@lafarge.mr",
        personne_contact: "Mohamed Ould Ahmed",
        site_web: "www.lafarge.mr"
      },
      informations_financieres: {
        conditions_paiement: "30 jours",
        devise_preferee: "EUR",
        numero_fiscal: "123456789",
        coordonnees_bancaires: {
          iban: "MR13 0001 2345 6789 0123 4567 890",
          banque: "BMCI"
        }
      },
      performance: {
        note_globale: 9.2,
        commandes_totales: 45,
        taux_livraison_temps: 0.92,
        note_qualite: 9.0,
        note_prix: 8.5,
        derniere_evaluation: new Date('2024-09-01')
      },
      catalogue: [],
      contrats: [{
        numero_contrat: "CONT-LAF-2024-01",
        type: "accord_cadre",
        date_debut: new Date('2024-01-01'),
        date_fin: new Date('2024-12-31'),
        montant_total: 300000,
        statut: "actif"
      }],
      alertes: [{
        type: "performance_baisse",
        message: "Taux de livraison à l'heure en baisse",
        date_creation: new Date('2024-09-20'),
        severite: "warning"
      }],
      is_active: true
    });

    // 4. Créer les matériaux et dosages
    console.log('🧱 Création des matériaux et dosages...');
    
    const betonC25 = await Materiau.create({
      code: "BET-C25-30",
      nom: "Béton C25/30",
      nom_ar: "خرسانة C25/30",
      categorie: "beton",
      specifications: {
        classe_resistance: "C25/30",
        masse_volumique: 2400,
        resistance_compression: "25 MPa"
      },
      dosage_parametre: {
        ciment_kg_m3: 350,
        gravier_kg_m3: 1500,
        sable_kg_m3: 1800,
        eau_litres_m3: 175,
        adjuvants_kg_m3: 3.5
      },
      unites: {
        unite_principale: "m³",
        unites_alternatives: ["sac", "tonne", "litre"]
      },
      prix: {
        prix_unitaire_m3: 150,
        prix_sac_50kg: 8.5,
        devise: "EUR"
      },
      fournisseurs: [{
        fournisseur_id: lafarge._id,
        nom: "Lafarge",
        prix: 150,
        quantite_min: 5,
        delai_livraison_jours: 2,
        note: 9.2
      }],
      stock: {
        stock_actuel: 0,
        seuil_reapprovisionnement: 10,
        stock_max: 100
      },
      is_active: true
    });

    const cimentCPJ45 = await Materiau.create({
      code: "CIM-CPJ45",
      nom: "Ciment CPJ45",
      nom_ar: "إسمنت CPJ45",
      categorie: "ciment",
      specifications: {
        classe_resistance: "45 MPa",
        type: "CPJ45"
      },
      unites: {
        unite_principale: "sac",
        unites_alternatives: ["kg", "tonne"]
      },
      prix: {
        prix_sac_50kg: 8.5,
        prix_kg: 0.17,
        devise: "EUR"
      },
      fournisseurs: [{
        fournisseur_id: lafarge._id,
        nom: "Lafarge",
        prix: 8.5,
        quantite_min: 50,
        delai_livraison_jours: 1,
        note: 9.2
      }],
      stock: {
        stock_actuel: 200,
        seuil_reapprovisionnement: 50,
        stock_max: 500
      },
      is_active: true
    });

    const acierHA8 = await Materiau.create({
      code: "ACR-HA8",
      nom: "Acier HA500 8mm",
      nom_ar: "حديد تسليح HA500 8مم",
      categorie: "acier",
      specifications: {
        diametre: "8mm",
        type: "HA500"
      },
      unites: {
        unite_principale: "kg",
        unites_alternatives: ["tonne", "botte"]
      },
      prix: {
        prix_kg: 1.20,
        prix_tonne: 1200,
        devise: "EUR"
      },
      fournisseurs: [{
        fournisseur_id: lafarge._id,
        nom: "Lafarge",
        prix: 1.20,
        quantite_min: 100,
        delai_livraison_jours: 3,
        note: 8.8
      }],
      stock: {
        stock_actuel: 1500,
        seuil_reapprovisionnement: 200,
        stock_max: 3000
      },
      is_active: true
    });

    // Créer un dosage
    const dosageStandard = await Dosage.create({
      nom: "Béton Standard Fondations",
      nom_ar: "خرسانة قياسية للأسس",
      type: "beton",
      classe: "C25/30",
      usage: "fondations",
      composition_m3: {
        ciment: {
          quantite_kg: 350,
          type: "CPJ45",
          poids_sac: 50,
          nombre_sacs: 7
        },
        gravier: {
          quantite_kg: 1500,
          granulometrie: "15/25",
          masse_volumique: 1800
        },
        sable: {
          quantite_kg: 1800,
          type: "sable_concasse",
          masse_volumique: 1800
        },
        eau: {
          quantite_litres: 175,
          ratio_eau_ciment: 0.5
        },
        adjuvants: {
          quantite_kg: 3.5,
          type: "plastifiant"
        }
      },
      proprietes: {
        affaissement: "S3",
        resistance_28j: "25 MPa",
        duree_malaxage_min: 3,
        temps_prise_heures: 6
      },
      cout_m3: {
        ciment: 59.5,
        gravier: 37.5,
        sable: 36,
        eau: 0.35,
        adjuvants: 10.5,
        total: 143.85
      },
      is_default: true,
      is_active: true,
      created_by: tijani._id
    });

    // 5. Créer les outils
    console.log('🔧 Création des outils...');
    
    const vibrateur = await Outil.create({
      code: "VIB-001",
      nom: "Vibrateur",
      nom_ar: "هزاز",
      type: "vibrateur",
      categorie: "compaction",
      marque: "Wacker Neuson",
      modele: "Wacker Neuson 60",
      specifications: {
        puissance: "2.2 kW",
        frequence: "13000 vpm",
        poids: "25 kg",
        carburant: "essence"
      },
      statut: "en_utilisation",
      etat: "bon",
      localisation: {
        site_nom: "Tour Lumia",
        derniere_mise_a_jour: new Date(),
        coordonnees: {
          latitude: 48.8566,
          longitude: 2.3522
        }
      },
      propriete: {
        type: "possede",
        date_achat: new Date('2023-06-15'),
        prix_achat: 3500,
        taux_amortissement: 0.20,
        valeur_actuelle: 2800
      },
      location: {
        tarif_jour: 150
      },
      maintenance: {
        derniere_maintenance: new Date('2024-08-15'),
        prochaine_maintenance: new Date('2024-10-15'),
        intervalle_jours: 60,
        heures_utilisation_totales: 1250,
        historique: [{
          date: new Date('2024-08-15'),
          type: "preventive",
          description: "Changement huile, vérification générale",
          cout: 250,
          technicien: "Service Wacker"
        }]
      },
      transferts: [],
      utilisation: {
        taux_utilisation: 0.82,
        jours_location_mois: 25,
        revenu_genere_mois: 3750
      }
    });

    // 6. Créer le projet
    console.log('🏗️ Création du projet...');
    
    const tourLumia = await Projet.create({
      code: "LUM-2024-001",
      nom: "Tour Lumia",
      nom_ar: "برج لوميا",
      type: "residential_tower",
      statut: "en_cours",
      localisation: {
        adresse: "Paris 15ème",
        adresse_ar: "باريس المنطقة 15",
        ville: "Paris",
        pays: "France",
        coordonnees: {
          latitude: 48.8566,
          longitude: 2.3522
        }
      },
      calendrier: {
        date_debut: new Date('2024-01-15'),
        date_fin_prevue: new Date('2025-01-15'),
        duree_mois: 12,
        ecart_jours: -3
      },
      budget: {
        total_alloue: 5000000,
        total_depense: 4500000,
        restant: 500000,
        devise: "EUR",
        repartition: {
          main_oeuvre: { alloue: 2250000, depense: 2025000, pourcentage: 45 },
          materiaux: { alloue: 1750000, depense: 1575000, pourcentage: 35 },
          equipements: { alloue: 750000, depense: 675000, pourcentage: 15 },
          imprevus: { alloue: 250000, depense: 225000, pourcentage: 5 }
        }
      },
      avancement: {
        pourcentage_global: 75,
        derniere_mise_a_jour: new Date()
      },
      equipe: {
        chef_projet: tijani._id,
        ingenieur_principal: ahmed._id,
        ingenieurs: [ahmed._id]
      },
      alertes_actives: [{
        type: "depassement_budget",
        severite: "warning",
        message: "Dépassement budget MO +8%",
        date_creation: new Date('2024-09-20')
      }],
      created_by: tijani._id
    });

    // Mise à jour de la localisation de l'outil
    await Outil.findByIdAndUpdate(vibrateur._id, {
      'localisation.projet_actuel_id': tourLumia._id
    });

    // 7. Créer le chantier
    console.log('🚧 Création du chantier...');
    
    const chantierFondations = await Chantier.create({
      projet_id: tourLumia._id,
      nom: "Fondations",
      nom_ar: "الأسس",
      numero_phase: 1,
      statut: "termine",
      calendrier: {
        date_debut_prevue: new Date('2024-01-15'),
        date_fin_prevue: new Date('2024-02-15'),
        date_debut_reelle: new Date('2024-01-15'),
        date_fin_reelle: new Date('2024-02-12'),
        retard_jours: -3
      },
      taches: [{
        nom: "Terrassement",
        nom_ar: "الحفر",
        statut: "termine",
        equipe_assignee: "Équipe A",
        date_debut: new Date('2024-01-15'),
        date_fin: new Date('2024-01-20'),
        avancement: 100,
        heures_main_oeuvre: {
          prevues: 200,
          reelles: 190
        }
      }],
      elements_structure: [],
      materiaux_calcules: [betonC25._id, cimentCPJ45._id]
    });

    // 8. Créer l'élément de structure
    console.log('🏢 Création des éléments de structure...');
    
    const semelles = await ElementStructure.create({
      projet_id: tourLumia._id,
      chantier_id: chantierFondations._id,
      type_element: "semelle_isolee",
      designation: "Semelles isolées S1-S24",
      designation_ar: "قواعد منفصلة",
      caracteristiques: {
        nombre: 24,
        longueur_poteau: 0.2,
        largeur_poteau: 0.2,
        hauteur_poteau: 3.3,
        volume_beton: 3.54
      },
      beton: {
        type: "Béton",
        quantite_ciment_sacs: 24.8,
        quantite_briquettes: 51.8,
        quantite_m3: 2.85,
        volume_total: 3.54,
        dosage: {
          dosage_id: dosageStandard._id,
          dosage_nom: "Béton standard",
          ciment_kg_m3: 350,
          gravier_kg_m3: 1500,
          sable_kg_m3: 1800,
          eau_litres_m3: 175
        },
        quantites_detaillees: {
          ciment: {
            kg_total: 1239.5,
            sacs_50kg: 24.8,
            cout_unitaire: 8.5,
            cout_total: 210.8
          },
          briquettes: {
            nombre: 51.8,
            metre_cube: 2.85,
            cout_unitaire: 150,
            cout_total: 427.5
          },
          gravier: {
            kg_total: 5310,
            tonnes: 5.31,
            metre_cube: 4.28,
            masse_volumique: 1800,
            cout_tonne: 25,
            cout_total: 132.75
          },
          sable: {
            kg_total: 6372,
            tonnes: 6.37,
            metre_cube: 2.28,
            masse_volumique: 1800,
            cout_tonne: 20,
            cout_total: 127.44
          }
        }
      },
      ferraillage: {
        type: "armatures longitudinales",
        diametre_fer: "8mm",
        longueur_poteau: 0.2,
        largeur_poteau: 0.2,
        hauteur_poteau: 3.3,
        espacement_cadre: 0.2,
        cadres: {
          nombre_cadres: 18,
          longueur_cadres: 0.72,
          nombre_barres: 4,
          nombre_poteau: 27,
          nombre_bottes: 0.6,
          nombre_tonnes: 0.08,
          ratio_kg_m3: 39.50,
          cout_kg: 1.20,
          cout_total: 96
        },
        armatures_transversales: {
          diametre_fer: "6mm",
          espacement_cadre: 0.2,
          nombre_cadres: 18,
          longueur_cadres: 0.72,
          nombre_poteau: 27,
          nombre_bottes: 0.8,
          nombre_tonnes: 0.08,
          ratio_kg_m3: 38.78,
          cout_kg: 1.20,
          cout_total: 96
        }
      },
      cout_total: {
        materiaux: 1090.47,
        main_oeuvre: 450,
        total: 1540.47
      }
    });

    // Mise à jour du chantier avec l'élément de structure
    await Chantier.findByIdAndUpdate(chantierFondations._id, {
      $push: { elements_structure: semelles._id }
    });

    // 9. Créer une commande/achat
    console.log('📦 Création d\'une commande...');
    
    const commande = await Achat.create({
      numero_commande: "CMD-2024-001",
      projet_id: tourLumia._id,
      chantier_id: chantierFondations._id,
      fournisseur_id: lafarge._id,
      statut: "livre",
      dates: {
        date_commande: new Date('2024-08-15'),
        date_livraison_demandee: new Date('2024-08-18'),
        date_livraison_effective: new Date('2024-08-18'),
        retard_jours: 0
      },
      articles: [
        {
          materiau_id: betonC25._id,
          nom: "Béton C25/30",
          quantite: 94.40,
          unite: "m³",
          prix_unitaire: 150,
          prix_total: 14160
        },
        {
          materiau_id: cimentCPJ45._id,
          nom: "Ciment CPJ45",
          quantite: 450,
          unite: "sac",
          prix_unitaire: 8.5,
          prix_total: 3825
        }
      ],
      financier: {
        sous_total: 17985,
        taux_tva: 0.20,
        montant_tva: 3597,
        total_ttc: 21582,
        devise: "EUR"
      },
      livraison: {
        adresse: "Tour Lumia, Paris 15ème",
        statut_livraison: "livre",
        numero_suivi: "LAF-2024-8856",
        notes: "Livraison conforme"
      },
      validations: [{
        utilisateur_id: ahmed._id,
        role: "ingenieur",
        valide: true,
        date: new Date('2024-08-15T14:00:00Z'),
        commentaire: "Quantités validées"
      }],
      created_by: mohamed._id
    });

    // 10. Créer une demande d'approvisionnement
    console.log('📋 Création d\'une demande...');
    
    const demande = await Demande.create({
      numero_demande: "DEM-2024-045",
      projet_id: tourLumia._id,
      chantier_id: chantierFondations._id,
      element_structure_id: semelles._id,
      type: "materiau",
      priorite: "normale",
      statut: "approuvee",
      demandeur: {
        utilisateur_id: ahmed._id,
        nom: "Ahmed Jeddou",
        role: "ingenieur"
      },
      materiaux_demandes: [{
        materiau_id: betonC25._id,
        nom: "Béton C25/30",
        quantite_demandee: 94.40,
        unite: "m³",
        date_besoin: new Date('2024-08-18'),
        justification: "Coulage fondations niveau -1"
      }],
      budget_estime: {
        montant: 14160,
        devise: "EUR"
      },
      workflow: [
        {
          etape: "creation",
          utilisateur_id: ahmed._id,
          date: new Date('2024-08-13T10:00:00Z'),
          statut: "termine"
        },
        {
          etape: "validation_ingenieur",
          utilisateur_id: ahmed._id,
          date: new Date('2024-08-13T14:00:00Z'),
          statut: "approuve"
        },
        {
          etape: "validation_directeur_achat",
          utilisateur_id: mohamed._id,
          date: new Date('2024-08-14T09:00:00Z'),
          statut: "approuve"
        },
        {
          etape: "commande_passee",
          utilisateur_id: mohamed._id,
          date: new Date('2024-08-15T09:00:00Z'),
          statut: "termine",
          commande_id: commande._id
        }
      ]
    });

    // 11. Créer un rapport journalier
    console.log('📊 Création d\'un rapport journalier...');
    
    await Journalier.create({
      projet_id: tourLumia._id,
      chantier_id: chantierFondations._id,
      date_rapport: new Date('2024-09-24'),
      redige_par: ahmed._id,
      meteo: {
        condition: "ensoleille",
        temperature: 25,
        precipitation: 0,
        vitesse_vent: 10
      },
      materiaux_consommes: [
        {
          materiau_id: betonC25._id,
          nom: "Béton C25/30",
          quantite_utilisee: 12.5,
          unite: "m³",
          stock_restant: 85
        },
        {
          materiau_id: acierHA8._id,
          nom: "Acier HA500 8mm",
          quantite_utilisee: 320,
          unite: "kg",
          stock_restant: 1180
        }
      ],
      main_oeuvre: [{
        equipe_nom: "Équipe B",
        nombre_ouvriers: 5,
        heures_travaillees: 40,
        taches_realisees: ["Coffrage semelles", "Pose armatures"],
        efficacite: 8.5
      }],
      equipements_utilises: [{
        outil_id: vibrateur._id,
        nom: "Vibrateur VIB-001",
        heures_utilisation: 6,
        carburant_consomme: 12.5,
        unite_carburant: "litres"
      }],
      avancement_taches: [{
        tache_nom: "Coffrage",
        avancement_prevu: 100,
        avancement_reel: 65,
        motifs_retard: ["Retard livraison acier 8mm"]
      }],
      incidents: [{
        type: "retard_livraison",
        description: "Retard livraison acier 8mm - 2 heures",
        impact: "Retard ferraillage",
        action_corrective: "Réorganisation équipes",
        severite: "mineur"
      }],
      photos: [{
        url: "/uploads/daily_reports/2024-09-24_foundation_progress.jpg",
        legende: "Avancement fondations secteur A",
        timestamp: new Date('2024-09-24T14:30:00Z')
      }],
      observations: "Avancement satisfaisant malgré retard matériaux",
      note_journee: 7.5
    });

    console.log('✅ Base de données initialisée avec succès!');
    console.log(`
📊 Données créées:
- ${await Role.countDocuments()} rôles
- ${await Permission.countDocuments()} permissions
- ${await Utilisateur.countDocuments()} utilisateurs
- ${await SousTraitant.countDocuments()} fournisseurs
- ${await Materiau.countDocuments()} matériaux
- ${await Dosage.countDocuments()} dosages
- ${await Outil.countDocuments()} outils
- ${await Projet.countDocuments()} projets
- ${await Chantier.countDocuments()} chantiers
- ${await ElementStructure.countDocuments()} éléments de structure
- ${await Achat.countDocuments()} commandes
- ${await Demande.countDocuments()} demandes
- ${await Journalier.countDocuments()} rapports journaliers

👤 Utilisateurs créés:
- tijani_dg / password123 (Directeur Général)
- ahmed_ing / password123 (Ingénieur)
- mohamed_achat / password123 (Directeur Achat)
    `);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;

import mongoose from 'mongoose';
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

const verifyDatabase = async () => {
  try {
    console.log('🔍 Connexion à la base de données pour vérification...');
    await connectDB();

    console.log('\n📊 Vérification des données insérées:');
    console.log('==========================================');

    // Compter les documents dans chaque collection
    const counts = {
      roles: await Role.countDocuments(),
      permissions: await Permission.countDocuments(),
      utilisateurs: await Utilisateur.countDocuments(),
      fournisseurs: await SousTraitant.countDocuments(),
      materiaux: await Materiau.countDocuments(),
      dosages: await Dosage.countDocuments(),
      outils: await Outil.countDocuments(),
      projets: await Projet.countDocuments(),
      chantiers: await Chantier.countDocuments(),
      elements_structure: await ElementStructure.countDocuments(),
      achats: await Achat.countDocuments(),
      demandes: await Demande.countDocuments(),
      journaliers: await Journalier.countDocuments()
    };

    console.log(`✅ Rôles: ${counts.roles}`);
    console.log(`✅ Permissions: ${counts.permissions}`);
    console.log(`✅ Utilisateurs: ${counts.utilisateurs}`);
    console.log(`✅ Fournisseurs: ${counts.fournisseurs}`);
    console.log(`✅ Matériaux: ${counts.materiaux}`);
    console.log(`✅ Dosages: ${counts.dosages}`);
    console.log(`✅ Outils: ${counts.outils}`);
    console.log(`✅ Projets: ${counts.projets}`);
    console.log(`✅ Chantiers: ${counts.chantiers}`);
    console.log(`✅ Éléments de structure: ${counts.elements_structure}`);
    console.log(`✅ Achats: ${counts.achats}`);
    console.log(`✅ Demandes: ${counts.demandes}`);
    console.log(`✅ Rapports journaliers: ${counts.journaliers}`);

    console.log('\n🔍 Échantillons de données:');
    console.log('============================');

    // Afficher quelques échantillons de données
    const sampleProject = await Projet.findOne().populate('equipe.chef_projet', 'username profil.prenom profil.nom');
    if (sampleProject) {
      console.log(`📋 Projet exemple: "${sampleProject.nom}" (${sampleProject.code})`);
      console.log(`   📍 Localisation: ${sampleProject.localisation.ville}, ${sampleProject.localisation.pays}`);
      console.log(`   📈 Avancement: ${sampleProject.avancement.pourcentage_global}%`);
      console.log(`   💰 Budget total: ${sampleProject.budget.total_alloue.toLocaleString()} ${sampleProject.budget.devise}`);
    }

    const sampleUser = await Utilisateur.findOne().populate('profil.role_id', 'nom code');
    if (sampleUser) {
      console.log(`👤 Utilisateur exemple: ${sampleUser.profil.prenom} ${sampleUser.profil.nom} (${sampleUser.username})`);
      console.log(`   🏢 Département: ${sampleUser.profil.departement}`);
      console.log(`   🌐 Langue: ${sampleUser.profil.langue_preference}`);
    }

    const sampleMaterial = await Materiau.findOne().populate('fournisseurs.fournisseur_id', 'nom');
    if (sampleMaterial) {
      console.log(`🧱 Matériau exemple: "${sampleMaterial.nom}" (${sampleMaterial.code})`);
      console.log(`   📦 Catégorie: ${sampleMaterial.categorie}`);
      console.log(`   💰 Prix: ${sampleMaterial.prix.prix_unitaire_m3 || sampleMaterial.prix.prix_sac_50kg || sampleMaterial.prix.prix_kg} ${sampleMaterial.prix.devise}`);
      console.log(`   📊 Stock actuel: ${sampleMaterial.stock.stock_actuel} ${sampleMaterial.unites.unite_principale}`);
    }

    const sampleOrder = await Achat.findOne()
      .populate('projet_id', 'nom code')
      .populate('fournisseur_id', 'nom');
    if (sampleOrder) {
      console.log(`📦 Commande exemple: ${sampleOrder.numero_commande}`);
      console.log(`   🏗️ Projet: ${sampleOrder.projet_id?.nom}`);
      console.log(`   🏢 Fournisseur: ${sampleOrder.fournisseur_id?.nom}`);
      console.log(`   💰 Total TTC: ${sampleOrder.financier.total_ttc.toLocaleString()} ${sampleOrder.financier.devise}`);
      console.log(`   📊 Statut: ${sampleOrder.statut}`);
    }

    // Vérifier les relations entre les collections
    console.log('\n🔗 Vérification des relations:');
    console.log('===============================');

    const projectWithChantiers = await Projet.findOne();
    if (projectWithChantiers) {
      const chantiers = await Chantier.find({ projet_id: projectWithChantiers._id });
      console.log(`✅ Projet "${projectWithChantiers.nom}" a ${chantiers.length} chantier(s)`);

      if (chantiers.length > 0) {
        const elements = await ElementStructure.find({ chantier_id: chantiers[0]._id });
        console.log(`✅ Chantier "${chantiers[0].nom}" a ${elements.length} élément(s) de structure`);
      }
    }

    const userWithRole = await Utilisateur.findOne().populate('profil.role_id');
    if (userWithRole && userWithRole.profil.role_id) {
      const permissions = await Permission.findOne({ role_id: userWithRole.profil.role_id._id });
      console.log(`✅ Utilisateur "${userWithRole.username}" a le rôle "${userWithRole.profil.role_id.nom}"`);
      console.log(`✅ Ce rôle a des permissions configurées: ${permissions ? 'Oui' : 'Non'}`);
    }

    console.log('\n🎉 Vérification terminée avec succès!');
    console.log('\n📝 Résumé de la base de données Civil360:');
    console.log('==========================================');
    console.log(`Total des documents: ${Object.values(counts).reduce((sum, count) => sum + count, 0)}`);
    console.log('Base de données prête pour l\'application Civil360! 🚀');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  verifyDatabase();
}

export default verifyDatabase;

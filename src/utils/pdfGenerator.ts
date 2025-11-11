import { Soustraitant, Journalier, Pointage } from '@/types/personnel';

// Fonction pour générer un PDF de décompte soustraitant
export function generateDecomptePDF(soustraitant: Soustraitant) {
  // Cette fonction nécessite jsPDF et jspdf-autotable
  // Pour l'instant, nous créons une version simplifiée qui peut être étendue
  
  const content = `
DÉCOMPTE SOUS-TRAITANT
========================

Chantier: ${soustraitant.chantier}
Date: ${soustraitant.date}
Soustraitant: ${soustraitant.nom}
Téléphone: ${soustraitant.telephone}

DÉTAIL DES TÂCHES
-----------------

${soustraitant.taches.map((tache, index) => `
${index + 1}. ${tache.description}
   Quantité: ${tache.quantite} ${tache.unite}
   Prix Unitaire: ${tache.prix} MRU
   Avancement: ${tache.avancement}%
   Montant: ${(tache.quantite * tache.prix).toLocaleString()} MRU
`).join('\n')}

TOTAL: ${soustraitant.montantTotal.toLocaleString()} MRU

Signature du soustraitant: _________________________

Signature du responsable: _________________________
  `;

  // Créer un blob et télécharger
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `decompte-${soustraitant.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Fonction pour générer un PDF de pointage
export function generatePointagePDF(
  journaliers: Journalier[],
  dateDebut: string,
  chantier: string
) {
  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'] as const;
  
  const content = `
FICHE DE POINTAGE HEBDOMADAIRE
===============================

Chantier: ${chantier}
Semaine du: ${dateDebut}

POINTAGES
---------

${journaliers.map(journalier => {
  const pointage = journalier.pointages.find(
    p => p.semaine === dateDebut && p.chantier === chantier
  );
  
  if (!pointage) return '';
  
  const totalHS = jours.reduce((sum, jour) => sum + pointage[jour].heuresSupp, 0);
  
  return `
${journalier.nom} (${journalier.telephone})
${jours.map(jour => {
  const p = pointage[jour];
  return `  ${jour.charAt(0).toUpperCase() + jour.slice(1)}: ${p.present ? 'Présent' : 'Absent'} (${p.heuresSupp}h supp)`;
}).join('\n')}
  Total heures supplémentaires: ${totalHS}h
`;
}).join('\n')}

Légende: P = Présent, A = Absent, (Xh) = Heures supplémentaires
  `;

  // Créer un blob et télécharger
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pointage-${dateDebut}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Pour une vraie implémentation PDF, vous devrez installer:
// npm install jspdf jspdf-autotable
// Et utiliser ces bibliothèques pour créer de vrais PDFs formatés

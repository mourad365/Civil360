/**
 * Données d'exemple pour démonstration
 * Projet de hangar métallique à Nouakchott
 */

import { ProjectData, TableRow, DevisRow } from '../types';
import { createInitialProjectData } from './initialData';
import { generateId } from '../utils/formatters';

/**
 * Crée un projet exemple complet
 */
export function createSampleProject(): ProjectData {
  const project = createInitialProjectData();

  // Informations du projet
  project.info = {
    nom: 'Hangar métallique industriel - Zone industrielle Nouakchott',
    client: 'SNIM - Société Nationale Industrielle et Minière',
    lieu: 'Zone industrielle, Nouakchott, Mauritanie',
    dateDebut: '2024-11-01',
    dateFin: '2025-03-31',
    reference: 'PRJ-2024-NKC-001',
    description: 'Construction d\'un hangar métallique de 1200 m² pour stockage de matériel industriel. Structure en acier avec couverture en bac acier. Hauteur sous toiture : 8m. Fondations en béton armé avec semelles isolées.',
  };

  // Remplir les tables techniques avec des données
  project.tables.forEach(table => {
    switch (table.title) {
      case 'Béton de propreté':
        table.rows = [
          {
            id: generateId(),
            designation: 'Béton de propreté sous semelles',
            epaisseur: 10,
            surface: 120,
            volume: 0, // Sera calculé
          },
        ] as TableRow[];
        break;

      case 'Semelles isolées':
        table.rows = [
          {
            id: generateId(),
            designation: 'Semelles poteaux principaux',
            longueur: 150,
            largeur: 150,
            hauteur: 60,
            nombre: 24,
            volume: 0,
          },
          {
            id: generateId(),
            designation: 'Semelles poteaux secondaires',
            longueur: 120,
            largeur: 120,
            hauteur: 50,
            nombre: 12,
            volume: 0,
          },
        ] as TableRow[];
        break;

      case 'Ferraillage':
        table.rows = [
          {
            id: generateId(),
            designation: 'Armatures longitudinales HA16',
            diametre: 16,
            longueur: 8,
            nombre: 96,
            ratio: 120,
          },
          {
            id: generateId(),
            designation: 'Cadres HA10',
            diametre: 10,
            longueur: 1.2,
            nombre: 360,
            ratio: 120,
          },
          {
            id: generateId(),
            designation: 'Treillis soudé ST25',
            diametre: 6,
            longueur: 120,
            nombre: 1,
            ratio: 100,
          },
        ] as TableRow[];
        break;

      case 'Poteaux métalliques':
        table.rows = [
          {
            id: generateId(),
            designation: 'Poteaux principaux HEB 300',
            profil: 'HEB 300',
            hauteur: 8,
            nombre: 24,
            masse_lineaire: 117,
            masse_totale: 0,
          },
          {
            id: generateId(),
            designation: 'Poteaux secondaires HEB 200',
            profil: 'HEB 200',
            hauteur: 8,
            nombre: 12,
            masse_lineaire: 61.3,
            masse_totale: 0,
          },
        ] as TableRow[];
        break;

      case 'Poutres métalliques':
        table.rows = [
          {
            id: generateId(),
            designation: 'Fermes principales IPE 400',
            profil: 'IPE 400',
            portee: 30,
            nombre: 8,
            masse_lineaire: 66.3,
            masse_totale: 0,
          },
          {
            id: generateId(),
            designation: 'Pannes IPE 160',
            profil: 'IPE 160',
            portee: 6,
            nombre: 40,
            masse_lineaire: 15.8,
            masse_totale: 0,
          },
          {
            id: generateId(),
            designation: 'Traverses HEA 180',
            profil: 'HEA 180',
            portee: 8,
            nombre: 16,
            masse_lineaire: 35.5,
            masse_totale: 0,
          },
        ] as TableRow[];
        break;

      case 'Planchers':
        table.rows = [
          {
            id: generateId(),
            designation: 'Dalle béton rez-de-chaussée',
            type: 'Dalle béton',
            surface: 1200,
            epaisseur: 15,
            volume: 0,
          },
        ] as TableRow[];
        break;

      case 'Couverture toiture':
        table.rows = [
          {
            id: generateId(),
            designation: 'Bac acier laqué RAL 9006',
            type: 'Bac acier',
            surface: 1300,
            pente: 15,
          },
          {
            id: generateId(),
            designation: 'Isolation thermique 100mm',
            type: 'Membrane',
            surface: 1300,
            pente: 0,
          },
        ] as TableRow[];
        break;
    }
  });

  // Remplir les sections de devis
  project.devisSections = [
    {
      id: generateId(),
      category: 'fondations',
      title: 'BÉTON',
      rows: [
        {
          id: generateId(),
          designation: 'Béton de propreté dosé à 150 kg/m³',
          unite: 'm³',
          quantite: 12,
          prixUnitaire: 35000,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Béton armé dosé à 350 kg/m³ (semelles)',
          unite: 'm³',
          quantite: 40,
          prixUnitaire: 125000,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Dalle béton armé 15cm',
          unite: 'm³',
          quantite: 180,
          prixUnitaire: 120000,
          montantTotal: 0,
        },
      ] as DevisRow[],
      totalSection: 0,
    },
    {
      id: generateId(),
      category: 'fondations',
      title: 'FERRAILLAGE',
      rows: [
        {
          id: generateId(),
          designation: 'Acier HA haute adhérence FeE500',
          unite: 'kg',
          quantite: 8500,
          prixUnitaire: 850,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Treillis soudé pour dalle',
          unite: 'm²',
          quantite: 1200,
          prixUnitaire: 2500,
          montantTotal: 0,
        },
      ] as DevisRow[],
      totalSection: 0,
    },
    {
      id: generateId(),
      category: 'superstructure',
      title: 'STRUCTURE MÉTALLIQUE',
      rows: [
        {
          id: generateId(),
          designation: 'Poteaux acier HEB galvanisé',
          unite: 'kg',
          quantite: 28000,
          prixUnitaire: 1200,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Poutres et fermes IPE',
          unite: 'kg',
          quantite: 21000,
          prixUnitaire: 1150,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Platines et boulonnerie HR',
          unite: 'ens',
          quantite: 36,
          prixUnitaire: 45000,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Montage et assemblage structure',
          unite: 'forfait',
          quantite: 1,
          prixUnitaire: 8500000,
          montantTotal: 0,
        },
      ] as DevisRow[],
      totalSection: 0,
    },
    {
      id: generateId(),
      category: 'toiture',
      title: 'TOITURE & COUVERTURE',
      rows: [
        {
          id: generateId(),
          designation: 'Bac acier laqué nervuré e=0.75mm',
          unite: 'm²',
          quantite: 1300,
          prixUnitaire: 12500,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Isolation thermique laine de verre 100mm',
          unite: 'm²',
          quantite: 1300,
          prixUnitaire: 4500,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Faîtage et accessoires',
          unite: 'ml',
          quantite: 45,
          prixUnitaire: 8500,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Gouttières et descentes EP',
          unite: 'ml',
          quantite: 120,
          prixUnitaire: 6500,
          montantTotal: 0,
        },
      ] as DevisRow[],
      totalSection: 0,
    },
    {
      id: generateId(),
      category: 'facades-cloisons',
      title: 'FACADES & BARDAGE',
      rows: [
        {
          id: generateId(),
          designation: 'Bardage métallique simple peau',
          unite: 'm²',
          quantite: 800,
          prixUnitaire: 15000,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Portail coulissant motorisé 6m',
          unite: 'ens',
          quantite: 1,
          prixUnitaire: 1850000,
          montantTotal: 0,
        },
        {
          id: generateId(),
          designation: 'Portes piétonnes métalliques',
          unite: 'u',
          quantite: 2,
          prixUnitaire: 125000,
          montantTotal: 0,
        },
      ] as DevisRow[],
      totalSection: 0,
    },
  ];

  // Recalculer les montants totaux
  project.devisSections.forEach(section => {
    section.rows.forEach(row => {
      row.montantTotal = row.quantite * row.prixUnitaire;
    });
    section.totalSection = section.rows.reduce((sum, row) => sum + row.montantTotal, 0);
  });

  return project;
}

/**
 * Charge les données d'exemple dans le projet
 */
export function loadSampleData(): void {
  const sampleProject = createSampleProject();
  localStorage.setItem('civil360-etude-quantitative', JSON.stringify(sampleProject));
}

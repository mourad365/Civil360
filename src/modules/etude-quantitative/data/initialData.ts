/**
 * Données initiales pour le module d'étude quantitative
 */

import {
  ProjectData,
  ProjectInfo,
  TableDefinition,
  DevisSection,
  ProjectSummary,
  ProjectCategory,
} from '../types';
import { generateId } from '../utils/formatters';

/**
 * Informations initiales du projet
 */
export const initialProjectInfo: ProjectInfo = {
  nom: 'Nouveau Projet',
  client: '',
  lieu: 'Nouakchott, Mauritanie',
  dateDebut: new Date().toISOString().split('T')[0],
  dateFin: '',
  reference: 'PRJ-2024-001',
  description: 'Projet de structure métallique',
};

/**
 * Récapitulatif initial
 */
export const initialSummary: ProjectSummary = {
  surfaceTotale: 0,
  volumeBetonTotal: 0,
  quantiteAcierEstimee: 0,
  nombreElementsStructurels: 0,
  coutTotalProjet: 0,
  nombreLignesDevis: 0,
};

/**
 * Table de béton de propreté (Fondations)
 */
export function createBetonPropreteTable(): TableDefinition {
  return {
    id: generateId(),
    title: 'Béton de propreté',
    category: 'fondations',
    columns: [
      { key: 'designation', label: 'Désignation', type: 'text', editable: true },
      { key: 'epaisseur', label: 'Épaisseur', type: 'number', unit: 'cm', editable: true },
      { key: 'surface', label: 'Surface', type: 'number', unit: 'm²', editable: true },
      { key: 'volume', label: 'Volume', type: 'calculated', unit: 'm³', formula: '(epaisseur / 100) * surface' },
    ],
    rows: [],
  };
}

/**
 * Table de semelles isolées (Fondations)
 */
export function createSemellesIsoleesTable(): TableDefinition {
  return {
    id: generateId(),
    title: 'Semelles isolées',
    category: 'fondations',
    columns: [
      { key: 'designation', label: 'Désignation', type: 'text', editable: true },
      { key: 'longueur', label: 'Longueur', type: 'number', unit: 'cm', editable: true },
      { key: 'largeur', label: 'Largeur', type: 'number', unit: 'cm', editable: true },
      { key: 'hauteur', label: 'Hauteur', type: 'number', unit: 'cm', editable: true },
      { key: 'nombre', label: 'Nombre', type: 'number', editable: true },
      { key: 'volume', label: 'Volume', type: 'calculated', unit: 'm³', formula: '(longueur / 100) * (largeur / 100) * (hauteur / 100) * nombre' },
    ],
    rows: [],
  };
}

/**
 * Table de ferraillage (Fondations)
 */
export function createFerraillageTable(): TableDefinition {
  return {
    id: generateId(),
    title: 'Ferraillage',
    category: 'fondations',
    columns: [
      { key: 'designation', label: 'Désignation', type: 'text', editable: true },
      { key: 'diametre', label: 'Diamètre', type: 'number', unit: 'mm', editable: true },
      { key: 'longueur', label: 'Longueur', type: 'number', unit: 'm', editable: true },
      { key: 'nombre', label: 'Nombre', type: 'number', editable: true },
      { key: 'ratio', label: 'Ratio', type: 'number', unit: 'kg/m³', editable: true },
    ],
    rows: [],
  };
}

/**
 * Table de poteaux métalliques (Superstructure)
 */
export function createPoteauxMetalliquesTable(): TableDefinition {
  return {
    id: generateId(),
    title: 'Poteaux métalliques',
    category: 'superstructure',
    columns: [
      { key: 'designation', label: 'Désignation', type: 'text', editable: true },
      { key: 'profil', label: 'Profil', type: 'text', editable: true },
      { key: 'hauteur', label: 'Hauteur', type: 'number', unit: 'm', editable: true },
      { key: 'nombre', label: 'Nombre', type: 'number', editable: true },
      { key: 'masse_lineaire', label: 'Masse linéaire', type: 'number', unit: 'kg/m', editable: true },
      { key: 'masse_totale', label: 'Masse totale', type: 'calculated', unit: 'kg', formula: 'hauteur * nombre * masse_lineaire' },
    ],
    rows: [],
  };
}

/**
 * Table de poutres métalliques (Superstructure)
 */
export function createPoutresMetalliquesTable(): TableDefinition {
  return {
    id: generateId(),
    title: 'Poutres métalliques',
    category: 'superstructure',
    columns: [
      { key: 'designation', label: 'Désignation', type: 'text', editable: true },
      { key: 'profil', label: 'Profil', type: 'text', editable: true },
      { key: 'portee', label: 'Portée', type: 'number', unit: 'm', editable: true },
      { key: 'nombre', label: 'Nombre', type: 'number', editable: true },
      { key: 'masse_lineaire', label: 'Masse linéaire', type: 'number', unit: 'kg/m', editable: true },
      { key: 'masse_totale', label: 'Masse totale', type: 'calculated', unit: 'kg', formula: 'portee * nombre * masse_lineaire' },
    ],
    rows: [],
  };
}

/**
 * Table de planchers (Planchers)
 */
export function createPlanchersTable(): TableDefinition {
  return {
    id: generateId(),
    title: 'Planchers',
    category: 'planchers',
    columns: [
      { key: 'designation', label: 'Désignation', type: 'text', editable: true },
      { key: 'type', label: 'Type', type: 'select', options: ['Dalle béton', 'Bac acier', 'Plancher collaborant', 'Plancher bois'], editable: true },
      { key: 'surface', label: 'Surface', type: 'number', unit: 'm²', editable: true },
      { key: 'epaisseur', label: 'Épaisseur', type: 'number', unit: 'cm', editable: true },
      { key: 'volume', label: 'Volume', type: 'calculated', unit: 'm³', formula: '(epaisseur / 100) * surface' },
    ],
    rows: [],
  };
}

/**
 * Table de toiture (Toiture)
 */
export function createToitureTable(): TableDefinition {
  return {
    id: generateId(),
    title: 'Couverture toiture',
    category: 'toiture',
    columns: [
      { key: 'designation', label: 'Désignation', type: 'text', editable: true },
      { key: 'type', label: 'Type', type: 'select', options: ['Bac acier', 'Tuiles', 'Membrane', 'Shingle'], editable: true },
      { key: 'surface', label: 'Surface', type: 'number', unit: 'm²', editable: true },
      { key: 'pente', label: 'Pente', type: 'number', unit: '%', editable: true },
    ],
    rows: [],
  };
}

/**
 * Sections de devis initiales
 */
export function createInitialDevisSections(): DevisSection[] {
  return [
    {
      id: generateId(),
      category: 'fondations',
      title: 'BÉTON',
      rows: [],
      totalSection: 0,
    },
    {
      id: generateId(),
      category: 'fondations',
      title: 'FERRAILLAGE',
      rows: [],
      totalSection: 0,
    },
    {
      id: generateId(),
      category: 'superstructure',
      title: 'STRUCTURE MÉTALLIQUE',
      rows: [],
      totalSection: 0,
    },
    {
      id: generateId(),
      category: 'planchers',
      title: 'PLANCHERS',
      rows: [],
      totalSection: 0,
    },
    {
      id: generateId(),
      category: 'toiture',
      title: 'TOITURE & COUVERTURE',
      rows: [],
      totalSection: 0,
    },
  ];
}

/**
 * Tables techniques initiales par catégorie
 */
export function createInitialTables(): TableDefinition[] {
  return [
    // Fondations
    createBetonPropreteTable(),
    createSemellesIsoleesTable(),
    createFerraillageTable(),
    
    // Superstructure
    createPoteauxMetalliquesTable(),
    createPoutresMetalliquesTable(),
    
    // Planchers
    createPlanchersTable(),
    
    // Toiture
    createToitureTable(),
  ];
}

/**
 * Projet initial complet
 */
export function createInitialProjectData(): ProjectData {
  return {
    id: generateId(),
    info: initialProjectInfo,
    tables: createInitialTables(),
    devisSections: createInitialDevisSections(),
    summary: initialSummary,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Labels des catégories
 */
export const categoryLabels: Record<ProjectCategory, string> = {
  'informations-generales': 'Informations générales',
  'fondations': 'Fondations',
  'superstructure': 'Superstructure',
  'planchers': 'Planchers',
  'facades-cloisons': 'Façades & Cloisons',
  'toiture': 'Toiture',
  'second-oeuvre': 'Second œuvre',
  'amenagements-exterieurs': 'Aménagements extérieurs',
};

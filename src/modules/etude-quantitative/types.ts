/**
 * Types pour le module d'étude quantitative et devis estimatif
 * Projet de construction métallique - Civil360
 */

// Types de base pour les lignes de tableau
export interface TableRow {
  id: string;
  [key: string]: string | number | boolean | null;
}

// Structure d'une colonne de tableau
export interface ColumnDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'calculated';
  unit?: string;
  editable?: boolean;
  formula?: string; // Formule pour colonnes calculées
  options?: string[]; // Options pour select
  width?: string;
}

// Structure d'une table
export interface TableDefinition {
  id: string;
  title: string;
  columns: ColumnDefinition[];
  rows: TableRow[];
  category: ProjectCategory;
}

// Catégories du projet
export type ProjectCategory = 
  | 'informations-generales'
  | 'fondations'
  | 'superstructure'
  | 'planchers'
  | 'facades-cloisons'
  | 'toiture'
  | 'second-oeuvre'
  | 'amenagements-exterieurs';

// Informations générales du projet
export interface ProjectInfo {
  nom: string;
  client: string;
  lieu: string;
  dateDebut: string;
  dateFin: string;
  reference: string;
  description: string;
}

// Ligne de devis
export interface DevisRow extends TableRow {
  designation: string;
  unite: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
}

// Structure d'une section de devis
export interface DevisSection {
  id: string;
  category: ProjectCategory;
  title: string;
  rows: DevisRow[];
  totalSection: number;
}

// Récapitulatif du projet
export interface ProjectSummary {
  surfaceTotale: number; // m²
  volumeBetonTotal: number; // m³
  quantiteAcierEstimee: number; // kg
  nombreElementsStructurels: number;
  coutTotalProjet: number; // currency
  nombreLignesDevis: number;
}

// Données complètes du projet
export interface ProjectData {
  id: string;
  info: ProjectInfo;
  tables: TableDefinition[];
  devisSections: DevisSection[];
  summary: ProjectSummary;
  createdAt: string;
  updatedAt: string;
}

// Configuration des formules de calcul
export interface CalculationFormula {
  id: string;
  name: string;
  formula: string;
  description: string;
  variables: string[];
}

// Types pour les exports
export interface ExportOptions {
  format: 'json' | 'excel' | 'pdf';
  includeSummary?: boolean;
  includeCalculations?: boolean;
}

// Notification système
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// État de l'application
export interface AppState {
  currentProject: ProjectData | null;
  isLoading: boolean;
  isSaving: boolean;
  notifications: Notification[];
  activeTab: ProjectCategory;
}

/**
 * Point d'entrée du module d'étude quantitative
 * Exports publics
 */

// Composant principal
export { default as EtudeQuantitative } from './EtudeQuantitative';

// Composants réutilisables
export { TableEditable } from './components/TableEditable';
export { SummaryCard } from './components/SummaryCard';
export { FileActions } from './components/FileActions';

// Hooks
export { useLocalStorage, useAutoSave } from './hooks/useLocalStorage';

// Types
export type {
  ProjectData,
  ProjectInfo,
  ProjectCategory,
  ProjectSummary,
  TableDefinition,
  TableRow,
  ColumnDefinition,
  DevisSection,
  DevisRow,
} from './types';

// Utilitaires
export * from './utils/calculations';
export * from './utils/formatters';
export * from './utils/excelAdapter';

// Données initiales
export * from './data/initialData';

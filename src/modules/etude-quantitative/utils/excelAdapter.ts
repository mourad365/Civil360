/**
 * Adaptateur pour l'import/export de données Excel
 * Utilise la bibliothèque xlsx
 */

import * as XLSX from 'xlsx';
import { ProjectData, DevisSection, TableDefinition, DevisRow } from '../types';
import { formatDate, formatFileName } from './formatters';

/**
 * Exporte les données du projet vers un fichier Excel
 * @param projectData Données du projet
 * @param fileName Nom du fichier (optionnel)
 */
export function exportToExcel(projectData: ProjectData, fileName?: string): void {
  try {
    // Créer un nouveau classeur
    const workbook = XLSX.utils.book_new();

    // Feuille 1: Informations générales
    const infoSheet = createInfoSheet(projectData);
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Informations');

    // Feuille 2: Récapitulatif
    const summarySheet = createSummarySheet(projectData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Récapitulatif');

    // Feuille 3: Devis estimatif
    const devisSheet = createDevisSheet(projectData.devisSections);
    XLSX.utils.book_append_sheet(workbook, devisSheet, 'Devis Estimatif');

    // Feuilles supplémentaires: Tables techniques par catégorie
    const categoriesMap = groupTablesByCategory(projectData.tables);
    Object.entries(categoriesMap).forEach(([category, tables]) => {
      const categorySheet = createCategorySheet(tables);
      const sheetName = sanitizeSheetName(category);
      XLSX.utils.book_append_sheet(workbook, categorySheet, sheetName);
    });

    // Générer le fichier
    const finalFileName = fileName || formatFileName(projectData.info.nom, 'xlsx');
    XLSX.writeFile(workbook, finalFileName);

    console.log('Export Excel réussi:', finalFileName);
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error);
    throw new Error('Échec de l\'export Excel');
  }
}

/**
 * Crée la feuille d'informations générales
 */
function createInfoSheet(projectData: ProjectData): XLSX.WorkSheet {
  const data = [
    ['FICHE TECHNIQUE PROJET - STRUCTURE MÉTALLIQUE'],
    [''],
    ['Nom du projet', projectData.info.nom],
    ['Client', projectData.info.client],
    ['Lieu', projectData.info.lieu],
    ['Date de début', formatDate(projectData.info.dateDebut)],
    ['Date de fin', formatDate(projectData.info.dateFin)],
    ['Référence', projectData.info.reference],
    ['Description', projectData.info.description],
    [''],
    ['Créé le', formatDate(projectData.createdAt)],
    ['Mis à jour le', formatDate(projectData.updatedAt)],
  ];

  return XLSX.utils.aoa_to_sheet(data);
}

/**
 * Crée la feuille de récapitulatif
 */
function createSummarySheet(projectData: ProjectData): XLSX.WorkSheet {
  const data = [
    ['RÉCAPITULATIF DU PROJET'],
    [''],
    ['Indicateur', 'Valeur', 'Unité'],
    ['Surface totale', projectData.summary.surfaceTotale, 'm²'],
    ['Volume béton total', projectData.summary.volumeBetonTotal, 'm³'],
    ['Quantité acier estimée', projectData.summary.quantiteAcierEstimee, 'kg'],
    ['Nombre d\'éléments structurels', projectData.summary.nombreElementsStructurels, 'unités'],
    ['Nombre de lignes de devis', projectData.summary.nombreLignesDevis, 'lignes'],
    ['Coût total du projet', projectData.summary.coutTotalProjet, 'MRU'],
  ];

  return XLSX.utils.aoa_to_sheet(data);
}

/**
 * Crée la feuille de devis estimatif
 */
function createDevisSheet(devisSections: DevisSection[]): XLSX.WorkSheet {
  const data: any[][] = [
    ['DEVIS ESTIMATIF'],
    [''],
  ];

  devisSections.forEach(section => {
    // En-tête de section
    data.push([section.title.toUpperCase()]);
    data.push(['Désignation', 'Unité', 'Quantité', 'Prix Unitaire', 'Montant Total']);

    // Lignes de la section
    section.rows.forEach(row => {
      data.push([
        row.designation,
        row.unite,
        row.quantite,
        row.prixUnitaire,
        row.montantTotal,
      ]);
    });

    // Total de la section
    data.push(['', '', '', 'TOTAL SECTION', section.totalSection]);
    data.push(['']);
  });

  // Total général
  const totalGeneral = devisSections.reduce((sum, s) => sum + s.totalSection, 0);
  data.push(['', '', '', 'TOTAL GÉNÉRAL', totalGeneral]);

  return XLSX.utils.aoa_to_sheet(data);
}

/**
 * Crée une feuille pour une catégorie de tables
 */
function createCategorySheet(tables: TableDefinition[]): XLSX.WorkSheet {
  const data: any[][] = [];

  tables.forEach((table, index) => {
    if (index > 0) data.push(['']); // Séparateur entre tables

    // Titre de la table
    data.push([table.title.toUpperCase()]);

    // En-têtes des colonnes
    const headers = table.columns.map(col => `${col.label}${col.unit ? ` (${col.unit})` : ''}`);
    data.push(headers);

    // Lignes de données
    table.rows.forEach(row => {
      const rowData = table.columns.map(col => row[col.key] ?? '');
      data.push(rowData);
    });
  });

  return XLSX.utils.aoa_to_sheet(data);
}

/**
 * Importe des données depuis un fichier Excel
 * @param file Fichier Excel à importer
 * @returns Données du projet parsées
 */
export async function importFromExcel(file: File): Promise<Partial<ProjectData>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const projectData: Partial<ProjectData> = {
          devisSections: [],
          tables: [],
        };

        // Parser les différentes feuilles
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];

          if (sheetName === 'Devis Estimatif') {
            projectData.devisSections = parseDevisSheet(sheet);
          }
          // Ajouter d'autres parsers selon les besoins
        });

        resolve(projectData);
      } catch (error) {
        console.error('Erreur lors de l\'import Excel:', error);
        reject(new Error('Échec de l\'import Excel'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur de lecture du fichier'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Parse une feuille de devis
 */
function parseDevisSheet(sheet: XLSX.WorkSheet): DevisSection[] {
  const data = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });
  const sections: DevisSection[] = [];
  let currentSection: DevisSection | null = null;

  data.forEach((row: any[]) => {
    // Détection d'une nouvelle section (ligne avec un seul élément en majuscules)
    if (row.length === 1 && typeof row[0] === 'string' && row[0] === row[0].toUpperCase()) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        id: `section-${sections.length}`,
        category: 'fondations', // À déterminer dynamiquement
        title: row[0],
        rows: [],
        totalSection: 0,
      };
    }
    // Ligne de données (5 colonnes: désignation, unité, quantité, prix unitaire, montant)
    else if (row.length >= 5 && currentSection && typeof row[0] === 'string' && row[0] !== 'Désignation') {
      const devisRow: DevisRow = {
        id: `row-${currentSection.rows.length}`,
        designation: String(row[0]),
        unite: String(row[1]),
        quantite: Number(row[2]) || 0,
        prixUnitaire: Number(row[3]) || 0,
        montantTotal: Number(row[4]) || 0,
      };
      currentSection.rows.push(devisRow);
      currentSection.totalSection += devisRow.montantTotal;
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Groupe les tables par catégorie
 */
function groupTablesByCategory(tables: TableDefinition[]): Record<string, TableDefinition[]> {
  return tables.reduce((acc, table) => {
    if (!acc[table.category]) {
      acc[table.category] = [];
    }
    acc[table.category].push(table);
    return acc;
  }, {} as Record<string, TableDefinition[]>);
}

/**
 * Nettoie un nom de feuille Excel (31 caractères max, pas de caractères spéciaux)
 */
function sanitizeSheetName(name: string): string {
  return name
    .replace(/[:\\\/\?\*\[\]]/g, '')
    .substring(0, 31);
}

/**
 * Exporte uniquement le devis en Excel
 * @param devisSections Sections de devis
 * @param fileName Nom du fichier
 */
export function exportDevisToExcel(devisSections: DevisSection[], fileName?: string): void {
  try {
    const workbook = XLSX.utils.book_new();
    const sheet = createDevisSheet(devisSections);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Devis Estimatif');

    const finalFileName = fileName || formatFileName('devis-estimatif', 'xlsx');
    XLSX.writeFile(workbook, finalFileName);

    console.log('Export devis Excel réussi:', finalFileName);
  } catch (error) {
    console.error('Erreur lors de l\'export du devis:', error);
    throw new Error('Échec de l\'export du devis');
  }
}

/**
 * Crée un template Excel vierge pour la saisie
 * @param fileName Nom du fichier
 */
export function createExcelTemplate(fileName?: string): void {
  const workbook = XLSX.utils.book_new();

  // Template de devis
  const devisTemplate = [
    ['DEVIS ESTIMATIF - TEMPLATE'],
    [''],
    ['BÉTON'],
    ['Désignation', 'Unité', 'Quantité', 'Prix Unitaire', 'Montant Total'],
    ['Béton de propreté', 'm³', 0, 0, 0],
    ['Semelles isolées', 'm³', 0, 0, 0],
    [''],
    ['FERRAILLAGE'],
    ['Désignation', 'Unité', 'Quantité', 'Prix Unitaire', 'Montant Total'],
    ['Armatures longitudinales', 'kg', 0, 0, 0],
    ['Armatures transversales', 'kg', 0, 0, 0],
  ];

  const sheet = XLSX.utils.aoa_to_sheet(devisTemplate);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Template Devis');

  const finalFileName = fileName || 'template-devis-estimatif.xlsx';
  XLSX.writeFile(workbook, finalFileName);
}

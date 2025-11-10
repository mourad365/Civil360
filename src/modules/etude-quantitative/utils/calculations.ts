/**
 * Utilitaires de calcul pour les projets de construction métallique
 * Formules physiques et économiques
 */

import { TableRow, DevisRow, ProjectSummary } from '../types';

/**
 * Calcule le volume de béton de propreté
 * @param epaisseur_cm Épaisseur en cm
 * @param surface Surface en m²
 * @returns Volume en m³
 */
export function calculerBetonProprete(epaisseur_cm: number, surface: number): number {
  return (epaisseur_cm / 100) * surface;
}

/**
 * Calcule le volume de semelles isolées
 * @param longueur_cm Longueur en cm
 * @param largeur_cm Largeur en cm
 * @param hauteur_cm Hauteur en cm
 * @param nombre Nombre de semelles
 * @returns Volume en m³
 */
export function calculerSemellesIsolees(
  longueur_cm: number,
  largeur_cm: number,
  hauteur_cm: number,
  nombre: number
): number {
  return (longueur_cm / 100) * (largeur_cm / 100) * (hauteur_cm / 100) * nombre;
}

/**
 * Calcule le volume de semelles filantes
 * @param largeur_cm Largeur en cm
 * @param hauteur_cm Hauteur en cm
 * @param longueur_m Longueur en m
 * @returns Volume en m³
 */
export function calculerSemellesFilantes(
  largeur_cm: number,
  hauteur_cm: number,
  longueur_m: number
): number {
  return (largeur_cm / 100) * (hauteur_cm / 100) * longueur_m;
}

/**
 * Calcule le volume de plots béton
 * @param section_cm Section en cm
 * @param hauteur_cm Hauteur en cm
 * @returns Volume en m³
 */
export function calculerPlotsBeton(section_cm: number, hauteur_cm: number): number {
  return (section_cm / 100) * (section_cm / 100) * (hauteur_cm / 100);
}

/**
 * Calcule le volume de longrines
 * @param section_cm Section en cm
 * @param portee_m Portée en m
 * @returns Volume en m³
 */
export function calculerLongrines(section_cm: number, portee_m: number): number {
  return (section_cm / 100) * (section_cm / 100) * portee_m;
}

/**
 * Calcule la surface de platines métalliques
 * @param longueur_mm Longueur en mm
 * @param largeur_mm Largeur en mm
 * @returns Surface en m²
 */
export function calculerSurfacePlatines(longueur_mm: number, largeur_mm: number): number {
  return (longueur_mm * largeur_mm) / 1000000;
}

/**
 * Calcule la masse volumique d'un élément en acier
 * @param volume_m3 Volume en m³
 * @param masse_volumique Masse volumique en kg/m³ (défaut: 7850 kg/m³ pour l'acier)
 * @returns Masse en kg
 */
export function calculerMasseAcier(volume_m3: number, masse_volumique: number = 7850): number {
  return volume_m3 * masse_volumique;
}

/**
 * Calcule la masse volumique du béton armé
 * @param volume_m3 Volume en m³
 * @param masse_volumique Masse volumique en kg/m³ (défaut: 2500 kg/m³ pour le béton armé)
 * @returns Masse en kg
 */
export function calculerMasseBeton(volume_m3: number, masse_volumique: number = 2500): number {
  return volume_m3 * masse_volumique;
}

/**
 * Estime la quantité d'acier pour béton armé
 * @param volume_beton_m3 Volume de béton en m³
 * @param ratio_acier Ratio d'acier kg/m³ (défaut: 120 kg/m³)
 * @returns Quantité d'acier en kg
 */
export function estimerQuantiteAcier(volume_beton_m3: number, ratio_acier: number = 120): number {
  return volume_beton_m3 * ratio_acier;
}

/**
 * Calcule le volume d'un élément de ferraillage
 * @param diametre_mm Diamètre en mm
 * @param longueur_m Longueur en m
 * @param nombre Nombre d'éléments
 * @returns Volume en m³
 */
export function calculerVolumeFerraillage(
  diametre_mm: number,
  longueur_m: number,
  nombre: number
): number {
  const rayon_m = (diametre_mm / 2) / 1000;
  const section_m2 = Math.PI * rayon_m * rayon_m;
  return section_m2 * longueur_m * nombre;
}

/**
 * Calcule la quantité de graviers
 * @param volume_beton_m3 Volume de béton en m³
 * @param ratio Ratio de gravier m³/m³ de béton (défaut: 0.8)
 * @returns Volume de gravier en m³
 */
export function calculerQuantiteGravier(volume_beton_m3: number, ratio: number = 0.8): number {
  return volume_beton_m3 * ratio;
}

/**
 * Calcule la quantité de sable
 * @param volume_beton_m3 Volume de béton en m³
 * @param ratio Ratio de sable m³/m³ de béton (défaut: 0.4)
 * @returns Volume de sable en m³
 */
export function calculerQuantiteSable(volume_beton_m3: number, ratio: number = 0.4): number {
  return volume_beton_m3 * ratio;
}

/**
 * Calcule la quantité de ciment
 * @param volume_beton_m3 Volume de béton en m³
 * @param dosage Dosage en kg/m³ (défaut: 350 kg/m³)
 * @returns Masse de ciment en kg
 */
export function calculerQuantiteCiment(volume_beton_m3: number, dosage: number = 350): number {
  return volume_beton_m3 * dosage;
}

/**
 * Évalue une formule mathématique à partir d'une chaîne
 * @param formula Formule sous forme de chaîne (ex: "(a + b) * c")
 * @param variables Object contenant les valeurs des variables
 * @returns Résultat du calcul
 */
export function evaluerFormule(formula: string, variables: Record<string, number>): number {
  try {
    // Remplacer les variables dans la formule
    let formulaEvaluable = formula;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      formulaEvaluable = formulaEvaluable.replace(regex, String(variables[key]));
    });

    // Évaluer la formule de manière sécurisée
    // Note: Dans un environnement de production, utiliser une bibliothèque comme math.js
    const result = Function(`"use strict"; return (${formulaEvaluable})`)();
    return isNaN(result) ? 0 : Number(result);
  } catch (error) {
    console.error('Erreur lors de l\'évaluation de la formule:', formula, error);
    return 0;
  }
}

/**
 * Calcule le montant total d'une ligne de devis
 * @param quantite Quantité
 * @param prixUnitaire Prix unitaire
 * @returns Montant total
 */
export function calculerMontantTotal(quantite: number, prixUnitaire: number): number {
  return quantite * prixUnitaire;
}

/**
 * Calcule le total d'une section de devis
 * @param rows Lignes de devis
 * @returns Total de la section
 */
export function calculerTotalSection(rows: DevisRow[]): number {
  return rows.reduce((sum, row) => sum + row.montantTotal, 0);
}

/**
 * Calcule le volume total de béton à partir des lignes de tableau
 * @param rows Lignes contenant des colonnes de volume
 * @param volumeColumnKey Clé de la colonne volume (défaut: 'volume')
 * @returns Volume total en m³
 */
export function calculerVolumeTotalBeton(
  rows: TableRow[],
  volumeColumnKey: string = 'volume'
): number {
  return rows.reduce((sum, row) => {
    const volume = Number(row[volumeColumnKey]) || 0;
    return sum + volume;
  }, 0);
}

/**
 * Calcule la surface totale à partir des lignes de tableau
 * @param rows Lignes contenant des colonnes de surface
 * @param surfaceColumnKey Clé de la colonne surface (défaut: 'surface')
 * @returns Surface totale en m²
 */
export function calculerSurfaceTotale(
  rows: TableRow[],
  surfaceColumnKey: string = 'surface'
): number {
  return rows.reduce((sum, row) => {
    const surface = Number(row[surfaceColumnKey]) || 0;
    return sum + surface;
  }, 0);
}

/**
 * Compte le nombre d'éléments structurels
 * @param rows Toutes les lignes des tableaux techniques
 * @returns Nombre total d'éléments
 */
export function compterElementsStructurels(rows: TableRow[]): number {
  return rows.length;
}

/**
 * Calcule le récapitulatif complet du projet
 * @param technicalRows Lignes des tableaux techniques
 * @param devisRows Lignes de devis
 * @returns Récapitulatif du projet
 */
export function calculerRecapitulatifProjet(
  technicalRows: TableRow[],
  devisRows: DevisRow[]
): ProjectSummary {
  const volumeBetonTotal = calculerVolumeTotalBeton(technicalRows);
  const surfaceTotale = calculerSurfaceTotale(technicalRows);
  const quantiteAcierEstimee = estimerQuantiteAcier(volumeBetonTotal);
  const nombreElementsStructurels = compterElementsStructurels(technicalRows);
  const coutTotalProjet = devisRows.reduce((sum, row) => sum + row.montantTotal, 0);

  return {
    surfaceTotale,
    volumeBetonTotal,
    quantiteAcierEstimee,
    nombreElementsStructurels,
    coutTotalProjet,
    nombreLignesDevis: devisRows.length,
  };
}

/**
 * Arrondit un nombre à n décimales
 * @param value Valeur à arrondir
 * @param decimals Nombre de décimales (défaut: 2)
 * @returns Valeur arrondie
 */
export function arrondir(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

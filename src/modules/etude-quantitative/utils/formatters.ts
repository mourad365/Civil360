/**
 * Utilitaires de formatage pour l'affichage des données
 */

/**
 * Formate un nombre avec des séparateurs de milliers
 * @param value Valeur numérique
 * @param decimals Nombre de décimales (défaut: 2)
 * @returns Chaîne formatée
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formate un montant monétaire
 * @param value Valeur numérique
 * @param currency Devise (défaut: 'MRU' pour Ouguiya mauritanien)
 * @returns Chaîne formatée avec symbole monétaire
 */
export function formatCurrency(value: number, currency: string = 'MRU'): string {
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formate une valeur avec son unité
 * @param value Valeur numérique
 * @param unit Unité (ex: 'm²', 'm³', 'kg', 'ml')
 * @param decimals Nombre de décimales (défaut: 2)
 * @returns Chaîne formatée avec unité
 */
export function formatWithUnit(value: number, unit: string, decimals: number = 2): string {
  return `${formatNumber(value, decimals)} ${unit}`;
}

/**
 * Formate une date au format français
 * @param date Date à formater
 * @returns Date au format jj/mm/aaaa
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR');
}

/**
 * Formate une date avec l'heure
 * @param date Date à formater
 * @returns Date et heure au format français
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('fr-FR');
}

/**
 * Formate un pourcentage
 * @param value Valeur décimale (ex: 0.15 pour 15%)
 * @param decimals Nombre de décimales (défaut: 1)
 * @returns Pourcentage formaté
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${formatNumber(value * 100, decimals)} %`;
}

/**
 * Tronque un texte long avec des points de suspension
 * @param text Texte à tronquer
 * @param maxLength Longueur maximale (défaut: 50)
 * @returns Texte tronqué
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalise la première lettre d'une chaîne
 * @param text Texte à capitaliser
 * @returns Texte capitalisé
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convertit un slug en titre lisible
 * @param slug Slug (ex: 'facades-cloisons')
 * @returns Titre lisible (ex: 'Façades Cloisons')
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => capitalize(word))
    .join(' ')
    .replace('Oe', 'Œ');
}

/**
 * Formate une clé en label lisible
 * @param key Clé (ex: 'volumeBetonTotal')
 * @returns Label lisible (ex: 'Volume Béton Total')
 */
export function keyToLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Génère un identifiant unique
 * @returns ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formate un numéro de référence de projet
 * @param prefix Préfixe (ex: 'PRJ')
 * @param number Numéro séquentiel
 * @param year Année (optionnel)
 * @returns Référence formatée (ex: 'PRJ-2024-001')
 */
export function formatProjectReference(prefix: string, number: number, year?: number): string {
  const yearPart = year ? `-${year}` : '';
  const numberPart = String(number).padStart(3, '0');
  return `${prefix}${yearPart}-${numberPart}`;
}

/**
 * Valide et nettoie une valeur numérique
 * @param value Valeur à nettoyer
 * @returns Nombre valide ou 0
 */
export function cleanNumber(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Formate un nom de fichier sécurisé
 * @param name Nom original
 * @param extension Extension (optionnel)
 * @returns Nom de fichier sécurisé
 */
export function formatFileName(name: string, extension?: string): string {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const timestamp = new Date().toISOString().split('T')[0];
  const ext = extension ? `.${extension}` : '';
  
  return `${cleaned}-${timestamp}${ext}`;
}

/**
 * Convertit une chaîne en nombre sécurisé
 * @param value Valeur à convertir
 * @param defaultValue Valeur par défaut si conversion échoue
 * @returns Nombre ou valeur par défaut
 */
export function safeParseNumber(value: any, defaultValue: number = 0): number {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value).replace(',', '.'));
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Formate une taille de fichier
 * @param bytes Taille en octets
 * @returns Taille formatée (ex: '1.5 MB')
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Génère une couleur aléatoire pour les graphiques
 * @param index Index pour générer une couleur cohérente
 * @returns Couleur en format hexadécimal
 */
export function generateChartColor(index: number): string {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
  ];
  return colors[index % colors.length];
}

import { addDays, format, parseISO, differenceInDays, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';

// Construction-specific utility functions

/**
 * Calculate construction project progress percentage
 */
export function calculateProjectProgress(
  startDate: string | Date,
  endDate: string | Date,
  currentDate: Date = new Date()
): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (currentDate < start) return 0;
  if (currentDate > end) return 100;
  
  const totalDays = differenceInDays(end, start);
  const elapsedDays = differenceInDays(currentDate, start);
  
  return Math.round((elapsedDays / totalDays) * 100);
}

/**
 * Calculate working days between two dates (excluding weekends and holidays)
 */
export function calculateWorkingDays(
  startDate: string | Date,
  endDate: string | Date,
  holidays: Date[] = []
): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  let workingDays = 0;
  let currentDate = start;
  
  while (currentDate <= end) {
    if (!isWeekend(currentDate) && !holidays.some(holiday => 
      holiday.toDateString() === currentDate.toDateString()
    )) {
      workingDays++;
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return workingDays;
}

/**
 * Format construction dates in French locale
 */
export function formatConstructionDate(
  date: string | Date,
  formatString: string = 'dd/MM/yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: fr });
}

/**
 * Calculate concrete volume from dimensions
 */
export function calculateConcreteVolume(
  length: number,
  width: number,
  height: number,
  unit: 'cm' | 'm' = 'm'
): number {
  const multiplier = unit === 'cm' ? 0.000001 : 1; // Convert cm³ to m³
  return length * width * height * multiplier;
}

/**
 * Calculate steel reinforcement weight
 */
export function calculateSteelWeight(
  diameter: number, // in mm
  length: number, // in meters
  density: number = 7.85 // kg/m³ for steel
): number {
  const radius = diameter / 2000; // Convert mm to meters
  const area = Math.PI * radius * radius;
  return area * length * density * 1000; // Convert to kg
}

/**
 * Calculate formwork area for different shapes
 */
export function calculateFormworkArea(
  shape: 'rectangle' | 'circle' | 'complex',
  dimensions: { [key: string]: number }
): number {
  switch (shape) {
    case 'rectangle':
      return (dimensions.length || 0) * (dimensions.width || 0);
    case 'circle':
      return Math.PI * Math.pow(dimensions.radius || 0, 2);
    case 'complex':
      // For complex shapes, sum all provided areas
      return Object.values(dimensions).reduce((sum, value) => sum + value, 0);
    default:
      return 0;
  }
}

/**
 * Estimate construction cost based on material quantities
 */
export interface MaterialCosts {
  concrete: number; // €/m³
  steel: number; // €/kg
  formwork: number; // €/m²
  labor: number; // €/hour
}

export function estimateConstructionCost(
  quantities: {
    concrete?: number; // m³
    steel?: number; // kg
    formwork?: number; // m²
    laborHours?: number;
  },
  costs: MaterialCosts
): number {
  let totalCost = 0;
  
  if (quantities.concrete) totalCost += quantities.concrete * costs.concrete;
  if (quantities.steel) totalCost += quantities.steel * costs.steel;
  if (quantities.formwork) totalCost += quantities.formwork * costs.formwork;
  if (quantities.laborHours) totalCost += quantities.laborHours * costs.labor;
  
  return Math.round(totalCost * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate equipment utilization percentage
 */
export function calculateEquipmentUtilization(
  activeHours: number,
  totalAvailableHours: number
): number {
  if (totalAvailableHours === 0) return 0;
  return Math.round((activeHours / totalAvailableHours) * 100);
}

/**
 * Predict project delay based on current progress
 */
export function predictProjectDelay(
  plannedProgress: number,
  actualProgress: number,
  remainingDays: number
): {
  delayDays: number;
  delayPercentage: number;
  isOnTime: boolean;
} {
  if (actualProgress >= plannedProgress) {
    return { delayDays: 0, delayPercentage: 0, isOnTime: true };
  }
  
  const progressGap = plannedProgress - actualProgress;
  const estimatedDelayDays = Math.round((progressGap / 100) * remainingDays);
  const delayPercentage = Math.round((estimatedDelayDays / remainingDays) * 100);
  
  return {
    delayDays: estimatedDelayDays,
    delayPercentage,
    isOnTime: false
  };
}

/**
 * Calculate safety score based on incidents and inspections
 */
export function calculateSafetyScore(
  totalInspections: number,
  passedInspections: number,
  incidents: number,
  daysWithoutIncident: number
): number {
  if (totalInspections === 0) return 0;
  
  const inspectionScore = (passedInspections / totalInspections) * 60; // 60% weight
  const incidentPenalty = Math.min(incidents * 5, 30); // Max 30% penalty
  const safetyBonus = Math.min(daysWithoutIncident * 0.5, 10); // Max 10% bonus
  
  return Math.max(0, Math.min(100, inspectionScore - incidentPenalty + safetyBonus));
}

/**
 * Format large numbers for construction context (K, M notation)
 */
export function formatConstructionNumber(
  value: number,
  unit: string = '€'
): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M${unit}`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K${unit}`;
  }
  return `${value}${unit}`;
}

/**
 * Calculate weather impact on construction progress
 */
export function calculateWeatherImpact(
  weatherConditions: {
    temperature: number; // °C
    precipitation: number; // mm
    windSpeed: number; // km/h
    humidity: number; // %
  },
  constructionType: 'concrete' | 'steel' | 'roofing' | 'earthworks'
): {
  canProceed: boolean;
  efficiency: number; // 0-100%
  recommendations: string[];
} {
  const { temperature, precipitation, windSpeed, humidity } = weatherConditions;
  let canProceed = true;
  let efficiency = 100;
  const recommendations: string[] = [];
  
  // Temperature checks
  if (constructionType === 'concrete' && temperature < 5) {
    canProceed = false;
    recommendations.push('Température trop basse pour le coulage béton');
  } else if (temperature < 0) {
    efficiency -= 30;
    recommendations.push('Mesures antigel nécessaires');
  } else if (temperature > 35) {
    efficiency -= 20;
    recommendations.push('Travaux à éviter aux heures chaudes');
  }
  
  // Precipitation checks
  if (precipitation > 10) {
    if (constructionType === 'concrete') {
      canProceed = false;
      recommendations.push('Pluie forte - arrêt coulage béton');
    } else {
      efficiency -= 50;
      recommendations.push('Pluie - réduire les activités extérieures');
    }
  } else if (precipitation > 2) {
    efficiency -= 20;
    recommendations.push('Pluie légère - protéger les matériaux');
  }
  
  // Wind checks
  if (windSpeed > 60 && (constructionType === 'roofing' || constructionType === 'steel')) {
    canProceed = false;
    recommendations.push('Vent fort - arrêt travaux en hauteur');
  } else if (windSpeed > 30) {
    efficiency -= 25;
    recommendations.push('Vent modéré - précautions renforcées');
  }
  
  return { canProceed, efficiency, recommendations };
}

/**
 * Convert GPS coordinates to construction site grid reference
 */
export function convertGpsToGridReference(
  latitude: number,
  longitude: number,
  siteOrigin: { lat: number; lng: number },
  gridSize: number = 10 // meters per grid unit
): { x: number; y: number; reference: string } {
  // Simplified conversion - in real applications, use proper projection
  const latDiff = (latitude - siteOrigin.lat) * 111000; // ~111km per degree
  const lngDiff = (longitude - siteOrigin.lng) * 111000 * Math.cos(latitude * Math.PI / 180);
  
  const x = Math.floor(lngDiff / gridSize);
  const y = Math.floor(latDiff / gridSize);
  
  const xLetter = String.fromCharCode(65 + Math.abs(x) % 26); // A-Z
  const yNumber = Math.abs(y);
  
  return {
    x,
    y,
    reference: `${xLetter}${yNumber}`
  };
}

/**
 * Quality score calculation based on various factors
 */
export function calculateQualityScore(
  checks: {
    total: number;
    passed: number;
    failed: number;
    aiConfidence?: number;
  }
): {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  recommendation: string;
} {
  const { total, passed, failed, aiConfidence = 0.9 } = checks;
  
  if (total === 0) {
    return { score: 0, grade: 'F', recommendation: 'Aucun contrôle effectué' };
  }
  
  const passRate = (passed / total) * 100;
  const aiAdjustedScore = passRate * aiConfidence;
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  let recommendation: string;
  
  if (aiAdjustedScore >= 95) {
    grade = 'A';
    recommendation = 'Qualité excellente - maintenir les standards';
  } else if (aiAdjustedScore >= 85) {
    grade = 'B';
    recommendation = 'Bonne qualité - quelques améliorations possibles';
  } else if (aiAdjustedScore >= 75) {
    grade = 'C';
    recommendation = 'Qualité correcte - renforcer les contrôles';
  } else if (aiAdjustedScore >= 65) {
    grade = 'D';
    recommendation = 'Qualité insuffisante - actions correctives nécessaires';
  } else {
    grade = 'F';
    recommendation = 'Qualité critique - arrêt des travaux recommandé';
  }
  
  return {
    score: Math.round(aiAdjustedScore),
    grade,
    recommendation
  };
}

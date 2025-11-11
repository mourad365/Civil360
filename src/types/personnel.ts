// Types pour la gestion des sous-traitants et journaliers

export interface Tache {
  description: string;
  quantite: number;
  unite: 'baril' | 'm3' | 'm2' | 'kg' | 'tonne' | 'unite' | 'jour';
  prix: number;
  avancement: number;
}

export interface Soustraitant {
  id: string;
  nom: string;
  telephone: string;
  chantier: string;
  date: string;
  taches: Tache[];
  statut: 'pending' | 'paid' | 'overdue';
  montantTotal: number;
}

export interface PointageJour {
  present: boolean;
  heuresSupp: number;
}

export interface Pointage {
  semaine: string;
  chantier: string;
  lundi: PointageJour;
  mardi: PointageJour;
  mercredi: PointageJour;
  jeudi: PointageJour;
  vendredi: PointageJour;
  samedi: PointageJour;
}

export interface Journalier {
  id: string;
  nom: string;
  telephone: string;
  fonction: 'manoeuvre' | 'maçon' | 'ferrailleur' | 'coffreur' | 'grutier';
  pointages: Pointage[];
}

export interface StatsSoustraitants {
  totalSoustraitants: number;
  totalDecomptes: number;
  montantTotal: number;
  montantPaye: number;
}

export interface StatsJournaliers {
  totalJournaliers: number;
  totalPointages: number;
  heuresSupp: number;
  joursTravail: number;
}

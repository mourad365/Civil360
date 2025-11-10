"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, DollarSign, Clock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ title, value, icon, className = '' }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsSoustraitantsProps {
  totalSoustraitants: number;
  totalDecomptes: number;
  montantTotal: number;
  montantPaye: number;
}

export function StatsSoustraitants({
  totalSoustraitants,
  totalDecomptes,
  montantTotal,
  montantPaye
}: StatsSoustraitantsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Soustraitants"
        value={totalSoustraitants}
        icon={<Users className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Décomptes"
        value={totalDecomptes}
        icon={<FileText className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Montant Total (MRU)"
        value={montantTotal.toLocaleString()}
        icon={<DollarSign className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Montant Payé (MRU)"
        value={montantPaye.toLocaleString()}
        icon={<DollarSign className="h-6 w-6 text-green-600" />}
        className="border-l-4 border-l-green-500"
      />
    </div>
  );
}

interface StatsJournaliersProps {
  totalJournaliers: number;
  totalPointages: number;
  heuresSupp: number;
  joursTravail: number;
}

export function StatsJournaliers({
  totalJournaliers,
  totalPointages,
  heuresSupp,
  joursTravail
}: StatsJournaliersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Journaliers"
        value={totalJournaliers}
        icon={<Users className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Pointages cette semaine"
        value={totalPointages}
        icon={<FileText className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Heures Supp Total"
        value={heuresSupp}
        icon={<Clock className="h-6 w-6 text-orange-600" />}
        className="border-l-4 border-l-orange-500"
      />
      <StatCard
        title="Jours de travail"
        value={joursTravail}
        icon={<Clock className="h-6 w-6 text-blue-600" />}
        className="border-l-4 border-l-blue-500"
      />
    </div>
  );
}

interface StatsGeneralesProps {
  soustraitantsActifs: number;
  journaliersActifs: number;
  depensesTotal: number;
  montantsEnCours: number;
}

export function StatsGenerales({
  soustraitantsActifs,
  journaliersActifs,
  depensesTotal,
  montantsEnCours
}: StatsGeneralesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Soustraitants Actifs"
        value={soustraitantsActifs}
        icon={<Users className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Journaliers Actifs"
        value={journaliersActifs}
        icon={<Users className="h-6 w-6 text-blue-600" />}
      />
      <StatCard
        title="Dépenses Total (MRU)"
        value={depensesTotal.toLocaleString()}
        icon={<DollarSign className="h-6 w-6 text-red-600" />}
        className="border-l-4 border-l-red-500"
      />
      <StatCard
        title="Montants en Cours (MRU)"
        value={montantsEnCours.toLocaleString()}
        icon={<DollarSign className="h-6 w-6 text-orange-600" />}
        className="border-l-4 border-l-orange-500"
      />
    </div>
  );
}

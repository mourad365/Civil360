/**
 * Composant de carte récapitulative affichant les statistiques du projet
 */

import React from 'react';
import {
  Activity,
  Layers,
  Package,
  DollarSign,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { ProjectSummary } from '../types';
import { formatNumber, formatCurrency, formatWithUnit } from '../utils/formatters';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SummaryCardProps {
  summary: ProjectSummary;
  className?: string;
}

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
}

function SummaryItem({ icon, label, value, sublabel, color = 'blue' }: SummaryItemProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-[hsl(215,50%,15%)]',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
    red: 'bg-red-50 text-red-700',
    cyan: 'bg-cyan-50 text-cyan-700',
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all hover:border-[hsl(215,50%,15%)]">
      <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sublabel && (
          <p className="text-xs text-gray-500 mt-1">{sublabel}</p>
        )}
      </div>
    </div>
  );
}

export function SummaryCard({ summary, className = '' }: SummaryCardProps) {
  const summaryItems = [
    {
      icon: <Layers className="h-5 w-5" />,
      label: 'Surface totale',
      value: formatWithUnit(summary.surfaceTotale, 'm²'),
      sublabel: 'Surface de construction',
      color: 'blue',
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: 'Volume béton',
      value: formatWithUnit(summary.volumeBetonTotal, 'm³'),
      sublabel: 'Volume total de béton',
      color: 'green',
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: 'Acier estimé',
      value: formatWithUnit(summary.quantiteAcierEstimee, 'kg'),
      sublabel: `Ratio: ${formatNumber(summary.volumeBetonTotal > 0 ? summary.quantiteAcierEstimee / summary.volumeBetonTotal : 0)} kg/m³`,
      color: 'amber',
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Éléments structurels',
      value: formatNumber(summary.nombreElementsStructurels, 0),
      sublabel: 'Nombre total d\'éléments',
      color: 'purple',
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Lignes de devis',
      value: formatNumber(summary.nombreLignesDevis, 0),
      sublabel: 'Postes du devis',
      color: 'cyan',
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: 'Coût total',
      value: formatCurrency(summary.coutTotalProjet),
      sublabel: `Prix moyen: ${formatCurrency(summary.surfaceTotale > 0 ? summary.coutTotalProjet / summary.surfaceTotale : 0)}/m²`,
      color: 'red',
    },
  ];

  return (
    <Card className={`w-full bg-white border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-[hsl(215,50%,15%)]" />
          Récapitulatif du projet
        </CardTitle>
        <CardDescription className="text-gray-600">
          Vue d'ensemble des indicateurs clés du projet
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryItems.map((item, index) => (
            <SummaryItem key={index} {...item} />
          ))}
        </div>

        <Separator className="my-6" />

        {/* Indicateurs supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-sm text-gray-700 mb-1 font-medium">
              Densité d'acier
            </p>
            <p className="text-xl font-bold text-[hsl(215,50%,15%)]">
              {formatNumber(
                summary.volumeBetonTotal > 0
                  ? summary.quantiteAcierEstimee / summary.volumeBetonTotal
                  : 0
              )} kg/m³
            </p>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-sm text-gray-700 mb-1 font-medium">
              Coût moyen au m²
            </p>
            <p className="text-xl font-bold text-[hsl(215,50%,15%)]">
              {formatCurrency(
                summary.surfaceTotale > 0
                  ? summary.coutTotalProjet / summary.surfaceTotale
                  : 0
              )}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-sm text-gray-700 mb-1 font-medium">
              Coût béton moyen
            </p>
            <p className="text-xl font-bold text-[hsl(215,50%,15%)]">
              {formatCurrency(
                summary.volumeBetonTotal > 0
                  ? (summary.coutTotalProjet * 0.3) / summary.volumeBetonTotal
                  : 0
              )}/m³
            </p>
            <p className="text-xs text-gray-500 mt-1">
              (estimation 30% du total)
            </p>
          </div>
        </div>

        {/* Barre de progression visuelle */}
        <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-[hsl(215,50%,15%)] mb-4">
            Répartition estimée des coûts
          </h4>
          <div className="space-y-2">
            {[
              { label: 'Béton & Fondations', percentage: 30, color: 'bg-blue-500' },
              { label: 'Structure métallique', percentage: 35, color: 'bg-green-500' },
              { label: 'Second œuvre', percentage: 20, color: 'bg-amber-500' },
              { label: 'Finitions & Divers', percentage: 15, color: 'bg-purple-500' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs text-gray-700 mb-1.5">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold">{item.percentage}%</span>
                </div>
                <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

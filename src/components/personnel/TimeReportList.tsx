"use client";

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TimeReportList({ reports, onRefresh }: { reports: any[]; onRefresh?: () => void }) {
  const totals = useMemo(() => {
    const map: Record<string, number> = {};
    reports.forEach(r => {
      if (!Array.isArray(r.main_oeuvre)) return;
      r.main_oeuvre.forEach((m: any) => {
        const name = m.equipe_nom || 'Inconnu';
        map[name] = (map[name] || 0) + (Number(m.heures_travaillees) || 0);
      });
    });
    return map;
  }, [reports]);

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Journaliers Récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.length === 0 && <div className="text-sm text-muted-foreground">Aucun rapport</div>}
            {reports.map((r, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{new Date(r.date_rapport || r.createdAt || r.updatedAt || Date.now()).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">Projet: {r.projet_nom || (r.projet && r.projet.name) || '—'}</div>
                    <div className="text-sm text-muted-foreground">Chantier: {r.chantier_nom || (r.chantier && r.chantier.name) || '—'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Heures totales: { (Array.isArray(r.main_oeuvre) ? r.main_oeuvre.reduce((s: number, m: any) => s + (Number(m.heures_travaillees)||0), 0) : 0) }h</div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  {Array.isArray(r.main_oeuvre) && r.main_oeuvre.map((m: any, idx: number) => (
                    <div key={idx} className="p-2 border rounded">
                      <div className="font-medium">{m.equipe_nom}</div>
                      <div className="text-muted-foreground">Heures: {m.heures_travaillees}h</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Total heures par personne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(totals).length === 0 && <div className="text-sm text-muted-foreground">Aucune donnée</div>}
            {Object.entries(totals).map(([name, hrs]) => (
              <div key={name} className="p-2 border rounded flex items-center justify-between">
                <div>{name}</div>
                <div className="font-semibold">{hrs}h</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => onRefresh?.()}>Rafraîchir</Button>
      </div>
    </div>
  );
}

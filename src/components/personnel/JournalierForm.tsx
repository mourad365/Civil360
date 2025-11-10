"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JournalierForm({ onSaved }: { onSaved?: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [projet, setProjet] = useState('');
  const [chantier, setChantier] = useState('');
  const [ouvrierNom, setOuvrierNom] = useState('');
  const [heures, setHeures] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ouvrierNom || !heures) return alert('Remplir le nom et les heures');
    setLoading(true);
    try {
      const payload = {
        date_rapport: date,
        projet_nom: projet,
        chantier_nom: chantier,
        main_oeuvre: [
          { equipe_nom: ouvrierNom, nombre_ouvriers: 1, heures_travaillees: Number(heures), taches_realisees: [], efficacite: 8 }
        ],
        observations: '',
        note_journee: 8
      };

      const res = await fetch('/api/personnel/journaliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        onSaved?.();
      } else {
        alert(json.error || 'Erreur');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded-lg space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <label className="col-span-1">Date</label>
        <Input className="col-span-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Projet</label>
        <Input className="col-span-2" value={projet} onChange={(e) => setProjet(e.target.value)} />

        <label>Chantier</label>
        <Input className="col-span-2" value={chantier} onChange={(e) => setChantier(e.target.value)} />

        <label>Nom Ouvrier</label>
        <Input className="col-span-2" value={ouvrierNom} onChange={(e) => setOuvrierNom(e.target.value)} />

        <label>Heures</label>
        <Input className="col-span-2" type="number" value={heures as any} onChange={(e) => setHeures(e.target.value ? Number(e.target.value) : '')} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
      </div>
    </form>
  );
}

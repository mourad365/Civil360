"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, FileText } from 'lucide-react';
import { Journalier, Pointage, PointageJour } from '@/types/personnel';

interface JournalierManagementProps {
  journaliers: Journalier[];
  onAddJournalier: (journalier: Journalier) => void;
  onUpdatePointage: (journalierId: string, pointage: Pointage) => void;
  onGeneratePDF: () => void;
}

interface JournalierFormSectionProps {
  journalier?: Journalier;
  journaliers: Journalier[];
  onAddJournalier: (journalier: Journalier) => void;
}

export function JournalierFormSection({ journalier, journaliers, onAddJournalier }: JournalierFormSectionProps) {
  const [nom, setNom] = useState(journalier?.nom || '');
  const [telephone, setTelephone] = useState(journalier?.telephone || '');
  const [fonction, setFonction] = useState<'manoeuvre' | 'maçon' | 'ferrailleur' | 'coffreur' | 'grutier'>(journalier?.fonction || 'manoeuvre');

  // Mettre à jour les états quand le journalier change
  useEffect(() => {
    if (journalier) {
      setNom(journalier.nom);
      setTelephone(journalier.telephone);
      setFonction(journalier.fonction);
    }
  }, [journalier]);

  const handleAddJournalier = () => {
    if (!nom || !telephone || !fonction) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Vérifier l'unicité seulement si ce n'est pas une édition
    if (!journalier) {
      const existingJournalier = journaliers.find(j => j.telephone === telephone);
      if (existingJournalier) {
        alert("Un journalier avec ce numéro de téléphone existe déjà.");
        return;
      }
    }

    const newJournalier: Journalier = {
      id: journalier?.id || telephone,
      nom,
      telephone,
      fonction,
      pointages: journalier?.pointages || []
    };

    onAddJournalier(newJournalier);

    // Réinitialiser le formulaire seulement si ce n'est pas une édition
    if (!journalier) {
      setNom('');
      setTelephone('');
      setFonction('manoeuvre');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="journalier-nom">Nom et Prénom</Label>
          <Input
            id="journalier-nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Ali Chekh"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="journalier-numero">Numéro de Téléphone</Label>
          <Input
            id="journalier-numero"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="Ex: 41137828"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="journalier-fonction">Fonction</Label>
          <Select value={fonction} onValueChange={(value: any) => setFonction(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manoeuvre">Manoœuvre</SelectItem>
              <SelectItem value="maçon">Maçon</SelectItem>
              <SelectItem value="ferrailleur">Ferrailleur</SelectItem>
              <SelectItem value="coffreur">Coffreur</SelectItem>
              <SelectItem value="grutier">Grutier</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleAddJournalier}>
        <Plus className="h-4 w-4 mr-2" />
        {journalier ? 'Mettre à jour le Journalier' : 'Ajouter le Journalier'}
      </Button>
    </div>
  );
}

export default function JournalierManagement({
  journaliers,
  onAddJournalier,
  onUpdatePointage,
  onGeneratePDF
}: JournalierManagementProps) {
  const [chantier, setChantier] = useState('');
  const [dateDebut, setDateDebut] = useState(getStartOfWeek());
  const [dateFin, setDateFin] = useState(getEndOfWeek());

  function getStartOfWeek() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - 6);
    return startOfWeek.toISOString().split('T')[0];
  }

  function getEndOfWeek() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - 6);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);
    return endOfWeek.toISOString().split('T')[0];
  }

  const handlePointageChange = (
    journalierId: string,
    jour: keyof Omit<Pointage, 'semaine' | 'chantier'>,
    type: 'present' | 'heuresSupp',
    value: boolean | number
  ) => {
    const journalier = journaliers.find(j => j.id === journalierId);
    if (!journalier) return;

    let pointage = journalier.pointages.find(p => p.semaine === dateDebut && p.chantier === chantier);

    if (!pointage) {
      pointage = {
        semaine: dateDebut,
        chantier: chantier,
        lundi: { present: false, heuresSupp: 0 },
        mardi: { present: false, heuresSupp: 0 },
        mercredi: { present: false, heuresSupp: 0 },
        jeudi: { present: false, heuresSupp: 0 },
        vendredi: { present: false, heuresSupp: 0 },
        samedi: { present: false, heuresSupp: 0 }
      };
    }

    if (type === 'present') {
      pointage[jour].present = value as boolean;
    } else {
      pointage[jour].heuresSupp = value as number;
    }

    onUpdatePointage(journalierId, pointage);
  };

  const getPointageForJournalier = (journalierId: string) => {
    const journalier = journaliers.find(j => j.id === journalierId);
    if (!journalier) return null;

    return journalier.pointages.find(p => p.semaine === dateDebut && p.chantier === chantier) || {
      semaine: dateDebut,
      chantier: chantier,
      lundi: { present: false, heuresSupp: 0 },
      mardi: { present: false, heuresSupp: 0 },
      mercredi: { present: false, heuresSupp: 0 },
      jeudi: { present: false, heuresSupp: 0 },
      vendredi: { present: false, heuresSupp: 0 },
      samedi: { present: false, heuresSupp: 0 }
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Journaliers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="journalier-chantier">Chantier</Label>
            <Select value={chantier} onValueChange={setChantier}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un chantier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parc-public">Parc Public</SelectItem>
                <SelectItem value="residence-jardins">Résidence Les Jardins</SelectItem>
                <SelectItem value="immeuble-parc">Immeuble Le Parc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-debut">Semaine du</Label>
              <Input
                id="date-debut"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-fin">au</Label>
              <Input
                id="date-fin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {chantier && dateDebut && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pointage Hebdomadaire - Semaine du {dateDebut}</CardTitle>
              <Button onClick={onGeneratePDF} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Générer PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="border p-2 text-left">Journalier</th>
                    <th className="border p-2 text-left">Téléphone</th>
                    <th className="border p-2 text-center">Lundi</th>
                    <th className="border p-2 text-center">Mardi</th>
                    <th className="border p-2 text-center">Mercredi</th>
                    <th className="border p-2 text-center">Jeudi</th>
                    <th className="border p-2 text-center">Vendredi</th>
                    <th className="border p-2 text-center">Samedi</th>
                  </tr>
                </thead>
                <tbody>
                  {journaliers.map((journalier) => {
                    const pointage = getPointageForJournalier(journalier.id);
                    if (!pointage) return null;

                    return (
                      <tr key={journalier.id} className="hover:bg-muted/50">
                        <td className="border p-2">{journalier.nom}</td>
                        <td className="border p-2">{journalier.telephone}</td>
                        {(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'] as const).map((jour) => (
                          <td key={jour} className="border p-2 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Checkbox
                                checked={pointage[jour].present}
                                onCheckedChange={(checked) => 
                                  handlePointageChange(journalier.id, jour, 'present', checked as boolean)
                                }
                              />
                              <Input
                                type="number"
                                min="0"
                                max="8"
                                value={pointage[jour].heuresSupp}
                                onChange={(e) => 
                                  handlePointageChange(journalier.id, jour, 'heuresSupp', parseInt(e.target.value) || 0)
                                }
                                className="w-16 h-8 text-center text-xs"
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {journaliers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun journalier enregistré
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

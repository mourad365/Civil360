"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Save } from 'lucide-react';
import { Tache, Soustraitant } from '@/types/personnel';

interface SoustraitantFormProps {
  soustraitant?: Soustraitant;
  onSaved: (soustraitant: Soustraitant) => void;
}

export default function SoustraitantForm({ soustraitant, onSaved }: SoustraitantFormProps) {
  const [nom, setNom] = useState(soustraitant?.nom || '');
  const [telephone, setTelephone] = useState(soustraitant?.telephone || '');
  const [chantier, setChantier] = useState(soustraitant?.chantier || '');
  const [date, setDate] = useState(soustraitant?.date || new Date().toISOString().split('T')[0]);
  const [taches, setTaches] = useState<Tache[]>(
    soustraitant?.taches || [{ description: '', quantite: 0, unite: 'baril', prix: 0, avancement: 0 }]
  );

  // Mettre à jour les états quand le soustraitant change
  useEffect(() => {
    if (soustraitant) {
      setNom(soustraitant.nom);
      setTelephone(soustraitant.telephone);
      setChantier(soustraitant.chantier);
      setDate(soustraitant.date);
      setTaches(soustraitant.taches);
    }
  }, [soustraitant]);

  const addTache = () => {
    setTaches([...taches, { description: '', quantite: 0, unite: 'baril', prix: 0, avancement: 0 }]);
  };

  const removeTache = (index: number) => {
    setTaches(taches.filter((_, i) => i !== index));
  };

  const updateTache = (index: number, field: keyof Tache, value: any) => {
    const newTaches = [...taches];
    newTaches[index] = { ...newTaches[index], [field]: value };
    setTaches(newTaches);
  };

  const handleSubmit = () => {
    if (!nom || !telephone || !chantier || !date) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const validTaches = taches.filter(t => t.description && t.quantite && t.prix);
    if (validTaches.length === 0) {
      alert("Veuillez ajouter au moins une tâche.");
      return;
    }

    const montantTotal = validTaches.reduce((sum, tache) => sum + (tache.quantite * tache.prix), 0);

    const newSoustraitant: Soustraitant = {
      id: soustraitant?.id || `DEC-${Date.now()}`,
      nom,
      telephone,
      chantier,
      date,
      taches: validTaches,
      statut: soustraitant?.statut || 'pending',
      montantTotal
    };

    onSaved(newSoustraitant);

    // Réinitialiser le formulaire seulement si ce n'est pas une édition
    if (!soustraitant) {
      setNom('');
      setTelephone('');
      setChantier('');
      setDate(new Date().toISOString().split('T')[0]);
      setTaches([{ description: '', quantite: 0, unite: 'baril', prix: 0, avancement: 0 }]);
    }
  };

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du Soustraitant</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Mohamed Mbarek"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Ex: 44476892"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chantier">Chantier</Label>
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

          <div className="space-y-2">
            <Label htmlFor="date">Date du Décompte</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tâches et Prestations</h3>
          
          {taches.map((tache, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Description de la tâche</Label>
                    <Input
                      value={tache.description}
                      onChange={(e) => updateTache(index, 'description', e.target.value)}
                      placeholder="Ex: Ferraillage Fer 8"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      value={tache.quantite}
                      onChange={(e) => updateTache(index, 'quantite', parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 29"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unité</Label>
                    <Select 
                      value={tache.unite} 
                      onValueChange={(value) => updateTache(index, 'unite', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baril">Baril</SelectItem>
                        <SelectItem value="m3">m³</SelectItem>
                        <SelectItem value="m2">m²</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="tonne">Tonne</SelectItem>
                        <SelectItem value="unite">Unité</SelectItem>
                        <SelectItem value="jour">Jour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Prix Unitaire (MRU)</Label>
                    <Input
                      type="number"
                      value={tache.prix}
                      onChange={(e) => updateTache(index, 'prix', parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Avancement (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={tache.avancement}
                      onChange={(e) => updateTache(index, 'avancement', parseInt(e.target.value) || 0)}
                      placeholder="Ex: 75"
                    />
                  </div>
                </div>

                {taches.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTache(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer cette tâche
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-2">
            <Button variant="outline" onClick={addTache}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une autre tâche
            </Button>

            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {soustraitant ? 'Mettre à jour le Décompte' : 'Enregistrer le Décompte'}
            </Button>
          </div>
        </div>
    </div>
  );
}

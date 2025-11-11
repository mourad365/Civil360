"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Journalier } from '@/types/personnel';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface JournaliersListProps {
  journaliers: Journalier[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function JournaliersList({
  journaliers,
  onView,
  onEdit,
  onDelete
}: JournaliersListProps) {
  const getFonctionBadge = (fonction: string) => {
    const colors: Record<string, string> = {
      'manoeuvre': 'bg-blue-100 text-blue-800',
      'maçon': 'bg-green-100 text-green-800',
      'ferrailleur': 'bg-purple-100 text-purple-800',
      'coffreur': 'bg-orange-100 text-orange-800',
      'grutier': 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant="outline" className={colors[fonction] || ''}>
        {fonction.charAt(0).toUpperCase() + fonction.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {journaliers.map((journalier) => (
        <Card key={journalier.id} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{journalier.nom}</CardTitle>
              {getFonctionBadge(journalier.fonction)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><strong>Téléphone:</strong> {journalier.telephone}</div>
              <div><strong>Pointages enregistrés:</strong> {journalier.pointages.length} semaine(s)</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(journalier.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir Pointages
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(journalier.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(journalier.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {journaliers.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun journalier enregistré
          </CardContent>
        </Card>
      )}
    </div>
  );
}

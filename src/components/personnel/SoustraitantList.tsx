"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Soustraitant } from '@/types/personnel';
import { Check, FileText, Edit, Trash2 } from 'lucide-react';

interface SoustraitantListProps {
  soustraitants: Soustraitant[];
  onMarkAsPaid: (id: string) => void;
  onGeneratePDF: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SoustraitantList({
  soustraitants,
  onMarkAsPaid,
  onGeneratePDF,
  onEdit,
  onDelete
}: SoustraitantListProps) {
  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'pending':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">En attente</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Payé</Badge>;
      case 'overdue':
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return null;
    }
  };

  const calculateAvancement = (soustraitant: Soustraitant) => {
    if (soustraitant.taches.length === 0) return 0;
    return soustraitant.taches.reduce((sum, tache) => sum + tache.avancement, 0) / soustraitant.taches.length;
  };

  return (
    <div className="space-y-4">
      {soustraitants.map((soustraitant) => {
        const avancement = calculateAvancement(soustraitant);
        
        return (
          <Card key={soustraitant.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{soustraitant.id}</CardTitle>
                {getStatusBadge(soustraitant.statut)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><strong>Nom:</strong> {soustraitant.nom}</div>
                <div><strong>Téléphone:</strong> {soustraitant.telephone}</div>
                <div><strong>Chantier:</strong> {soustraitant.chantier}</div>
                <div><strong>Date:</strong> {soustraitant.date}</div>
                <div><strong>Montant Total:</strong> {soustraitant.montantTotal.toLocaleString()} MRU</div>
                <div><strong>Avancement:</strong> {avancement.toFixed(0)}%</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Progression</div>
                <Progress value={avancement} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-2">
                {soustraitant.statut === 'pending' && (
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onMarkAsPaid(soustraitant.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marquer comme Payé
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onGeneratePDF(soustraitant.id)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Générer PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(soustraitant.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(soustraitant.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {soustraitants.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun décompte enregistré
          </CardContent>
        </Card>
      )}
    </div>
  );
}

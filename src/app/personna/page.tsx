"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import SoustraitantForm from '@/components/personnel/SoustraitantForm';
import SoustraitantList from '@/components/personnel/SoustraitantList';
import JournalierManagement, { JournalierFormSection } from '@/components/personnel/JournalierManagement';
import JournaliersList from '@/components/personnel/JournaliersList';
import { StatsSoustraitants, StatsJournaliers, StatsGenerales } from '@/components/personnel/StatsCards';
import { Soustraitant, Journalier, Pointage, StatsSoustraitants as StatsSoustraitantsType, StatsJournaliers as StatsJournaliersType } from '@/types/personnel';
import { generateDecomptePDF, generatePointagePDF } from '@/utils/pdfGenerator';
import { Receipt, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import * as personnelService from '@/services/personnelService';

export default function PersonnaPage() {
  const [openSoustraitantDialog, setOpenSoustraitantDialog] = useState(false);
  const [openJournalierDialog, setOpenJournalierDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingSoustraitant, setEditingSoustraitant] = useState<Soustraitant | undefined>(undefined);
  const [editingJournalier, setEditingJournalier] = useState<Journalier | undefined>(undefined);

  // États pour les sous-traitants
  const [soustraitants, setSoustraitants] = useState<Soustraitant[]>([]);

  // États pour les journaliers
  const [journaliers, setJournaliers] = useState<Journalier[]>([]);

  const [statsSoustraitants, setStatsSoustraitants] = useState<StatsSoustraitantsType>({
    totalSoustraitants: 0,
    totalDecomptes: 0,
    montantTotal: 0,
    montantPaye: 0
  });

  const [statsJournaliers, setStatsJournaliers] = useState<StatsJournaliersType>({
    totalJournaliers: 0,
    totalPointages: 0,
    heuresSupp: 0,
    joursTravail: 0
  });

  // Charger les données depuis MongoDB au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [decomptes, ouvriers] = await Promise.all([
        personnelService.fetchDecomptes(),
        personnelService.fetchOuvriers()
      ]);
      setSoustraitants(decomptes);
      setJournaliers(ouvriers);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  useEffect(() => { 
    // Stats sous-traitants
    const uniqueSoustraitants = new Set(soustraitants.map(s => s.nom)).size;
    const montantTotal = soustraitants.reduce((sum, s) => sum + s.montantTotal, 0);
    const montantPaye = soustraitants
      .filter(s => s.statut === 'paid')
      .reduce((sum, s) => sum + s.montantTotal, 0);

    setStatsSoustraitants({
      totalSoustraitants: uniqueSoustraitants,
      totalDecomptes: soustraitants.length,
      montantTotal,
      montantPaye
    });

    // Stats journaliers
    setStatsJournaliers({
      totalJournaliers: journaliers.length,
      totalPointages: 0,
      heuresSupp: 0,
      joursTravail: 0
    });
  }, [soustraitants, journaliers]);

  // Handlers pour les sous-traitants
  const handleSaveSoustraitant = async (soustraitant: Soustraitant) => {
    if (editingSoustraitant) {
      // Mode édition
      const updated = await personnelService.updateDecompte(soustraitant);
      if (updated) {
        setSoustraitants(soustraitants.map(s => s.id === updated.id ? updated : s));
        setOpenSoustraitantDialog(false);
        setEditingSoustraitant(undefined);
      }
    } else {
      // Mode création
      const created = await personnelService.createDecompte(soustraitant);
      if (created) {
        setSoustraitants([...soustraitants, created]);
        setOpenSoustraitantDialog(false);
      }
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    const updated = await personnelService.updateDecompteStatut(id, 'paid');
    if (updated) {
      setSoustraitants(soustraitants.map(s => 
        s.id === id ? { ...s, statut: 'paid' as const } : s
      ));
    }
  };

  const handleGeneratePDFSoustraitant = (id: string) => {
    const soustraitant = soustraitants.find(s => s.id === id);
    if (soustraitant) {
      generateDecomptePDF(soustraitant);
    }
  };

  const handleEditSoustraitant = (id: string) => {
    const soustraitant = soustraitants.find(s => s.id === id);
    if (soustraitant) {
      setEditingSoustraitant(soustraitant);
      setOpenSoustraitantDialog(true);
    }
  };

  const handleDeleteSoustraitant = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce décompte ?')) {
      const success = await personnelService.deleteDecompte(id);
      if (success) {
        setSoustraitants(soustraitants.filter(s => s.id !== id));
      }
    }
  };

  // Handlers pour les journaliers
  const handleAddJournalier = async (journalier: Journalier) => {
    if (editingJournalier) {
      // Mode édition
      const updated = await personnelService.updateOuvrier(journalier);
      if (updated) {
        setJournaliers(journaliers.map(j => j.id === updated.id ? updated : j));
        setOpenJournalierDialog(false);
        setEditingJournalier(undefined);
      }
    } else {
      // Mode création
      const created = await personnelService.createOuvrier(journalier);
      if (created) {
        setJournaliers([...journaliers, created]);
        setOpenJournalierDialog(false);
      }
    }
  };

  const handleUpdatePointage = async (journalierId: string, pointage: Pointage) => {
    const updated = await personnelService.updateOuvrierPointage(journalierId, pointage);
    if (updated) {
      setJournaliers(journaliers.map(j => {
        if (j.id === journalierId) {
          const existingPointageIndex = j.pointages.findIndex(
            p => p.semaine === pointage.semaine && p.chantier === pointage.chantier
          );
          
          if (existingPointageIndex >= 0) {
            const newPointages = [...j.pointages];
            newPointages[existingPointageIndex] = pointage;
            return { ...j, pointages: newPointages };
          } else {
            return { ...j, pointages: [...j.pointages, pointage] };
          }
        }
        return j;
      }));
    }
  };

  const handleGeneratePDFPointage = () => {
    // TODO: Récupérer les paramètres de date et chantier
    generatePointagePDF(journaliers, '2025-09-22', 'parc-public');
  };

  const handleViewJournalier = (id: string) => {
    const journalier = journaliers.find(j => j.id === id);
    if (journalier) {
      const pointagesText = journalier.pointages.map(p => 
        `Semaine: ${p.semaine}, Chantier: ${p.chantier}\n` +
        `Lundi: ${p.lundi.present ? 'Présent' : 'Absent'} (${p.lundi.heuresSupp}h supp)\n` +
        `Mardi: ${p.mardi.present ? 'Présent' : 'Absent'} (${p.mardi.heuresSupp}h supp)\n` +
        `Mercredi: ${p.mercredi.present ? 'Présent' : 'Absent'} (${p.mercredi.heuresSupp}h supp)\n` +
        `Jeudi: ${p.jeudi.present ? 'Présent' : 'Absent'} (${p.jeudi.heuresSupp}h supp)\n` +
        `Vendredi: ${p.vendredi.present ? 'Présent' : 'Absent'} (${p.vendredi.heuresSupp}h supp)\n` +
        `Samedi: ${p.samedi.present ? 'Présent' : 'Absent'} (${p.samedi.heuresSupp}h supp)`
      ).join('\n\n');
      
      alert(`Pointages de ${journalier.nom}:\n\n${pointagesText}`);
    }
  };

  const handleEditJournalier = (id: string) => {
    const journalier = journaliers.find(j => j.id === id);
    if (journalier) {
      setEditingJournalier(journalier);
      setOpenJournalierDialog(true);
    }
  };

  const handleDeleteJournalier = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce journalier ?')) {
      const success = await personnelService.deleteOuvrier(id);
      if (success) {
        setJournaliers(journaliers.filter(j => j.id !== id));
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Receipt className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Gestion Soustraitants & Journaliers</h1>
          </div>
          <p className="text-muted-foreground">
            Gestion des décomptes de sous-traitance et pointage du personnel journalier
          </p>
        </div>

        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg">Chargement des données...</span>
          </div>
        )}

        {/* Onglets principaux */}
        {!loading && (
          <Tabs defaultValue="soustraitants" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="soustraitants">Décompte Soustraitants</TabsTrigger>
              <TabsTrigger value="journaliers">Pointage Journaliers</TabsTrigger>
              <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
            </TabsList>

          {/* Onglet Sous-traitants */}
          <TabsContent value="soustraitants" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={openSoustraitantDialog} onOpenChange={(open) => {
                setOpenSoustraitantDialog(open);
                if (!open) setEditingSoustraitant(undefined);
              }}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Nouveau Décompte Sous-traitant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingSoustraitant ? 'Modifier le Décompte' : 'Nouveau Décompte Sous-traitant'}
                    </DialogTitle>
                  </DialogHeader>
                  <SoustraitantForm soustraitant={editingSoustraitant} onSaved={handleSaveSoustraitant} />
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
                <StatsSoustraitants {...statsSoustraitants} />
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-4">Décomptes en Cours</h2>
              <SoustraitantList
                soustraitants={soustraitants}
                onMarkAsPaid={handleMarkAsPaid}
                onGeneratePDF={handleGeneratePDFSoustraitant}
                onEdit={handleEditSoustraitant}
                onDelete={handleDeleteSoustraitant}
              />
            </div>
          </TabsContent>

          {/* Onglet Journaliers */}
          <TabsContent value="journaliers" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={openJournalierDialog} onOpenChange={(open) => {
                setOpenJournalierDialog(open);
                if (!open) setEditingJournalier(undefined);
              }}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Nouveau Journalier
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingJournalier ? 'Modifier le Journalier' : 'Ajouter un Journalier'}
                    </DialogTitle>
                  </DialogHeader>
                  <JournalierFormSection
                    journalier={editingJournalier}
                    journaliers={journaliers}
                    onAddJournalier={handleAddJournalier}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <JournalierManagement
                  journaliers={journaliers}
                  onAddJournalier={handleAddJournalier}
                  onUpdatePointage={handleUpdatePointage}
                  onGeneratePDF={handleGeneratePDFPointage}
                />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
                    <StatsJournaliers {...statsJournaliers} />
                  </CardContent>
                </Card>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Journaliers</h2>
                  <JournaliersList
                    journaliers={journaliers}
                    onView={handleViewJournalier}
                    onEdit={handleEditJournalier}
                    onDelete={handleDeleteJournalier}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Onglet Statistiques */}
          <TabsContent value="statistiques" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Statistiques Financières</h2>
                  <StatsGenerales
                    soustraitantsActifs={statsSoustraitants.totalSoustraitants}
                    journaliersActifs={statsJournaliers.totalJournaliers}
                    depensesTotal={statsSoustraitants.montantTotal}
                    montantsEnCours={statsSoustraitants.montantTotal - statsSoustraitants.montantPaye}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Répartition des Dépenses</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 bg-primary rounded flex-1 max-w-[60%]">
                        <div className="text-white text-xs px-3 py-1">Soustraitants: 60%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 bg-blue-600 rounded flex-1 max-w-[40%]">
                        <div className="text-white text-xs px-3 py-1">Journaliers: 40%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}

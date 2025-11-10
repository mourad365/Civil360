/**
 * Composant principal - Module d'Étude Quantitative
 * Gestion de projets de construction métallique avec devis estimatif
 */

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Calculator,
  Save,
  Building2,
  Calendar,
  MapPin,
  User,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

import { TableEditable } from './components/TableEditable';
import { SummaryCard } from './components/SummaryCard';
import { FileActions } from './components/FileActions';
import { useLocalStorage } from './hooks/useLocalStorage';

import {
  ProjectData,
  ProjectCategory,
  TableDefinition,
  DevisSection,
  DevisRow,
  TableRow,
} from './types';
import {
  createInitialProjectData,
  categoryLabels,
} from './data/initialData';
import { createSampleProject } from './data/sampleData';
import {
  calculerRecapitulatifProjet,
  calculerTotalSection,
  calculerMontantTotal,
} from './utils/calculations';
import { formatDate, formatDateTime, generateId } from './utils/formatters';

const STORAGE_KEY = 'civil360-etude-quantitative';

/**
 * Composant principal
 */
export function EtudeQuantitative() {
  const { toast } = useToast();
  const [projectData, setProjectData, clearProjectData] = useLocalStorage<ProjectData>(
    STORAGE_KEY,
    createInitialProjectData()
  );
  const [activeTab, setActiveTab] = useState<ProjectCategory>('informations-generales');
  const [lastSaved, setLastSaved] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  /**
   * Initialisation côté client uniquement
   */
  useEffect(() => {
    setIsMounted(true);
    setLastSaved(projectData.updatedAt);
  }, []);

  /**
   * Sauvegarde automatique
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedData = {
        ...projectData,
        updatedAt: new Date().toISOString(),
      };
      setProjectData(updatedData);
      setLastSaved(updatedData.updatedAt);
    }, 1000);

    return () => clearTimeout(timer);
  }, [projectData]);

  /**
   * Recalcule le récapitulatif quand les données changent
   */
  useEffect(() => {
    const allTechnicalRows = projectData.tables.flatMap(t => t.rows);
    const allDevisRows = projectData.devisSections.flatMap(s => s.rows);
    
    const newSummary = calculerRecapitulatifProjet(allTechnicalRows, allDevisRows);
    
    if (JSON.stringify(newSummary) !== JSON.stringify(projectData.summary)) {
      setProjectData({
        ...projectData,
        summary: newSummary,
      });
    }
  }, [projectData.tables, projectData.devisSections]);

  /**
   * Met à jour les informations générales
   */
  const handleInfoChange = (field: keyof typeof projectData.info, value: string) => {
    setProjectData({
      ...projectData,
      info: {
        ...projectData.info,
        [field]: value,
      },
    });
  };

  /**
   * Met à jour une table technique
   */
  const handleTableUpdate = (updatedTable: TableDefinition) => {
    setProjectData({
      ...projectData,
      tables: projectData.tables.map(t => (t.id === updatedTable.id ? updatedTable : t)),
    });

    toast({
      title: 'Table mise à jour',
      description: `${updatedTable.title} a été sauvegardée.`,
      duration: 2000,
    });
  };

  /**
   * Met à jour une section de devis
   */
  const handleDevisUpdate = (sectionId: string, rows: DevisRow[]) => {
    const totalSection = calculerTotalSection(rows);

    setProjectData({
      ...projectData,
      devisSections: projectData.devisSections.map(s =>
        s.id === sectionId ? { ...s, rows, totalSection } : s
      ),
    });
  };

  /**
   * Ajoute une ligne de devis
   */
  const handleAddDevisRow = (sectionId: string) => {
    const newRow: DevisRow = {
      id: generateId(),
      designation: '',
      unite: 'm³',
      quantite: 0,
      prixUnitaire: 0,
      montantTotal: 0,
    };

    setProjectData({
      ...projectData,
      devisSections: projectData.devisSections.map(s =>
        s.id === sectionId ? { ...s, rows: [...s.rows, newRow] } : s
      ),
    });
  };

  /**
   * Met à jour une ligne de devis
   */
  const handleUpdateDevisRow = (
    sectionId: string,
    rowId: string,
    field: keyof DevisRow,
    value: any
  ) => {
    setProjectData({
      ...projectData,
      devisSections: projectData.devisSections.map(section => {
        if (section.id !== sectionId) return section;

        const updatedRows = section.rows.map(row => {
          if (row.id !== rowId) return row;

          const updatedRow = { ...row, [field]: value };

          // Recalculer le montant total
          if (field === 'quantite' || field === 'prixUnitaire') {
            updatedRow.montantTotal = calculerMontantTotal(
              updatedRow.quantite,
              updatedRow.prixUnitaire
            );
          }

          return updatedRow;
        });

        return {
          ...section,
          rows: updatedRows,
          totalSection: calculerTotalSection(updatedRows),
        };
      }),
    });
  };

  /**
   * Supprime une ligne de devis
   */
  const handleDeleteDevisRow = (sectionId: string, rowId: string) => {
    setProjectData({
      ...projectData,
      devisSections: projectData.devisSections.map(section => {
        if (section.id !== sectionId) return section;

        const updatedRows = section.rows.filter(row => row.id !== rowId);

        return {
          ...section,
          rows: updatedRows,
          totalSection: calculerTotalSection(updatedRows),
        };
      }),
    });
  };

  /**
   * Importe des données
   */
  const handleImport = (data: Partial<ProjectData>) => {
    setProjectData({
      ...projectData,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  /**
   * Réinitialise le projet
   */
  const handleReset = () => {
    clearProjectData();
    setProjectData(createInitialProjectData());
  };

  /**
   * Charge les données d'exemple
   */
  const handleLoadSample = () => {
    const sampleData = createSampleProject();
    setProjectData(sampleData);
    toast({
      title: 'Données d\'exemple chargées',
      description: 'Projet hangar métallique de Nouakchott chargé avec succès.',
      variant: 'default',
    });
  };

  /**
   * Filtre les tables par catégorie
   */
  const tablesByCategory = useMemo(() => {
    return projectData.tables.filter(t => t.category === activeTab);
  }, [projectData.tables, activeTab]);

  /**
   * Filtre les sections de devis par catégorie
   */
  const devisByCategory = useMemo(() => {
    return projectData.devisSections.filter(s => s.category === activeTab);
  }, [projectData.devisSections, activeTab]);

  // Prevent hydration errors by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-[hsl(215,50%,15%)]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {projectData.info.nom}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Fiche technique & Devis estimatif
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Save className="h-3.5 w-3.5" />
                  Dernière sauvegarde: {formatDateTime(lastSaved)}
                </span>
                <Badge variant="outline" className="text-xs bg-blue-50 text-[hsl(215,50%,15%)] border-blue-200">
                  {projectData.info.reference}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FileActions
                projectData={projectData}
                onImport={handleImport}
                onReset={handleReset}
              />
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 text-sm bg-green-600 text-black rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                Charger données d'exemple
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ProjectCategory)}
          className="space-y-6"
        >
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex w-max min-w-full gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="whitespace-nowrap px-6 py-3 text-sm font-semibold text-gray-900 data-[state=active]:bg-[hsl(215,50%,15%)] data-[state=active]:text-black data-[state=inactive]:bg-white hover:bg-gray-50 data-[state=active]:shadow-md rounded-lg transition-all border border-transparent data-[state=active]:border-[hsl(215,50%,15%)]"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Informations générales */}
          <TabsContent value="informations-generales">
            <AnimatePresence mode="wait">
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-[hsl(215,50%,15%)]" />
                      Informations du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nom" className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Nom du projet
                        </Label>
                        <Input
                          id="nom"
                          value={projectData.info.nom}
                          onChange={(e) => handleInfoChange('nom', e.target.value)}
                          placeholder="Ex: Construction hangar métallique"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="client" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Client
                        </Label>
                        <Input
                          id="client"
                          value={projectData.info.client}
                          onChange={(e) => handleInfoChange('client', e.target.value)}
                          placeholder="Nom du client"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lieu" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Lieu
                        </Label>
                        <Input
                          id="lieu"
                          value={projectData.info.lieu}
                          onChange={(e) => handleInfoChange('lieu', e.target.value)}
                          placeholder="Localisation du projet"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reference" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Référence
                        </Label>
                        <Input
                          id="reference"
                          value={projectData.info.reference}
                          onChange={(e) => handleInfoChange('reference', e.target.value)}
                          placeholder="Référence du projet"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateDebut" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date de début
                        </Label>
                        <Input
                          id="dateDebut"
                          type="date"
                          value={projectData.info.dateDebut}
                          onChange={(e) => handleInfoChange('dateDebut', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateFin" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date de fin prévue
                        </Label>
                        <Input
                          id="dateFin"
                          type="date"
                          value={projectData.info.dateFin}
                          onChange={(e) => handleInfoChange('dateFin', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={projectData.info.description}
                        onChange={(e) => handleInfoChange('description', e.target.value)}
                        placeholder="Description détaillée du projet..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* Autres catégories - Tables techniques */}
          {(['fondations', 'superstructure', 'planchers', 'facades-cloisons', 'toiture', 'second-oeuvre', 'amenagements-exterieurs'] as ProjectCategory[]).map(
            category => (
              <TabsContent key={category} value={category}>
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[hsl(215,50%,15%)] rounded-lg">
                            <Calculator className="h-4 w-4 text-black" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {categoryLabels[category]}
                            </p>
                            <p className="text-sm text-gray-600">
                              {tablesByCategory.length} table(s) technique(s) •{' '}
                              {devisByCategory.length} section(s) de devis
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tables techniques */}
                    {tablesByCategory.map(table => (
                      <TableEditable
                        key={table.id}
                        table={table}
                        onUpdate={handleTableUpdate}
                      />
                    ))}

                    {tablesByCategory.length === 0 && (
                      <Card className="bg-white border-gray-200">
                        <CardContent className="p-8 text-center text-gray-500">
                          Aucune table technique pour cette catégorie
                        </CardContent>
                      </Card>
                    )}

                    <Separator className="my-8" />

                    {/* Sections de devis */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                      <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Calculator className="h-5 w-5 text-[hsl(215,50%,15%)]" />
                          Devis estimatif - {categoryLabels[category]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        {devisByCategory.map(section => (
                          <DevisTable
                            key={section.id}
                            section={section}
                            onAddRow={() => handleAddDevisRow(section.id)}
                            onUpdateRow={handleUpdateDevisRow}
                            onDeleteRow={handleDeleteDevisRow}
                          />
                        ))}

                        {devisByCategory.length === 0 && (
                          <p className="text-center text-gray-500 py-4">
                            Aucune section de devis pour cette catégorie
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            )
          )}
        </Tabs>

        {/* Récapitulatif */}
        <SummaryCard summary={projectData.summary} />
    </div>
  );
}

/**
 * Composant de table de devis
 */
interface DevisTableProps {
  section: DevisSection;
  onAddRow: () => void;
  onUpdateRow: (sectionId: string, rowId: string, field: keyof DevisRow, value: any) => void;
  onDeleteRow: (sectionId: string, rowId: string) => void;
}

function DevisTable({ section, onAddRow, onUpdateRow, onDeleteRow }: DevisTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-900">
          {section.title}
        </h4>
        <button
          onClick={onAddRow}
          className="px-4 py-2 text-sm bg-[hsl(215,50%,15%)] text-black rounded-lg hover:bg-[hsl(215,50%,20%)] transition-colors shadow-sm font-medium"
        >
          + Ajouter ligne
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Désignation</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">Unité</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-28">Quantité</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Prix unitaire</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Montant total</th>
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {section.rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Input
                    value={row.designation}
                    onChange={(e) => onUpdateRow(section.id, row.id, 'designation', e.target.value)}
                    className="w-full border-gray-200 focus:border-[hsl(215,50%,15%)] focus:ring-[hsl(215,50%,15%)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    value={row.unite}
                    onChange={(e) => onUpdateRow(section.id, row.id, 'unite', e.target.value)}
                    className="w-full border-gray-200 focus:border-[hsl(215,50%,15%)] focus:ring-[hsl(215,50%,15%)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    value={row.quantite}
                    onChange={(e) =>
                      onUpdateRow(section.id, row.id, 'quantite', parseFloat(e.target.value) || 0)
                    }
                    className="w-full border-gray-200 focus:border-[hsl(215,50%,15%)] focus:ring-[hsl(215,50%,15%)]"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    value={row.prixUnitaire}
                    onChange={(e) =>
                      onUpdateRow(section.id, row.id, 'prixUnitaire', parseFloat(e.target.value) || 0)
                    }
                    className="w-full border-gray-200 focus:border-[hsl(215,50%,15%)] focus:ring-[hsl(215,50%,15%)]"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="px-3 py-2 bg-blue-50 rounded-lg font-semibold text-[hsl(215,50%,15%)] text-right">
                    {row.montantTotal.toFixed(2)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDeleteRow(section.id, row.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded p-2 transition-colors font-bold text-lg"
                    title="Supprimer"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-blue-50 font-bold">
              <td colSpan={4} className="px-4 py-4 text-right text-gray-900 uppercase text-sm">
                TOTAL {section.title}
              </td>
              <td className="px-4 py-4">
                <div className="px-3 py-2 bg-[hsl(215,50%,15%)] text-black rounded-lg font-bold text-right">
                  {section.totalSection.toFixed(2)} MRU
                </div>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default EtudeQuantitative;

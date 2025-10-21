/**
 * Composant d'actions sur les fichiers (import/export/reset)
 */

import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ProjectData } from '../types';
import { exportToExcel, importFromExcel } from '../utils/excelAdapter';
import { formatFileName } from '../utils/formatters';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface FileActionsProps {
  projectData: ProjectData;
  onImport: (data: Partial<ProjectData>) => void;
  onReset: () => void;
  className?: string;
}

export function FileActions({
  projectData,
  onImport,
  onReset,
  className = '',
}: FileActionsProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Exporte les données en JSON
   */
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(projectData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = formatFileName(projectData.info.nom, 'json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export JSON réussi',
        description: 'Les données ont été exportées avec succès.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Erreur export JSON:', error);
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter les données en JSON.',
        variant: 'destructive',
      });
    }
  };

  /**
   * Exporte les données en Excel
   */
  const handleExportExcel = () => {
    try {
      setIsProcessing(true);
      exportToExcel(projectData);
      
      toast({
        title: 'Export Excel réussi',
        description: 'Le fichier Excel a été téléchargé.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Erreur export Excel:', error);
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter les données en Excel.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Importe des données depuis JSON
   */
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onImport(data);
        
        toast({
          title: 'Import JSON réussi',
          description: 'Les données ont été importées avec succès.',
          variant: 'default',
        });
      } catch (error) {
        console.error('Erreur import JSON:', error);
        toast({
          title: 'Erreur d\'import',
          description: 'Format JSON invalide.',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = () => {
      toast({
        title: 'Erreur de lecture',
        description: 'Impossible de lire le fichier.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  /**
   * Importe des données depuis Excel
   */
  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const data = await importFromExcel(file);
      onImport(data);
      
      toast({
        title: 'Import Excel réussi',
        description: 'Les données ont été importées avec succès.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Erreur import Excel:', error);
      toast({
        title: 'Erreur d\'import',
        description: 'Impossible d\'importer le fichier Excel.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Imprime la fiche technique
   */
  const handlePrint = () => {
    window.print();
    toast({
      title: 'Impression lancée',
      description: 'La page va s\'imprimer.',
      variant: 'default',
    });
  };

  /**
   * Réinitialise toutes les données
   */
  const handleReset = () => {
    onReset();
    setShowResetDialog(false);
    
    toast({
      title: 'Données réinitialisées',
      description: 'Toutes les données ont été supprimées.',
      variant: 'default',
    });
  };

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={isProcessing}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Format d'export</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportJSON}>
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel (.xlsx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Import */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={isProcessing}>
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Format d'import</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                fileInputRef.current?.click();
                // Simuler l'attribut accept pour JSON
                if (fileInputRef.current) {
                  fileInputRef.current.accept = '.json';
                  fileInputRef.current.onchange = handleImportJSON;
                }
              }}
            >
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                fileInputRef.current?.click();
                // Simuler l'attribut accept pour Excel
                if (fileInputRef.current) {
                  fileInputRef.current.accept = '.xlsx,.xls';
                  fileInputRef.current.onchange = handleImportExcel;
                }
              }}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel (.xlsx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Imprimer */}
        <Button variant="outline" onClick={handlePrint} disabled={isProcessing}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>

        {/* Réinitialiser */}
        <Button
          variant="destructive"
          onClick={() => setShowResetDialog(true)}
          disabled={isProcessing}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={() => {}} // Géré dynamiquement
        />
      </div>

      {/* Dialog de confirmation de réinitialisation */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Confirmer la réinitialisation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est
              irréversible et supprimera toutes les informations du projet en cours.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700"
            >
              Réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

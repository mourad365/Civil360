import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, FileText, CheckCircle, Upload, AlertTriangle, Lightbulb, Loader2, Download, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { AiPlanAnalysis, Project } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function AIPlans() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileType, setFileType] = useState<string>("");
  const { toast } = useToast();

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ["/api/ai/analysis"],
    refetchInterval: 3000, // Refresh every 3 seconds for real-time progress
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/ai/upload-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/analysis"] });
      setUploadDialogOpen(false);
      toast({
        title: "Plan uploadé avec succès",
        description: "L'analyse IA va commencer automatiquement",
      });
    },
    onError: () => {
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader le plan",
        variant: "destructive",
      });
    }
  });

  const handleUpload = () => {
    if (!selectedProjectId || !fileName || !fileSize || !fileType) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      projectId: selectedProjectId,
      fileName,
      fileSize,
      fileType,
    });
  };

  const processingAnalyses = analyses.filter((a: AiPlanAnalysis) => a.status === "processing");
  const completedAnalyses = analyses.filter((a: AiPlanAnalysis) => a.status === "completed");
  const failedAnalyses = analyses.filter((a: AiPlanAnalysis) => a.status === "failed");

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">IA Analyse de Plans</h1>
            <p className="text-muted-foreground">Chargement des analyses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">IA Analyse de Plans</h1>
          <p className="text-muted-foreground">
            Traitement automatique CAO/BIM et extraction intelligente de quantités
          </p>
        </div>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-upload-new-plan">
              <Upload className="mr-2 h-4 w-4" />
              Nouveau Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uploader un Plan pour Analyse IA</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-select">Projet</Label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger data-testid="select-project">
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project: Project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="file-name">Nom du fichier</Label>
                <Input
                  id="file-name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="ex: Residence_R+3_Structure.dwg"
                  data-testid="input-file-name"
                />
              </div>

              <div>
                <Label htmlFor="file-type">Type de fichier</Label>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger data-testid="select-file-type">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dwg">DWG (AutoCAD)</SelectItem>
                    <SelectItem value="ifc">IFC (BIM)</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="rvt">RVT (Revit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-size">Taille du fichier (MB)</Label>
                <Input
                  id="file-size"
                  type="number"
                  value={fileSize || ''}
                  onChange={(e) => setFileSize(parseInt(e.target.value) * 1024 * 1024)}
                  placeholder="ex: 25"
                  data-testid="input-file-size"
                />
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={uploadMutation.isPending}
                className="w-full"
                data-testid="button-confirm-upload"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Lancer l'Analyse IA
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Processing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{processingAnalyses.length}</div>
            <div className="text-sm text-muted-foreground">En traitement</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedAnalyses.length}</div>
            <div className="text-sm text-muted-foreground">Terminées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{failedAnalyses.length}</div>
            <div className="text-sm text-muted-foreground">Échecs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">97.2%</div>
            <div className="text-sm text-muted-foreground">Précision IA moyenne</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Plans */}
        <Card className="shadow-sm border border-border">
          <CardHeader>
            <h2 className="text-xl font-bold text-foreground flex items-center">
              <Brain className="mr-2 h-5 w-5 text-blue-600" />
              Plans en Traitement
              <Badge variant="secondary" className="ml-2">{processingAnalyses.length}</Badge>
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {processingAnalyses.map((analysis: AiPlanAnalysis) => (
              <div key={analysis.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground" data-testid={`processing-plan-${analysis.id}`}>
                        {analysis.fileName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Format {analysis.fileType?.toUpperCase()} • {((analysis.fileSize || 0) / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Extraction quantités</span>
                    <span className="text-blue-600">{analysis.progress}%</span>
                  </div>
                  <Progress value={analysis.progress || 0} className="w-full" />
                </div>
                {analysis.extractedData && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <Brain className="inline mr-2 h-4 w-4" />
                      IA en cours: Détection des éléments structurels...
                    </p>
                  </div>
                )}
              </div>
            ))}

            {processingAnalyses.length === 0 && (
              <div className="border border-dashed border-border rounded-lg p-8 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Aucun plan en traitement</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Uploadez un nouveau plan pour démarrer l'analyse IA
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Plans */}
        <Card className="shadow-sm border border-border">
          <CardHeader>
            <h2 className="text-xl font-bold text-foreground flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Plans Analysés
              <Badge variant="secondary" className="ml-2">{completedAnalyses.length}</Badge>
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedAnalyses.slice(0, 5).map((analysis: AiPlanAnalysis) => (
              <div key={analysis.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-green-600 dark:text-green-400 h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground" data-testid={`completed-plan-${analysis.id}`}>
                        {analysis.fileName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Format {analysis.fileType?.toUpperCase()} • {((analysis.fileSize || 0) / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Terminé
                    </Badge>
                    <Button size="sm" variant="outline" data-testid={`button-view-results-${analysis.id}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {analysis.extractedData && (
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Béton:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {(analysis.extractedData as any)?.concrete || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Acier:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {(analysis.extractedData as any)?.steel || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Coffrage:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {(analysis.extractedData as any)?.formwork || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confiance IA:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {analysis.aiConfidence ? `${(parseFloat(analysis.aiConfidence) * 100).toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Download className="mr-1 h-3 w-3" />
                        Exporter Quantitatif
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {completedAnalyses.length === 0 && (
              <div className="border border-dashed border-border rounded-lg p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Aucune analyse terminée</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Les résultats d'analyse apparaîtront ici
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Predictions and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200">
          <CardHeader>
            <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alertes Prédictives IA
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                Risque de Dépassement Détecté
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                L'analyse des plans "Résidence Les Jardins" indique un possible dépassement 
                de 15% sur les quantités de béton par rapport au budget initial.
              </p>
              <div className="mt-3 flex space-x-2">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Ajuster Budget
                </Button>
                <Button size="sm" variant="outline" className="border-orange-600 text-orange-600">
                  Revoir Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
          <CardHeader>
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Recommandations IA
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Optimisation Matériaux
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                L'IA recommande l'utilisation de béton C25/30 au lieu de C30/37 pour 
                les éléments non-structurels, permettant une économie de 8%.
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600 text-white">
                  Économie estimée: 12,500€
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

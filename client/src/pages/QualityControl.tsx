import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, CheckCircle, AlertTriangle, Clock, Eye, Plus, FileImage, Brain, Target } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { QualityCheck, Project } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function QualityControl() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [checkType, setCheckType] = useState<string>("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();

  const { data: qualityChecks = [], isLoading } = useQuery({
    queryKey: ["/api/quality/checks"],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  const createCheckMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/quality/checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Creation failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quality/checks"] });
      setCreateDialogOpen(false);
      toast({
        title: "Contrôle qualité créé",
        description: "L'analyse IA va être lancée automatiquement",
      });
    },
    onError: () => {
      toast({
        title: "Erreur de création",
        description: "Impossible de créer le contrôle qualité",
        variant: "destructive",
      });
    }
  });

  const handleCreateCheck = () => {
    if (!selectedProject || !checkType || !location) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    // Simulate GPS coordinates
    const latitude = (48.8566 + (Math.random() - 0.5) * 0.01).toString();
    const longitude = (2.3522 + (Math.random() - 0.5) * 0.01).toString();

    createCheckMutation.mutate({
      projectId: selectedProject,
      checkType,
      location,
      latitude,
      longitude,
      notes,
      inspector: "Marc Dubois"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">✓ Conforme</Badge>;
      case "failed":
        return <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">⚠ Non-conforme</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">⏳ En attente</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getCheckTypeIcon = (type: string) => {
    switch (type) {
      case "concrete":
        return "🏗️";
      case "steel":
        return "🔩";
      case "visual":
        return "👁️";
      default:
        return "🔍";
    }
  };

  const filteredChecks = qualityChecks.filter((check: QualityCheck) => {
    const matchesStatus = filterStatus === "all" || check.status === filterStatus;
    const matchesType = filterType === "all" || check.checkType === filterType;
    return matchesStatus && matchesType;
  });

  const passedChecks = qualityChecks.filter((c: QualityCheck) => c.status === "passed").length;
  const failedChecks = qualityChecks.filter((c: QualityCheck) => c.status === "failed").length;
  const pendingChecks = qualityChecks.filter((c: QualityCheck) => c.status === "pending").length;
  const averageAiScore = qualityChecks.length > 0 
    ? qualityChecks
        .filter((c: QualityCheck) => c.aiScore)
        .reduce((sum: number, c: QualityCheck) => sum + parseFloat(c.aiScore || "0"), 0) / 
        qualityChecks.filter((c: QualityCheck) => c.aiScore).length
    : 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Camera className="h-8 w-8 animate-pulse text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contrôle Qualité</h1>
            <p className="text-muted-foreground">Chargement des contrôles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contrôle Qualité IA</h1>
          <p className="text-muted-foreground">
            Analyse automatique par Computer Vision et contrôles terrain
          </p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-create-quality-check">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Contrôle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un Contrôle Qualité</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-select">Projet</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
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
                <Label htmlFor="check-type">Type de contrôle</Label>
                <Select value={checkType} onValueChange={setCheckType}>
                  <SelectTrigger data-testid="select-check-type">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concrete">Béton</SelectItem>
                    <SelectItem value="steel">Ferraillage</SelectItem>
                    <SelectItem value="visual">Contrôle visuel</SelectItem>
                    <SelectItem value="measurement">Métrés</SelectItem>
                    <SelectItem value="safety">Sécurité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ex: Dalle R+2, Zone Nord-Est"
                  data-testid="input-location"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes / Observations</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Décrivez les éléments à contrôler..."
                  rows={3}
                  data-testid="textarea-notes"
                />
              </div>

              <Button 
                onClick={handleCreateCheck} 
                disabled={createCheckMutation.isPending}
                className="w-full"
                data-testid="button-confirm-create"
              >
                {createCheckMutation.isPending ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Créer le Contrôle
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quality Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div className="text-2xl font-bold text-green-600">{passedChecks}</div>
            </div>
            <div className="text-sm text-muted-foreground">Contrôles conformes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div className="text-2xl font-bold text-red-600">{failedChecks}</div>
            </div>
            <div className="text-sm text-muted-foreground">Non-conformités</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              <div className="text-2xl font-bold text-orange-600">{pendingChecks}</div>
            </div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Brain className="h-5 w-5 text-purple-600 mr-2" />
              <div className="text-2xl font-bold text-purple-600">{(averageAiScore * 100).toFixed(1)}%</div>
            </div>
            <div className="text-sm text-muted-foreground">Score IA moyen</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger data-testid="select-filter-status">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="passed">Conforme</SelectItem>
                  <SelectItem value="failed">Non-conforme</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger data-testid="select-filter-type">
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="concrete">Béton</SelectItem>
                  <SelectItem value="steel">Ferraillage</SelectItem>
                  <SelectItem value="visual">Contrôle visuel</SelectItem>
                  <SelectItem value="measurement">Métrés</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Brain className="mr-2 h-4 w-4 text-blue-600" />
              Computer Vision activée
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="grid" data-testid="tab-grid-view">Vue grille</TabsTrigger>
          <TabsTrigger value="analysis" data-testid="tab-analysis-view">Analyse IA</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChecks.map((check: QualityCheck) => (
              <Card key={check.id} className={cn(
                "overflow-hidden shadow-sm border transition-all hover:shadow-md",
                check.status === "failed" ? "border-red-200 bg-red-50 dark:bg-red-950" :
                check.status === "passed" ? "border-green-200 bg-green-50 dark:bg-green-950" :
                "border-border"
              )}>
                {/* Mock construction image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center relative">
                  <FileImage className="h-16 w-16 text-gray-500" />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(check.status)}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {getCheckTypeIcon(check.checkType)} {check.checkType}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h4 className="font-medium text-foreground" data-testid={`quality-check-title-${check.id}`}>
                      {check.location}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {check.createdAt ? new Date(check.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </p>
                  </div>
                  
                  {check.status === "passed" && (
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Régularité surface:</span>
                        <span className="text-green-600 font-medium">97.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conformité:</span>
                        <span className="text-green-600 font-medium">95.8%</span>
                      </div>
                    </div>
                  )}

                  {check.status === "failed" && check.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                        {check.notes}
                      </p>
                      <Button size="sm" variant="destructive" data-testid={`button-create-nonconformity-${check.id}`}>
                        Créer Non-Conformité
                      </Button>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Type: {check.checkType}</span>
                      {check.aiScore && (
                        <span className="flex items-center">
                          <Brain className="h-3 w-3 mr-1" />
                          Score IA: {(parseFloat(check.aiScore) * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {check.inspector && (
                      <div className="text-xs text-muted-foreground">
                        Inspecteur: {check.inspector}
                      </div>
                    )}
                    <Button size="sm" variant="outline" className="w-full mt-2" data-testid={`button-view-details-${check.id}`}>
                      <Eye className="mr-2 h-3 w-3" />
                      Voir Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredChecks.length === 0 && (
            <Card className="p-12 text-center">
              <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucun contrôle qualité</h3>
              <p className="text-muted-foreground">Les contrôles qualité apparaîtront ici</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Computer Vision Analysis */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
              <CardHeader>
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Analyse Computer Vision
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Détection Automatique
                  </h4>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex justify-between">
                      <span>Fissures détectées:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Défauts de surface:</span>
                      <span className="font-medium">2 mineurs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conformité dimensionnelle:</span>
                      <span className="font-medium text-green-600">97.8%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <h4 className="font-medium text-foreground mb-2">Analyse Temps Réel</h4>
                  <p className="text-sm text-muted-foreground">
                    L'IA analyse automatiquement chaque photo uploadée pour détecter les 
                    anomalies, mesurer les dimensions et comparer aux spécifications.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quality Trends */}
            <Card className="bg-green-50 dark:bg-green-950 border-green-200">
              <CardHeader>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-200 flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Tendances Qualité
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    Performance Globale
                  </h4>
                  <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <div className="flex justify-between">
                      <span>Taux de conformité:</span>
                      <span className="font-medium">92.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amélioration ce mois:</span>
                      <span className="font-medium text-green-600">+5.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contrôles automatisés:</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <h4 className="font-medium text-foreground mb-2">Recommandations IA</h4>
                  <p className="text-sm text-muted-foreground">
                    Augmenter la fréquence des contrôles béton en zones critiques. 
                    Formation recommandée sur les techniques de coulage.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

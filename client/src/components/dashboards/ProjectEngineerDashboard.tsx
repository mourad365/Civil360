import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { 
  Building2, 
  Plus,
  Calendar,
  FileText,
  Users,
  Settings,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Camera,
  Upload,
  Download,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Ruler,
  HardHat,
  ClipboardList,
  TrendingUp,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface ProjectData {
  id: string;
  name: string;
  code: string;
  status: string;
  progress: number;
  nextPhase: string;
  budget: {
    allocated: number;
    spent: number;
  };
  team: {
    projectManager: any;
    engineers: any[];
    workers: any[];
  };
  phases: Array<{
    name: string;
    status: string;
    progress: number;
    endDate: string;
  }>;
  recentActivities: Array<{
    date: string;
    description: string;
    user: string;
  }>;
}

export default function ProjectEngineerDashboard() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showDailyReport, setShowDailyReport] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const result = await api.dashboard.getProjectEngineerDashboard();
      
      if (result.error) {
        console.error('Dashboard error:', result.error);
      } else {
        setProjects(result.data.projects || []);
      }
    } catch (err: any) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-600';
      case 'in_progress': return 'bg-blue-600';
      case 'on_hold': return 'bg-yellow-600';
      case 'delayed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'delayed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Tableau de Bord - Ingénieur Projet">
      <div className={`space-y-6 ${isRTL ? 'font-arabic' : ''}`}>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mes Projets</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Cours</p>
                  <p className="text-2xl font-bold">
                    {projects.filter(p => p.status === 'in_progress').length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progression Moy.</p>
                  <p className="text-2xl font-bold">
                    {projects.length > 0 
                      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
                      : 0
                    }%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Équipes</p>
                  <p className="text-2xl font-bold">
                    {projects.reduce((sum, p) => sum + (p.team?.engineers?.length || 0) + (p.team?.workers?.length || 0), 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800">
            <TabsTrigger value="projects">Mes Projets</TabsTrigger>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="quality">Qualité</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="glass-card hover:shadow-md transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">{project.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.code}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progression</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Budget */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget utilisé:</span>
                      <span className={project.budget.spent / project.budget.allocated > 0.9 ? 'text-red-400' : 'text-green-400'}>
                        {((project.budget.spent / project.budget.allocated) * 100).toFixed(1)}%
                      </span>
                    </div>

                    {/* Next Phase */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prochaine phase:</span>
                      <span className="text-blue-400">{project.nextPhase}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedProject(project)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Rapport
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {projects.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <Building2 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-300 mb-2">Aucun projet assigné</h3>
                  <p className="text-muted-foreground mb-4">Commencez par créer votre premier projet</p>
                  <Button onClick={() => setShowCreateProject(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un projet
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Tâches à Réaliser</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Sample tasks */}
                  <div className="flex items-center gap-3 p-3 bg-white/20 border border-white/10 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <div className="flex-1">
                      <p className="font-medium">Vérification béton - Niveau 3</p>
                      <p className="text-sm text-muted-foreground">Projet Lumia Tours • Échéance: Aujourd'hui</p>
                    </div>
                    <Badge variant="outline">Haute</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/20 border border-white/10 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    <div className="flex-1">
                      <p className="font-medium">Validation plans modifiés</p>
                      <p className="text-sm text-muted-foreground">Projet Résidence Riviera • Échéance: Demain</p>
                    </div>
                    <Badge variant="outline">Moyenne</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/20 border border-white/10 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="flex-1">
                      <p className="font-medium">Réunion client - Révision budget</p>
                      <p className="text-sm text-muted-foreground">Projet Centre Commercial Axis • Échéance: 15h00</p>
                    </div>
                    <Badge variant="destructive">Critique</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Planning de la Semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                    <div key={day} className="text-center p-2 bg-slate-700 rounded text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-900/30 border border-blue-600 rounded-lg">
                    <p className="font-medium">Coulage dalle - Niveau 2</p>
                    <p className="text-sm text-muted-foreground">Mardi 9h00 - Lumia Tours</p>
                  </div>
                  <div className="p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                    <p className="font-medium">Réception matériaux</p>
                    <p className="text-sm text-muted-foreground">Mercredi 14h00 - Résidence Riviera</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Project Details Modal */}
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="max-w-4xl bg-slate-800 text-white">
              <DialogHeader>
                <DialogTitle>{selectedProject.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Informations Générales</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Code:</span> {selectedProject.code}</p>
                      <p><span className="text-muted-foreground">Statut:</span> <Badge className={getStatusColor(selectedProject.status)}>{selectedProject.status}</Badge></p>
                      <p><span className="text-muted-foreground">Progression:</span> {selectedProject.progress}%</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Budget</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Alloué:</span> {selectedProject.budget.allocated?.toLocaleString()} MAD</p>
                      <p><span className="text-muted-foreground">Utilisé:</span> {selectedProject.budget.spent?.toLocaleString()} MAD</p>
                      <Progress value={(selectedProject.budget.spent / selectedProject.budget.allocated) * 100} className="mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Create Project Modal */}
        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogContent className="bg-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Projet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom du projet</label>
                <Input className="mt-1" placeholder="Ex: Résidence Al Andalus" />
              </div>
              <div>
                <label className="text-sm font-medium">Code projet</label>
                <Input className="mt-1" placeholder="Ex: RES-2024-001" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea className="mt-1" placeholder="Description détaillée du projet..." />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowCreateProject(false)}>Créer le Projet</Button>
                <Button variant="outline" onClick={() => setShowCreateProject(false)}>Annuler</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

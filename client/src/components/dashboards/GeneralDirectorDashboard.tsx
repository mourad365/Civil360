import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { 
  Building2, 
  Euro, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  MapPin,
  Calendar,
  FileText,
  Home,
  Settings,
  Bell,
  BarChart3,
  PieChart,
  Activity,
  Truck,
  Wrench
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface DashboardData {
  kpis: {
    activeProjects: number;
    totalBudget: number;
    budgetUtilization: number;
    overallProgress: number;
    onTimePerformance: number;
    activeCollaborators: number;
    criticalAlerts: number;
  };
  interactiveMap: {
    projects: Array<{
      id: string;
      name: string;
      code: string;
      coordinates: { lat: number; lng: number };
      statusColor: string;
      progress: number;
    }>;
  };
  projectTracking: Array<{
    id: string;
    name: string;
    code: string;
    progress: number;
    budgetUsage: number;
    daysRemaining: number;
    openRisks: number;
  }>;
  financialAnalysis: {
    budgetBreakdown: {
      labor: { amount: number; percentage: number };
      materials: { amount: number; percentage: number };
      equipment: { amount: number; percentage: number };
      contingency: { amount: number; percentage: number };
    };
  };
  resourceManagement: {
    equipment: {
      total: number;
      available: number;
      inUse: number;
      maintenance: number;
      avgUtilization: number;
    };
  };
  strategicCalendar: {
    projectDeadlines: Array<{
      name: string;
      dates: { endDate: string };
    }>;
    deliveries: Array<{
      orderNumber: string;
      dates: { expectedDelivery: string };
      project: { name: string };
    }>;
  };
  notificationsCenter: {
    notifications: Array<{
      id: string;
      title: string;
      type: string;
      priority: string;
      createdAt: string;
    }>;
    summary: {
      unread: number;
      urgent: number;
      warning: number;
      info: number;
    };
  };
}

export default function GeneralDirectorDashboard() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const result = await api.dashboard.getGeneralDirectorDashboard();
      
      if (result.error) {
        setError(result.error);
      } else {
        setDashboardData(result.data.dashboard);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const pieChartColors = ['#3B82F6', '#10B981', '#3B82F6', '#EF4444'];

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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-destructive">Erreur: {error}</p>
          <Button onClick={loadDashboardData} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <DashboardLayout title="Tableau de Bord - Directeur Général">
      <div className={`space-y-6 ${isRTL ? 'font-arabic' : ''}`}>
        {/* Hero Section */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Badge className="mb-4 bg-primary text-primary-foreground">
                  {t('dashboard.dg.title')}
                </Badge>
                <h1 className="text-3xl font-bold mb-3">
                  {t('dashboard.dg.subtitle')}
                </h1>
                <p className="text-muted-foreground mb-4">
                  Centraliser l'information • Synchroniser les actions • Optimiser les ressources
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-600">Réduction délais ≤ 15%</Badge>
                  <Badge className="bg-green-600">Dépassements budget ↓ 20%</Badge>
                  <Badge className="bg-blue-600">Visibilité temps réel</Badge>
                </div>
              </div>

              {/* KPIs Summary */}
              <Card className="bg-white/50 border-white/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">{t('dashboard.dg.kpis.title')}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('dashboard.dg.projects_active')}</p>
                      <p className="text-2xl font-bold">{dashboardData.kpis.activeProjects}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('dashboard.dg.global_budget')}</p>
                      <p className="text-lg font-bold">{formatCurrency(dashboardData.kpis.totalBudget)}</p>
                      <p className="text-muted-foreground">({dashboardData.kpis.budgetUtilization}%)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('dashboard.dg.overall_progress')}</p>
                      <Progress value={dashboardData.kpis.overallProgress} className="mt-1" />
                      <p className="text-sm text-muted-foreground">{dashboardData.kpis.overallProgress}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('dashboard.dg.active_collaborators')}</p>
                      <p className="text-2xl font-bold">{dashboardData.kpis.activeCollaborators}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="financial">Finance</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
            <TabsTrigger value="equipment">Équipements</TabsTrigger>
            <TabsTrigger value="purchasing">Achats</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KPI Cards */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-400" />
                    Projets Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.kpis.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">+2 ce mois</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Euro className="h-4 w-4 text-green-400" />
                    Budget Global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData.kpis.totalBudget)}</div>
                  <div className="flex items-center">
                    <Progress value={dashboardData.kpis.budgetUtilization} className="flex-1 mr-2" />
                    <span className="text-xs text-muted-foreground">{dashboardData.kpis.budgetUtilization}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    Performance Délais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.kpis.onTimePerformance}%</div>
                  <p className="text-xs text-green-400">+5% vs mois dernier</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    Alertes Critiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.kpis.criticalAlerts}</div>
                  <p className="text-xs text-muted-foreground">Nécessitent attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Breakdown Pie Chart */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-400" />
                    Répartition Budgétaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Main d\'œuvre', value: dashboardData.financialAnalysis.budgetBreakdown.labor.percentage },
                          { name: 'Matériaux', value: dashboardData.financialAnalysis.budgetBreakdown.materials.percentage },
                          { name: 'Équipements', value: dashboardData.financialAnalysis.budgetBreakdown.equipment.percentage },
                          { name: 'Imprévus', value: dashboardData.financialAnalysis.budgetBreakdown.contingency.percentage }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }: { name: string; value: number }) => `${name}: ${value.toFixed(1)}%`}
                      >
                        {[0, 1, 2, 3].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Equipment Status Chart */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    État des Équipements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={[
                        { name: 'Disponible', value: dashboardData.resourceManagement.equipment.available },
                        { name: 'En Usage', value: dashboardData.resourceManagement.equipment.inUse },
                        { name: 'Maintenance', value: dashboardData.resourceManagement.equipment.maintenance }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Suivi Détaillé des Projets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.projectTracking.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-white/20 rounded-lg border border-white/10">
                      <div className="flex-1">
                        <h4 className="font-semibold">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.code}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progression</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} />
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Budget: </span>
                            <span className={project.budgetUsage > 90 ? 'text-red-400' : 'text-green-400'}>
                              {project.budgetUsage}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={project.daysRemaining < 0 ? "destructive" : project.daysRemaining < 7 ? "outline" : "default"}>
                          {project.daysRemaining < 0 ? 'En retard' : `${project.daysRemaining}j restants`}
                        </Badge>
                        {project.openRisks > 0 && (
                          <Badge variant="outline" className="text-blue-500">
                            {project.openRisks} risques
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

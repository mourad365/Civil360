import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { 
  Truck, 
  Plus,
  Settings,
  MapPin,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Eye,
  Edit,
  ArrowLeftRight,
  Battery,
  Gauge,
  Map
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
  Cell
} from 'recharts';

interface EquipmentData {
  id: string;
  name: string;
  code: string;
  type: string;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_order' | 'transferred';
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    currentProject: { name: string; code: string };
  };
  utilization: {
    utilizationRate: number;
    hoursUsed: number;
    totalHours: number;
  };
  maintenance: {
    nextMaintenance?: string;
    lastMaintenance?: string;
  };
  rental?: {
    monthlyRate: number;
    supplier: { name: string };
  };
}

interface DashboardStats {
  overview: {
    total: number;
    available: number;
    inUse: number;
    maintenance: number;
    avgUtilization: number;
  };
  breakdown: {
    byStatus: Array<{ _id: string; count: number }>;
    byType: Array<{ _id: string; count: number }>;
  };
  maintenance: {
    upcomingCount: number;
    alerts: EquipmentData[];
  };
  rental: {
    monthlyTotal: number;
    equipmentCount: number;
  };
}

export default function EquipmentManagementDashboard() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [equipment, setEquipment] = useState<EquipmentData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load equipment list
      const equipmentResult = await api.equipment.getEquipment({
        limit: 50
      });
      
      // Load dashboard stats
      const statsResult = await api.equipment.getEquipmentDashboard();

      if (!equipmentResult.error) {
        setEquipment(equipmentResult.data.equipment || []);
      }
      
      if (!statsResult.error) {
        setDashboardStats(statsResult.data.dashboard);
      }
    } catch (err: any) {
      console.error('Equipment dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-600';
      case 'in_use': return 'bg-blue-600';
      case 'maintenance': return 'bg-yellow-600';
      case 'out_of_order': return 'bg-red-600';
      case 'transferred': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle2 className="h-4 w-4" />;
      case 'in_use': return <Activity className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'out_of_order': return <AlertTriangle className="h-4 w-4" />;
      case 'transferred': return <ArrowLeftRight className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getEquipmentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'crane': return 'GRUE';
      case 'excavator': return 'PELL';
      case 'truck': return 'CAM';
      case 'compactor': return 'COMP';
      case 'mixer': return 'MIX';
      default: return 'EQP';
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pieColors = ['#10B981', '#3B82F6', '#3B82F6', '#EF4444', '#8B5CF6'];

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
    <DashboardLayout title="Gestion des Équipements - Logistique">
      <div className={`space-y-6 ${isRTL ? 'font-arabic' : ''}`}>
        {/* KPI Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Équipements</p>
                    <p className="text-2xl font-bold">{dashboardStats.overview.total}</p>
                  </div>
                  <Truck className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Disponibles</p>
                    <p className="text-2xl font-bold text-green-400">{dashboardStats.overview.available}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En Utilisation</p>
                    <p className="text-2xl font-bold text-blue-400">{dashboardStats.overview.inUse}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                    <p className="text-2xl font-bold text-yellow-400">{dashboardStats.overview.maintenance}</p>
                  </div>
                  <Wrench className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Utilisation Moy.</p>
                    <p className="text-2xl font-bold">{Math.round(dashboardStats.overview.avgUtilization)}%</p>
                  </div>
                  <Gauge className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="equipment">Équipements</TabsTrigger>
            <TabsTrigger value="transfers">Transferts</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="rental">Locations</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Répartition par Statut
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardStats?.breakdown.byStatus && (
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <Pie
                          data={dashboardStats.breakdown.byStatus.map(item => ({
                            name: item._id,
                            value: item.count
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {dashboardStats.breakdown.byStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Type Distribution */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-400" />
                    Répartition par Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardStats?.breakdown.byType && (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={dashboardStats.breakdown.byType.map(item => ({
                        name: item._id,
                        value: item.count
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Maintenance Alerts */}
            {dashboardStats?.maintenance.alerts && dashboardStats.maintenance.alerts.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    Alertes Maintenance ({dashboardStats.maintenance.upcomingCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardStats.maintenance.alerts.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                        <Wrench className="h-5 w-5 text-yellow-400" />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.location?.currentProject?.name} • 
                            Maintenance due: {item.maintenance.nextMaintenance ? new Date(item.maintenance.nextMaintenance).toLocaleDateString() : 'Non programmée'}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Programmer
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un équipement..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 bg-white/20 border border-white/10 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="available">Disponible</option>
                <option value="in_use">En utilisation</option>
                <option value="maintenance">En maintenance</option>
                <option value="out_of_order">Hors service</option>
              </select>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEquipment.map((item) => (
                <Card key={item.id} className="glass-card hover:shadow-md transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getEquipmentTypeIcon(item.type)}</span>
                        <div>
                          <CardTitle className="text-base">{item.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{item.code}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {item.location?.currentProject?.name || item.location?.address || 'Non assigné'}
                      </span>
                    </div>

                    {/* Utilization */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Utilisation</span>
                        <span>{item.utilization?.utilizationRate || 0}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.utilization?.utilizationRate || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Rental Info */}
                    {item.rental && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="text-blue-500">{item.rental.monthlyRate} MAD/mois</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedEquipment(item)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
        </Tabs>

        {/* Equipment Details Modal */}
        {selectedEquipment && (
          <Dialog open={!!selectedEquipment} onOpenChange={() => setSelectedEquipment(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getEquipmentTypeIcon(selectedEquipment.type)}</span>
                  {selectedEquipment.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations Générales</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Code:</span> {selectedEquipment.code}</p>
                      <p><span className="text-muted-foreground">Type:</span> {selectedEquipment.type}</p>
                      <p><span className="text-muted-foreground">Statut:</span> 
                        <Badge className={`ml-2 ${getStatusColor(selectedEquipment.status)}`}>
                          {selectedEquipment.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Localisation</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Projet:</span> {selectedEquipment.location?.currentProject?.name || 'Non assigné'}</p>
                      <p><span className="text-muted-foreground">Adresse:</span> {selectedEquipment.location?.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Utilisation</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Taux d'utilisation:</span> {selectedEquipment.utilization?.utilizationRate || 0}%</p>
                      <p><span className="text-muted-foreground">Heures utilisées:</span> {selectedEquipment.utilization?.hoursUsed || 0}h</p>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${selectedEquipment.utilization?.utilizationRate || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Maintenance</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Dernière:</span> {
                        selectedEquipment.maintenance?.lastMaintenance 
                          ? new Date(selectedEquipment.maintenance.lastMaintenance).toLocaleDateString()
                          : 'Aucune'
                      }</p>
                      <p><span className="text-muted-foreground">Prochaine:</span> {
                        selectedEquipment.maintenance?.nextMaintenance 
                          ? new Date(selectedEquipment.maintenance.nextMaintenance).toLocaleDateString()
                          : 'Non programmée'
                      }</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}

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
  ShoppingCart, 
  Plus,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  Search,
  Eye,
  Edit,
  FileText,
  Star,
  Truck as DeliveryTruck,
  DollarSign,
  BarChart3
} from "lucide-react";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  project: { name: string; code: string };
  supplier: { name: string };
  status: string;
  priority: string;
  dates: {
    created: string;
    expectedDelivery: string;
  };
  financial: {
    totalAmount: number;
  };
}

interface DashboardStats {
  overview: {
    totalOrders: number;
    monthlyOrders: number;
    monthlyBudget: number;
    pendingApproval: number;
    overdueDelveries: number;
    onTimeDeliveryRate: number;
  };
}

export default function PurchasingManagementDashboard() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const ordersResult = await api.purchasing.getPurchaseOrders({
        limit: 50
      });
      
      const statsResult = await api.purchasing.getPurchasingDashboard();

      if (!ordersResult.error) {
        setOrders(ordersResult.data.orders || []);
      }
      
      if (!statsResult.error) {
        setDashboardStats(statsResult.data.dashboard);
      }
    } catch (err: any) {
      console.error('Purchasing dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'approved': return 'bg-blue-600';
      case 'pending_approval': return 'bg-yellow-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Gestion des Achats - Directeur Achats">
      <div className={`space-y-6 ${isRTL ? 'font-arabic' : ''}`}>
        {/* KPI Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{dashboardStats.overview.totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ce Mois</p>
                    <p className="text-2xl font-bold text-green-400">{dashboardStats.overview.monthlyOrders}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-lg font-bold text-blue-400">
                      {formatCurrency(dashboardStats.overview.monthlyBudget)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En Attente</p>
                    <p className="text-2xl font-bold text-yellow-400">{dashboardStats.overview.pendingApproval}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En Retard</p>
                    <p className="text-2xl font-bold text-red-400">{dashboardStats.overview.overdueDelveries}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">À l'heure</p>
                    <p className="text-2xl font-bold text-green-400">{dashboardStats.overview.onTimeDeliveryRate}%</p>
                  </div>
                  <DeliveryTruck className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
            <TabsTrigger value="deliveries">Livraisons</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Aperçu des Achats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">{orders.length}</p>
                    <p className="text-muted-foreground">Commandes actives</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">
                      {formatCurrency(orders.reduce((sum, order) => sum + order.financial.totalAmount, 0))}
                    </p>
                    <p className="text-muted-foreground">Valeur totale</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">15</p>
                    <p className="text-muted-foreground">Fournisseurs actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une commande..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {orders.filter(order => 
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.project.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((order) => (
                <Card key={order.id} className="glass-card hover:shadow-md transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.project.name}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fournisseur:</span>
                      <span>{order.supplier.name}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Montant:</span>
                      <span className="font-medium text-green-400">
                        {formatCurrency(order.financial.totalAmount)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison:</span>
                      <span>{new Date(order.dates.expectedDelivery).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Order Details Modal */}
        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Commande {selectedOrder.orderNumber}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Projet:</p>
                    <p className="font-medium">{selectedOrder.project.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fournisseur:</p>
                    <p className="font-medium">{selectedOrder.supplier.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Montant:</p>
                    <p className="font-medium text-green-400">{formatCurrency(selectedOrder.financial.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Livraison prévue:</p>
                    <p className="font-medium">{new Date(selectedOrder.dates.expectedDelivery).toLocaleDateString('fr-FR')}</p>
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

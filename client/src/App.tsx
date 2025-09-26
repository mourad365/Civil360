import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth, withAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import RoleSelector from "@/components/RoleSelector";
import Dashboard from "@/pages/Dashboard";
import DirectorGeneralDashboard from "@/pages/DirectorGeneralDashboard";
import EnhancedGeneralDirectorDashboard from "@/components/dashboards/GeneralDirectorDashboard";
import ProjectEngineerDashboard from "@/components/dashboards/ProjectEngineerDashboard";
import EquipmentManagementDashboard from "@/components/dashboards/EquipmentManagementDashboard";
import PurchasingManagementDashboard from "@/components/dashboards/PurchasingManagementDashboard";
import EngineerDashboard from "@/pages/EngineerDashboard";
import PurchaseDirectorDashboard from "@/pages/PurchaseDirectorDashboard";
import LogisticsDirectorDashboard from "@/pages/LogisticsDirectorDashboard";
import Projects from "@/pages/Projects";
import AIPlans from "@/pages/AIPlans";
import IoTEquipment from "@/pages/IoTEquipment";
import QualityControl from "@/pages/QualityControl";
import MobileInterface from "@/pages/MobileInterface";
import OdooIntegration from "@/pages/OdooIntegration";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  const handleRoleSelect = (role: any) => {
    window.location.href = role.path;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-construction-steel border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Chargement de Civil360...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Login Route - Public */}
      <Route path="/login" component={Login} />
      
      {/* Root redirect */}
      <Route path="/">
        {() => isAuthenticated ? <RoleSelector onRoleSelect={handleRoleSelect} /> : <Redirect to="/login" />}
      </Route>
      
      {/* Protected Routes - New Enhanced Dashboards */}
      <Route path="/dashboard/dg" component={withAuth(EnhancedGeneralDirectorDashboard)} />
      <Route path="/dashboard/engineer" component={withAuth(ProjectEngineerDashboard)} />
      <Route path="/dashboard/equipment" component={withAuth(EquipmentManagementDashboard)} />
      <Route path="/dashboard/purchasing" component={withAuth(PurchasingManagementDashboard)} />
      
      {/* Legacy Dashboard Routes */}
      <Route path="/dashboard/dg-legacy" component={withAuth(DirectorGeneralDashboard)} />
      <Route path="/dashboard/engineer-legacy" component={withAuth(EngineerDashboard)} />
      <Route path="/dashboard/purchase" component={withAuth(PurchaseDirectorDashboard)} />
      <Route path="/dashboard/logistics" component={withAuth(LogisticsDirectorDashboard)} />
      
      {/* Legacy routes with Layout - Protected */}
      <Route path="/dashboard" component={withAuth(() => 
        <Layout>
          <Dashboard />
        </Layout>
      )} />
      <Route path="/chantiers" component={withAuth(() => 
        <Layout>
          <Projects />
        </Layout>
      )} />
      <Route path="/ai-plans" component={withAuth(() => 
        <Layout>
          <AIPlans />
        </Layout>
      )} />
      <Route path="/iot" component={withAuth(() => 
        <Layout>
          <IoTEquipment />
        </Layout>
      )} />
      <Route path="/quality" component={withAuth(() => 
        <Layout>
          <QualityControl />
        </Layout>
      )} />
      <Route path="/mobile" component={withAuth(() => 
        <Layout>
          <MobileInterface />
        </Layout>
      )} />
      <Route path="/odoo" component={withAuth(() => 
        <Layout>
          <OdooIntegration />
        </Layout>
      )} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

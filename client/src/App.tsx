import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import AIPlans from "@/pages/AIPlans";
import IoTEquipment from "@/pages/IoTEquipment";
import QualityControl from "@/pages/QualityControl";
import MobileInterface from "@/pages/MobileInterface";
import OdooIntegration from "@/pages/OdooIntegration";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/chantiers" component={Projects} />
        <Route path="/ai-plans" component={AIPlans} />
        <Route path="/iot" component={IoTEquipment} />
        <Route path="/quality" component={QualityControl} />
        <Route path="/mobile" component={MobileInterface} />
        <Route path="/odoo" component={OdooIntegration} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

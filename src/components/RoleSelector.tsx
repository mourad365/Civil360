import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Calculator, ShoppingCart, Truck } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const roles: Role[] = [
  {
    id: "dg",
    name: "Directeur Général",
    description: "Vision complète et pilotage stratégique",
    icon: <Crown className="h-8 w-8" />,
    path: "/dashboard"
  },
  {
    id: "engineer",
    name: "Ingénieur",
    description: "Gestion technique et calculs structurels",
    icon: <Calculator className="h-8 w-8" />,
    path: "/dashboard"
  },
  {
    id: "purchase",
    name: "Directeur Achat",
    description: "Approvisionnements et fournisseurs",
    icon: <ShoppingCart className="h-8 w-8" />,
    path: "/dashboard"
  },
  {
    id: "logistics",
    name: "Directeur Logistique",
    description: "Équipements et maintenance",
    icon: <Truck className="h-8 w-8" />,
    path: "/dashboard"
  }
];

interface RoleSelectorProps {
  onRoleSelect: (role: Role) => void;
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">CIVIL360</h1>
          <p className="text-xl text-muted-foreground">
            Plateforme intégrée de gestion des projets de génie civil
          </p>
          <div className="mt-4 space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Réduction délais ≤ 15%
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Dépassements budget ↓ 20%
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Visibilité temps réel
            </span>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">Le Défi : une gestion fragmentée</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>🧩 Données éparpillées (emails, Excel, papiers)</li>
                  <li>🙈 Décisions en aveugle (peu de temps réel)</li>
                  <li>💸 Gaspillage des ressources (surstock/ruptures)</li>
                  <li>📅 Délais & coûts imprévisibles</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">La Solution : un écosystème unifié</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✅ Une seule source de vérité</li>
                  <li>🤖 Automatisation des calculs & processus</li>
                  <li>👁️ Visibilité en temps réel & alertes</li>
                  <li>⚡ Optimisation intelligente des ressources</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold text-center mb-6">Choisissez votre rôle</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 w-fit group-hover:scale-110 transition-transform">
                  {role.icon}
                </div>
                <CardTitle className="text-xl">{role.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => onRoleSelect(role)}
                >
                  Accéder au tableau de bord
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, Loader2, Lock, User } from "lucide-react";

export default function Login() {
  const [location, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("civil360_token", data.token);
        localStorage.setItem("civil360_user", JSON.stringify(data.user));
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.user.name}!`,
        });

        // Redirect based on user role
        switch (data.user.role) {
          case "Chef d'Exécution":
            setLocation("/dashboard/dg");
            break;
          case "Ingénieur":
            setLocation("/dashboard/engineer");
            break;
          case "Chef de Chantier":
            setLocation("/dashboard");
            break;
          default:
            setLocation("/dashboard");
        }
      } else {
        throw new Error(data.error || "Erreur de connexion");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUsername("marc.dubois");
    setPassword("password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-construction-steel/10 via-background to-construction-orange/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-construction-steel rounded-2xl mb-4 shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-construction-steel to-construction-orange bg-clip-text text-transparent">
            Civil360
          </h1>
          <p className="text-muted-foreground text-lg">
            Plateforme Intégrée de Gestion
          </p>
        </div>

        <Card className="construction-card shadow-2xl border border-border/50 backdrop-blur-sm bg-card/90">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              Connexion
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Accédez à votre espace de gestion de chantier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold">
                  Nom d'utilisateur
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="marc.dubois"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 border-border/50 focus:border-construction-steel focus:ring-construction-steel/20"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-border/50 focus:border-construction-steel focus:ring-construction-steel/20"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-construction-steel hover:bg-construction-steel/90 text-white font-semibold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Mode démo
                  </span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-construction-orange text-construction-orange hover:bg-construction-orange/10"
                onClick={handleDemoLogin}
              >
                Utiliser le compte de démonstration
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Comptes de test disponibles:</p>
              <div className="mt-2 space-y-1 text-xs">
                <p><strong>marc.dubois</strong> - Chef d'Exécution</p>
                <p>Mot de passe: <strong>password</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          © 2024 Civil360 - Solution de Gestion de Chantiers BTP
        </div>
      </div>
    </div>
  );
}

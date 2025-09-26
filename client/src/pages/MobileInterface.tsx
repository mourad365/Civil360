import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, HardHat, Camera, ClipboardCheck, Package, AlertTriangle, 
  Wifi, WifiOff, MapPin, Mic, Shield, RefreshCw, Download, QrCode,
  Battery, Sun, CloudRain, ThermometerSun, Users
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function MobileInterface() {
  const [selectedDevice, setSelectedDevice] = useState("tablet");
  const [offlineMode, setOfflineMode] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temp: 18,
    condition: "cloudy",
    humidity: 65
  });
  const { toast } = useToast();

  const toggleOfflineMode = () => {
    setOfflineMode(!offlineMode);
    toast({
      title: offlineMode ? "Mode en ligne activé" : "Mode hors ligne activé",
      description: offlineMode ? "Synchronisation avec le serveur active" : "Fonctionnement autonome activé",
    });
  };

  const handleMobileAction = (action: string) => {
    toast({
      title: `Action mobile: ${action}`,
      description: "Fonctionnalité optimisée pour les conditions de chantier",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interface Mobile Terrain</h1>
          <p className="text-muted-foreground">
            Application rugueuse optimisée pour les conditions de chantier
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={toggleOfflineMode}
            variant={offlineMode ? "destructive" : "default"}
            data-testid="button-toggle-offline"
          >
            {offlineMode ? <WifiOff className="mr-2 h-4 w-4" /> : <Wifi className="mr-2 h-4 w-4" />}
            {offlineMode ? "Mode Hors Ligne" : "Mode En Ligne"}
          </Button>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Smartphone className="mr-2 h-4 w-4" />
            PWA Ready
          </Badge>
        </div>
      </div>

      {/* Mobile Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <div className="text-2xl font-bold text-blue-600">47</div>
            </div>
            <div className="text-sm text-muted-foreground">Utilisateurs mobiles actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <RefreshCw className="h-5 w-5 text-orange-600 mr-2" />
              <div className="text-2xl font-bold text-orange-600">127</div>
            </div>
            <div className="text-sm text-muted-foreground">Actions en attente de sync</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Battery className="h-5 w-5 text-green-600 mr-2" />
              <div className="text-2xl font-bold text-green-600">89%</div>
            </div>
            <div className="text-sm text-muted-foreground">Autonomie moyenne</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 text-purple-600 mr-2" />
              <div className="text-2xl font-bold text-purple-600">100%</div>
            </div>
            <div className="text-sm text-muted-foreground">Résistance conditions</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="preview" data-testid="tab-preview">Aperçu</TabsTrigger>
          <TabsTrigger value="features" data-testid="tab-features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="offline" data-testid="tab-offline">Mode Offline</TabsTrigger>
          <TabsTrigger value="hardware" data-testid="tab-hardware">Matériel</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Selector */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-foreground">Type d'appareil</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant={selectedDevice === "phone" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedDevice("phone")}
                    data-testid="button-select-phone"
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    Smartphone (5.8")
                  </Button>
                  <Button 
                    variant={selectedDevice === "tablet" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedDevice("tablet")}
                    data-testid="button-select-tablet"
                  >
                    <Smartphone className="mr-2 h-4 w-4 rotate-90" />
                    Tablette rugueuse (10.1")
                  </Button>
                </CardContent>
              </Card>

              {/* Weather Widget */}
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                <CardHeader>
                  <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 flex items-center">
                    {weatherData.condition === "sunny" ? <Sun className="mr-2 h-5 w-5" /> : <CloudRain className="mr-2 h-5 w-5" />}
                    Conditions Chantier
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-blue-700 dark:text-blue-300">
                    <div className="flex items-center justify-between">
                      <span>Température:</span>
                      <span className="font-medium flex items-center">
                        <ThermometerSun className="mr-1 h-4 w-4" />
                        {weatherData.temp}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Humidité:</span>
                      <span className="font-medium">{weatherData.humidity}%</span>
                    </div>
                    <div className="text-xs mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded">
                      ✓ Conditions favorables pour travaux extérieurs
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Device Mockup */}
            <div className="lg:col-span-2">
              <div className={cn(
                "mx-auto bg-gray-900 rounded-3xl p-2 shadow-xl transition-all",
                selectedDevice === "phone" ? "w-72 h-[600px]" : "w-96 h-[500px]"
              )}>
                <div className="w-full h-full bg-background rounded-2xl overflow-hidden flex flex-col">
                  {/* Mobile Header */}
                  <div className="bg-primary p-4 text-primary-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <HardHat className="h-4 w-4" />
                        <span className="font-bold">CIVIL360</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          offlineMode ? "bg-red-400 animate-pulse" : "bg-green-400"
                        )}></div>
                        <span className="text-xs">
                          {offlineMode ? 'Hors ligne' : 'En ligne'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm opacity-90">Chantier: Résidence Les Jardins</p>
                      <div className="flex items-center space-x-1 text-xs">
                        <Battery className="h-3 w-3" />
                        <span>89%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Content */}
                  <div className="flex-1 p-4 space-y-4 bg-background">
                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        className="bg-card border border-border p-4 rounded-lg text-center touch-target hover:bg-muted transition-colors" 
                        onClick={() => handleMobileAction("Photo Qualité")}
                        data-testid="mobile-button-photo"
                      >
                        <Camera className="text-2xl text-primary mb-2 mx-auto h-6 w-6" />
                        <p className="text-xs font-medium">Photo Qualité</p>
                      </button>
                      <button 
                        className="bg-card border border-border p-4 rounded-lg text-center touch-target hover:bg-muted transition-colors" 
                        onClick={() => handleMobileAction("Check-lists")}
                        data-testid="mobile-button-checklist"
                      >
                        <ClipboardCheck className="text-2xl text-green-600 mb-2 mx-auto h-6 w-6" />
                        <p className="text-xs font-medium">Check-lists</p>
                      </button>
                      <button 
                        className="bg-card border border-border p-4 rounded-lg text-center touch-target hover:bg-muted transition-colors" 
                        onClick={() => handleMobileAction("Réception")}
                        data-testid="mobile-button-reception"
                      >
                        <Package className="text-2xl text-orange-600 mb-2 mx-auto h-6 w-6" />
                        <p className="text-xs font-medium">Réception</p>
                      </button>
                      <button 
                        className="bg-card border border-border p-4 rounded-lg text-center touch-target hover:bg-muted transition-colors" 
                        onClick={() => handleMobileAction("Incident")}
                        data-testid="mobile-button-incident"
                      >
                        <AlertTriangle className="text-2xl text-red-600 mb-2 mx-auto h-6 w-6" />
                        <p className="text-xs font-medium">Incident</p>
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-muted rounded-lg p-3 space-y-2">
                      <h4 className="font-medium text-sm">État du chantier</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Équipes:</span>
                          <span className="font-medium">12 actives</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Sécurité:</span>
                          <span className="font-medium text-green-600">Conforme</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sync Status */}
                    <div className={cn(
                      "border rounded-lg p-3 transition-colors",
                      offlineMode 
                        ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200" 
                        : "bg-green-50 dark:bg-green-950 border-green-200"
                    )}>
                      <div className="flex items-center space-x-2">
                        {offlineMode ? (
                          <>
                            <RefreshCw className="text-yellow-600 h-4 w-4" />
                            <span className="text-sm text-yellow-800 dark:text-yellow-200">
                              3 éléments en attente de sync
                            </span>
                          </>
                        ) : (
                          <>
                            <Wifi className="text-green-600 h-4 w-4" />
                            <span className="text-sm text-green-800 dark:text-green-200">
                              Synchronisé • Temps réel
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Voice Command */}
                    <button className="w-full bg-primary text-primary-foreground p-3 rounded-lg flex items-center justify-center space-x-2 touch-target">
                      <Mic className="h-4 w-4" />
                      <span className="text-sm font-medium">Commande vocale</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground flex items-center">
                  <WifiOff className="mr-2 h-5 w-5 text-blue-600" />
                  Mode Hors-ligne
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Fonctionnement complet sans connexion réseau avec synchronisation automatique.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Saisie de données complète</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Prise de photos géolocalisées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Enregistrement vocal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-green-600" />
                  Géolocalisation
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Toutes les saisies sont automatiquement géolocalisées avec précision GPS.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>GPS haute précision (±1m)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Cartographie offline</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Zones de géofencing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground flex items-center">
                  <Mic className="mr-2 h-5 w-5 text-purple-600" />
                  Saisie Vocale
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Dictée de rapports avec gants et équipements de protection individuelle.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Reconnaissance vocale optimisée</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Filtrage bruit ambiant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Commandes vocales rapides</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-orange-600" />
                  Interface Robuste
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Résistante aux conditions météo et manipulations avec équipements de protection.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Étanchéité IP67</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Écran haute luminosité</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Boutons tactiles larges</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground flex items-center">
                  <QrCode className="mr-2 h-5 w-5 text-indigo-600" />
                  Scan & NFC
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Scanner QR codes et étiquettes NFC pour identification rapide.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Scan QR codes équipements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Étiquettes NFC matériaux</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Identification personnel</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground flex items-center">
                  <Camera className="mr-2 h-5 w-5 text-pink-600" />
                  Photo Intelligente
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Photos automatiquement analysées par IA avec métadonnées complètes.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Analyse qualité automatique</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Horodatage et géolocalisation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Compression et stockage optimisés</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offline">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200">
              <CardHeader>
                <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200 flex items-center">
                  <WifiOff className="mr-2 h-5 w-5" />
                  Fonctionnement Autonome
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-orange-700 dark:text-orange-300 text-sm">
                  L'application continue de fonctionner même sans connexion réseau, 
                  stockant toutes les données localement.
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 text-sm mb-2">
                      Capacités hors ligne
                    </h4>
                    <div className="space-y-1 text-xs text-orange-700 dark:text-orange-300">
                      <div>✓ Création de contrôles qualité</div>
                      <div>✓ Prise de photos géolocalisées</div>
                      <div>✓ Remplissage de check-lists</div>
                      <div>✓ Signalement d'incidents</div>
                      <div>✓ Enregistrements vocaux</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-medium text-foreground text-sm mb-2">
                      Synchronisation intelligente
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Dès que la connexion est rétablie, toutes les données sont automatiquement 
                      synchronisées avec le serveur central.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
              <CardHeader>
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Gestion des Conflits
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Résolution automatique des conflits de données lors de la synchronisation 
                  avec plusieurs utilisateurs.
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2">
                      Stratégies de résolution
                    </h4>
                    <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                      <div>• Horodatage pour priorité temporelle</div>
                      <div>• Validation croisée des géolocalisations</div>
                      <div>• Merge intelligent des modifications</div>
                      <div>• Alertes pour conflits critiques</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-medium text-foreground text-sm mb-2">
                      Performance optimisée
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Synchronisation par batch et compression des données pour 
                      minimiser l'utilisation de la bande passante.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hardware">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground">Tablettes Rugueuses Recommandées</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Panasonic Toughpad FZ-G2</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Écran: 10.1" Full HD</div>
                      <div>Étanchéité: IP65</div>
                      <div>Batterie: 12h</div>
                      <div>Température: -10°C à +50°C</div>
                      <div>Résistance: Chutes 1.2m</div>
                      <div>GPS: Intégré haute précision</div>
                    </div>
                    <div className="mt-2">
                      <Badge className="bg-green-100 text-green-800">Recommandé</Badge>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Samsung Galaxy Tab Active4 Pro</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Écran: 10.1" FHD+</div>
                      <div>Étanchéité: IP68</div>
                      <div>Batterie: Amovible</div>
                      <div>Température: -20°C à +63°C</div>
                      <div>S Pen: Inclus</div>
                      <div>NFC: Oui</div>
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary">Alternative</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground">Accessoires & Installation</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground text-sm mb-2">Support véhicule</h4>
                    <p className="text-xs text-muted-foreground">
                      Fixation robuste pour utilisation dans les véhicules de chantier
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground text-sm mb-2">Sangle sécurisée</h4>
                    <p className="text-xs text-muted-foreground">
                      Sangle anti-chute pour travail en hauteur
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground text-sm mb-2">Station de charge</h4>
                    <p className="text-xs text-muted-foreground">
                      Station multi-tablettes pour bureau de chantier
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground text-sm mb-2">Protection écran</h4>
                    <p className="text-xs text-muted-foreground">
                      Film protecteur anti-rayures et anti-reflets
                    </p>
                  </div>
                </div>
                
                <Button className="w-full" data-testid="button-download-specs">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger Spécifications Complètes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardHat, Camera, ClipboardCheck, Package, AlertTriangle, Wifi, WifiOff, MapPin, Mic, Shield, RefreshCw } from "lucide-react";

interface MobilePreviewProps {
  offlineMode?: boolean;
}

export default function MobilePreview({ offlineMode = false }: MobilePreviewProps) {
  return (
    <Card className="shadow-sm border border-border">
      <CardHeader className="border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Interface Mobile Terrain</h2>
        <p className="text-sm text-muted-foreground">
          Application optimisée pour conditions de chantier avec mode hors-ligne
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mobile Device Mockup */}
          <div className="lg:col-span-1">
            <div className="mx-auto w-72 h-96 bg-gray-900 rounded-3xl p-2 shadow-xl">
              <div className="w-full h-full bg-background rounded-2xl overflow-hidden">
                {/* Mobile Header */}
                <div className="bg-primary p-4 text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HardHat className="h-4 w-4" />
                      <span className="font-bold">CIVIL360</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${offlineMode ? 'bg-red-400' : 'bg-green-400'} offline-indicator`}></div>
                      <span className="text-xs">
                        {offlineMode ? 'Mode Offline' : 'Synchronisé'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm opacity-90">Chantier: Résidence Les Jardins</p>
                  </div>
                </div>
                
                {/* Mobile Content */}
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-card border border-border p-4 rounded-lg text-center touch-target" data-testid="mobile-button-photo">
                      <Camera className="text-2xl text-primary mb-2 mx-auto h-6 w-6" />
                      <p className="text-xs font-medium">Photo Qualité</p>
                    </button>
                    <button className="bg-card border border-border p-4 rounded-lg text-center touch-target" data-testid="mobile-button-checklist">
                      <ClipboardCheck className="text-2xl text-green-600 mb-2 mx-auto h-6 w-6" />
                      <p className="text-xs font-medium">Check-lists</p>
                    </button>
                    <button className="bg-card border border-border p-4 rounded-lg text-center touch-target" data-testid="mobile-button-reception">
                      <Package className="text-2xl text-orange-600 mb-2 mx-auto h-6 w-6" />
                      <p className="text-xs font-medium">Réception</p>
                    </button>
                    <button className="bg-card border border-border p-4 rounded-lg text-center touch-target" data-testid="mobile-button-incident">
                      <AlertTriangle className="text-2xl text-red-600 mb-2 mx-auto h-6 w-6" />
                      <p className="text-xs font-medium">Incident</p>
                    </button>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="text-yellow-600 h-4 w-4" />
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        3 éléments en attente de sync
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Features */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Fonctionnalités Terrain</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <WifiOff className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Mode Hors-ligne</h4>
                    <p className="text-sm text-muted-foreground">
                      Fonctionnement complet sans connexion avec sync automatique
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <MapPin className="text-green-600 dark:text-green-400 h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Géolocalisation</h4>
                    <p className="text-sm text-muted-foreground">
                      Toutes les saisies sont automatiquement géolocalisées
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Mic className="text-purple-600 dark:text-purple-400 h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Saisie Vocale</h4>
                    <p className="text-sm text-muted-foreground">
                      Dictée de rapports avec gants et équipements de protection
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <Shield className="text-orange-600 dark:text-orange-400 h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Interface Robuste</h4>
                    <p className="text-sm text-muted-foreground">
                      Résistante aux conditions météo et manipulations avec gants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

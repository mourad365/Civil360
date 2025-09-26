import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  nameAr: string;
  model: string;
  location: string;
  locationAr: string;
  status: 'active' | 'available' | 'maintenance' | 'broken';
  statusText: string;
  statusTextAr: string;
}

const equipmentData: Equipment[] = [
  {
    id: '1',
    name: 'Vibrateur',
    nameAr: 'هزاز',
    model: 'Wacker Neuson 60',
    location: 'Tour Lumia',
    locationAr: 'برج لوميا',
    status: 'active',
    statusText: 'EN UTILISATION',
    statusTextAr: 'قيد الاستخدام'
  },
  {
    id: '2',
    name: 'Vibrateur',
    nameAr: 'هزاز',
    model: 'Atlas Copco',
    location: 'Entrepôt Central',
    locationAr: 'المستودع المركزي',
    status: 'available',
    statusText: 'DISPONIBLE',
    statusTextAr: 'متاح'
  },
  {
    id: '3',
    name: 'Compacteur',
    nameAr: 'مضغوط',
    model: 'Bomag 120',
    location: 'Résidence Riviera',
    locationAr: 'إقامة ريفيرا',
    status: 'maintenance',
    statusText: 'EN MAINTENANCE (21/08)',
    statusTextAr: 'قيد الصيانة (21/08)'
  },
  {
    id: '4',
    name: 'Compacteur',
    nameAr: 'مضغوط',
    model: 'Caterpillar',
    location: 'Pont Horizon',
    locationAr: 'جسر هورايزون',
    status: 'broken',
    statusText: 'PANNE',
    statusTextAr: 'عطل'
  },
  {
    id: '5',
    name: 'Grues',
    nameAr: 'رافعات',
    model: 'Liebherr 200T',
    location: 'Tour Lumia',
    locationAr: 'برج لوميا',
    status: 'active',
    statusText: 'EN UTILISATION',
    statusTextAr: 'قيد الاستخدام'
  },
  {
    id: '6',
    name: 'Grues',
    nameAr: 'رافعات',
    model: 'Potain MDT',
    location: 'Entrepôt Central',
    locationAr: 'المستودع المركزي',
    status: 'available',
    statusText: 'DISPONIBLE',
    statusTextAr: 'متاح'
  }
];

type LanguageView = 'french' | 'arabic' | 'both';

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
    case 'available':
      return 'default';
    case 'maintenance':
      return 'secondary';
    case 'broken':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
    case 'available':
      return '🟢';
    case 'maintenance':
      return '🟡';
    case 'broken':
      return '🔴';
    default:
      return '';
  }
};

export default function EquipmentManagement() {
  const [languageView, setLanguageView] = useState<LanguageView>('both');

  const showFrench = languageView === 'french' || languageView === 'both';
  const showArabic = languageView === 'arabic' || languageView === 'both';

  const criticalEquipment = equipmentData.filter(eq => eq.status === 'broken' || eq.status === 'maintenance');

  return (
    <div className="p-6 space-y-6">
      {/* Language Toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          variant={languageView === 'french' ? 'default' : 'outline'}
          onClick={() => setLanguageView('french')}
          className="min-w-[150px]"
        >
          Version Française
        </Button>
        <Button
          variant={languageView === 'arabic' ? 'default' : 'outline'}
          onClick={() => setLanguageView('arabic')}
          className="min-w-[150px]"
        >
          Version Arabe
        </Button>
        <Button
          variant={languageView === 'both' ? 'default' : 'outline'}
          onClick={() => setLanguageView('both')}
          className="min-w-[150px]"
        >
          Afficher les Deux
        </Button>
      </div>

      <div className={`grid gap-6 ${showFrench && showArabic ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* French Version */}
        {showFrench && (
          <Card className="w-full">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="text-center text-xl font-semibold">
                GESTION DU PARC ÉQUIPEMENTS - DIRECTEUR LOGISTIQUE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="text-left p-4 font-semibold text-slate-700">ÉQUIPEMENT</th>
                      <th className="text-left p-4 font-semibold text-slate-700">MODÈLE</th>
                      <th className="text-left p-4 font-semibold text-slate-700">LOCALISATION</th>
                      <th className="text-left p-4 font-semibold text-slate-700">STATUT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentData.map((equipment) => (
                      <tr key={equipment.id} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="p-4">{equipment.name}</td>
                        <td className="p-4">{equipment.model}</td>
                        <td className="p-4">{equipment.location}</td>
                        <td className="p-4">
                          <Badge variant={getStatusBadgeVariant(equipment.status)} className="gap-1">
                            <span>{getStatusIcon(equipment.status)}</span>
                            {equipment.statusText}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Transfer Notice */}
              <div className="bg-blue-50 border-b p-4 text-blue-700 font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                TRANSFERT EN COURS: Compacteur vers Pont Horizon (Prévu: 22/08)
              </div>
              
              {/* Alert Footer */}
              <div className="bg-orange-50 p-4 text-center border-t-2 border-orange-200">
                <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
                  <AlertTriangle className="h-5 w-5" />
                  ÉQUIPEMENTS CRITIQUES: {criticalEquipment.filter(eq => eq.status === 'broken').length} EN PANNE - {criticalEquipment.filter(eq => eq.status === 'maintenance').length} EN MAINTENANCE
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Arabic Version */}
        {showArabic && (
          <Card className="w-full" dir="rtl">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="text-center text-xl font-semibold">
                إدارة أسطول المعدات - مدير الخدمات اللوجستية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="text-right p-4 font-semibold text-slate-700">المعدات</th>
                      <th className="text-right p-4 font-semibold text-slate-700">الموديل</th>
                      <th className="text-right p-4 font-semibold text-slate-700">الموقع</th>
                      <th className="text-right p-4 font-semibold text-slate-700">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentData.map((equipment) => (
                      <tr key={`ar-${equipment.id}`} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="p-4">{equipment.nameAr}</td>
                        <td className="p-4">{equipment.model}</td>
                        <td className="p-4">{equipment.locationAr}</td>
                        <td className="p-4">
                          <Badge variant={getStatusBadgeVariant(equipment.status)} className="gap-1">
                            <span>{getStatusIcon(equipment.status)}</span>
                            {equipment.statusTextAr}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Transfer Notice */}
              <div className="bg-blue-50 border-b p-4 text-blue-700 font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                نقل قيد التقدم: مضغوط إلى جسر هورايزون (مخطط: 22/08)
              </div>
              
              {/* Alert Footer */}
              <div className="bg-orange-50 p-4 text-center border-t-2 border-orange-200">
                <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
                  <AlertTriangle className="h-5 w-5" />
                  معدات حرجة: {criticalEquipment.filter(eq => eq.status === 'broken').length} معطلة - {criticalEquipment.filter(eq => eq.status === 'maintenance').length} قيد الصيانة
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

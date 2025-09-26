import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive translations for CIVIL360
const translations = {
  fr: {
    // Navigation & Common
    'nav.dashboard': 'Tableau de Bord',
    'nav.projects': 'Projets',
    'nav.purchasing': 'Achats',
    'nav.equipment': 'Équipements',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.export': 'Exporter',
    'common.import': 'Importer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.total': 'Total',
    'common.date': 'Date',
    'common.status': 'Statut',
    'common.priority': 'Priorité',
    'common.progress': 'Progression',
    'common.budget': 'Budget',
    'common.location': 'Localisation',
    'common.description': 'Description',
    'common.name': 'Nom',
    'common.code': 'Code',
    'common.type': 'Type',
    'common.category': 'Catégorie',
    'common.supplier': 'Fournisseur',
    'common.quantity': 'Quantité',
    'common.price': 'Prix',
    'common.cost': 'Coût',
    'common.amount': 'Montant',
    'common.currency': 'MAD',

    // Dashboard - General Director
    'dashboard.dg.title': 'Tableau de Bord Directeur Général',
    'dashboard.dg.subtitle': 'Vision complète de tous les projets de construction',
    'dashboard.dg.kpis.title': 'Indicateurs Clés de Performance',
    'dashboard.dg.projects_active': 'Projets Actifs',
    'dashboard.dg.global_budget': 'Budget Global',
    'dashboard.dg.overall_progress': 'Avancement Global',
    'dashboard.dg.average_delay': 'Délai Moyen',
    'dashboard.dg.active_collaborators': 'Collaborateurs Actifs',
    'dashboard.dg.critical_alerts': 'Alertes Critiques',
    'dashboard.dg.interactive_map': 'Carte Interactive des Chantiers',
    'dashboard.dg.detailed_tracking': 'Suivi Détaillé des Projets',
    'dashboard.dg.financial_analysis': 'Analyse Financière',
    'dashboard.dg.resource_management': 'Gestion des Ressources',
    'dashboard.dg.strategic_calendar': 'Calendrier Stratégique',
    'dashboard.dg.notifications_center': 'Centre des Notifications',

    // Projects
    'project.create': 'Créer un Projet',
    'project.edit': 'Modifier le Projet',
    'project.details': 'Détails du Projet',
    'project.phases': 'Phases du Projet',
    'project.team': 'Équipe',
    'project.documents': 'Documents',
    'project.risks': 'Risques',
    'project.quality': 'Contrôle Qualité',
    'project.daily_report': 'Rapport Quotidien',
    'project.status.planning': 'En Planification',
    'project.status.in_progress': 'En Cours',
    'project.status.on_hold': 'En Attente',
    'project.status.completed': 'Terminé',
    'project.status.cancelled': 'Annulé',
    'project.priority.low': 'Faible',
    'project.priority.medium': 'Moyenne',
    'project.priority.high': 'Élevée',
    'project.priority.critical': 'Critique',

    // Equipment
    'equipment.title': 'Gestion des Équipements',
    'equipment.overview': 'Vue d\'Ensemble',
    'equipment.transfers': 'Transferts',
    'equipment.maintenance': 'Maintenance',
    'equipment.rental': 'Location',
    'equipment.status.available': 'Disponible',
    'equipment.status.in_use': 'En Utilisation',
    'equipment.status.maintenance': 'En Maintenance',
    'equipment.status.out_of_order': 'Hors Service',
    'equipment.status.transferred': 'En Transfert',
    'equipment.type.compactor': 'Compacteur',
    'equipment.type.vibrator': 'Vibrateur',
    'equipment.type.crane': 'Grue',
    'equipment.type.mixer': 'Malaxeur',
    'equipment.type.excavator': 'Excavateur',
    'equipment.type.loader': 'Chargeur',
    'equipment.type.truck': 'Camion',
    'equipment.type.scaffolding': 'Échafaudage',

    // Purchasing
    'purchasing.title': 'Gestion des Achats',
    'purchasing.orders': 'Commandes',
    'purchasing.suppliers': 'Fournisseurs',
    'purchasing.materials': 'Matériaux',
    'purchasing.deliveries': 'Livraisons',
    'purchasing.order_number': 'Numéro de Commande',
    'purchasing.delivery_date': 'Date de Livraison',
    'purchasing.supplier_rating': 'Évaluation Fournisseur',

    // Notifications
    'notifications.title': 'Notifications',
    'notifications.urgent': 'Urgentes',
    'notifications.warning': 'Attention',
    'notifications.info': 'Informatives',
    'notifications.mark_read': 'Marquer comme Lu',
    'notifications.mark_all_read': 'Tout Marquer comme Lu',

    // Reports
    'reports.title': 'Rapports',
    'reports.generate': 'Générer un Rapport',
    'reports.weekly': 'Rapport Hebdomadaire',
    'reports.monthly': 'Rapport Mensuel',
    'reports.quarterly': 'Rapport Trimestriel',
    'reports.custom': 'Rapport Personnalisé',

    // Messages & Actions
    'message.save_success': 'Enregistré avec succès',
    'message.delete_success': 'Supprimé avec succès',
    'message.error': 'Une erreur est survenue',
    'message.confirm_delete': 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    'action.create': 'Créer',
    'action.update': 'Mettre à jour',
    'action.approve': 'Approuver',
    'action.reject': 'Rejeter',
    'action.submit': 'Soumettre',
    'action.close': 'Fermer'
  },
  
  ar: {
    // Navigation & Common
    'nav.dashboard': 'لوحة المعلومات',
    'nav.projects': 'المشاريع',
    'nav.purchasing': 'المشتريات',
    'nav.equipment': 'المعدات',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.total': 'المجموع',
    'common.date': 'التاريخ',
    'common.status': 'الحالة',
    'common.priority': 'الأولوية',
    'common.progress': 'التقدم',
    'common.budget': 'الميزانية',
    'common.location': 'الموقع',
    'common.description': 'الوصف',
    'common.name': 'الاسم',
    'common.code': 'الرمز',
    'common.type': 'النوع',
    'common.category': 'الفئة',
    'common.supplier': 'المورد',
    'common.quantity': 'الكمية',
    'common.price': 'السعر',
    'common.cost': 'التكلفة',
    'common.amount': 'المبلغ',
    'common.currency': 'درهم',

    // Dashboard - General Director
    'dashboard.dg.title': 'لوحة معلومات المدير العام',
    'dashboard.dg.subtitle': 'رؤية شاملة لجميع مشاريع البناء',
    'dashboard.dg.kpis.title': 'مؤشرات الأداء الرئيسية',
    'dashboard.dg.projects_active': 'المشاريع النشطة',
    'dashboard.dg.global_budget': 'الميزانية الإجمالية',
    'dashboard.dg.overall_progress': 'التقدم الإجمالي',
    'dashboard.dg.average_delay': 'متوسط التأخير',
    'dashboard.dg.active_collaborators': 'المتعاونون النشطون',
    'dashboard.dg.critical_alerts': 'التنبيهات الحرجة',
    'dashboard.dg.interactive_map': 'الخريطة التفاعلية للمواقع',
    'dashboard.dg.detailed_tracking': 'التتبع التفصيلي للمشاريع',
    'dashboard.dg.financial_analysis': 'التحليل المالي',
    'dashboard.dg.resource_management': 'إدارة الموارد',
    'dashboard.dg.strategic_calendar': 'التقويم الاستراتيجي',
    'dashboard.dg.notifications_center': 'مركز الإشعارات',

    // Continue with Arabic translations...
    'project.create': 'إنشاء مشروع',
    'project.edit': 'تعديل المشروع',
    'project.details': 'تفاصيل المشروع',
    'project.phases': 'مراحل المشروع',
    'project.team': 'الفريق',
    'project.documents': 'المستندات',
    'project.risks': 'المخاطر',
    'project.quality': 'مراقبة الجودة',
    'project.daily_report': 'التقرير اليومي'
  },

  en: {
    // Navigation & Common
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.purchasing': 'Purchasing',
    'nav.equipment': 'Equipment',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.total': 'Total',
    'common.date': 'Date',
    'common.status': 'Status',
    'common.priority': 'Priority',
    'common.progress': 'Progress',
    'common.budget': 'Budget',
    'common.location': 'Location',
    'common.description': 'Description',
    'common.name': 'Name',
    'common.code': 'Code',
    'common.type': 'Type',
    'common.category': 'Category',
    'common.supplier': 'Supplier',
    'common.quantity': 'Quantity',
    'common.price': 'Price',
    'common.cost': 'Cost',
    'common.amount': 'Amount',
    'common.currency': 'MAD',

    // Dashboard - General Director
    'dashboard.dg.title': 'General Director Dashboard',
    'dashboard.dg.subtitle': 'Complete overview of all construction projects',
    'dashboard.dg.kpis.title': 'Key Performance Indicators',
    'dashboard.dg.projects_active': 'Active Projects',
    'dashboard.dg.global_budget': 'Global Budget',
    'dashboard.dg.overall_progress': 'Overall Progress',
    'dashboard.dg.average_delay': 'Average Delay',
    'dashboard.dg.active_collaborators': 'Active Collaborators',
    'dashboard.dg.critical_alerts': 'Critical Alerts',
    'dashboard.dg.interactive_map': 'Interactive Site Map',
    'dashboard.dg.detailed_tracking': 'Detailed Project Tracking',
    'dashboard.dg.financial_analysis': 'Financial Analysis',
    'dashboard.dg.resource_management': 'Resource Management',
    'dashboard.dg.strategic_calendar': 'Strategic Calendar',
    'dashboard.dg.notifications_center': 'Notifications Center'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('civil360-language');
    return (saved as Language) || 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('civil360-language', lang);
    
    // Update document direction for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[language][key as keyof typeof translations['fr']] || key;
    
    if (params) {
      return Object.entries(params).reduce(
        (text, [param, value]) => text.replace(`{{${param}}}`, value),
        translation
      );
    }
    
    return translation;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;

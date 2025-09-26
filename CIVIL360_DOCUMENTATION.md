# CIVIL360 - Documentation Complète

## Vue d'ensemble du Système

CIVIL360 est une plateforme de gestion intégrée des projets de génie civil qui centralise l'information, synchronise les actions et optimise les ressources. La solution est conçue pour différents profils d'utilisateurs avec des interfaces spécialisées et bilingues (français/arabe).

### Objectifs principaux
- Réduction des délais ≤ 15%
- Diminution des dépassements budgétaires de 20%
- Visibilité temps réel sur tous les projets
- Optimisation intelligente des ressources

## Architecture Technique

### Backend (Node.js + Express.js + MongoDB)
```
server/
├── config/
│   └── database.ts        # Configuration MongoDB
├── middleware/
│   └── auth.ts            # Authentification JWT
├── models/                # Schémas de données Mongoose
│   ├── User.ts           # Utilisateurs et rôles
│   ├── Project.ts        # Projets de construction
│   ├── Equipment.ts      # Gestion des équipements
│   ├── PurchaseOrder.ts  # Commandes d'achat
│   ├── Supplier.ts       # Fournisseurs
│   ├── Material.ts       # Matériaux
│   ├── Notification.ts   # Système de notifications
│   └── Report.ts         # Rapports
├── routes/               # API RESTful
│   ├── projects.ts       # Endpoints projets
│   ├── purchasing.ts     # Endpoints achats
│   ├── equipment.ts      # Endpoints équipements
│   ├── dashboard.ts      # Endpoints tableaux de bord
│   └── notifications.ts  # Endpoints notifications
└── index.ts             # Point d'entrée serveur
```

### Frontend (React + TypeScript + Tailwind CSS)
```
client/src/
├── components/
│   ├── dashboards/       # Tableaux de bord spécialisés
│   │   ├── GeneralDirectorDashboard.tsx
│   │   ├── ProjectEngineerDashboard.tsx
│   │   ├── EquipmentManagementDashboard.tsx
│   │   └── PurchasingManagementDashboard.tsx
│   ├── forms/            # Formulaires
│   │   └── ProjectForm.tsx
│   ├── ui/               # Composants UI (Radix UI)
│   ├── LanguageSelector.tsx
│   └── NotificationCenter.tsx
├── contexts/
│   ├── AuthContext.tsx   # Gestion authentification
│   └── LanguageContext.tsx # Support multilingue
├── lib/
│   └── api.ts           # Client API
├── pages/               # Pages existantes
└── App.tsx             # Application principale
```

## Modules Fonctionnels

### 1. Tableau de Bord Directeur Général (`/dashboard/dg`)
**Fonctionnalités principales:**
- KPIs en temps réel (projets actifs, budget global, avancement, délais)
- Carte interactive des chantiers avec géolocalisation
- Suivi détaillé des projets avec alertes de risque
- Analyse financière avec répartition budgétaire
- Gestion des ressources et équipements
- Calendrier stratégique des échéances
- Centre de notifications intelligent

**Composant:** `GeneralDirectorDashboard.tsx`
**API:** `/api/dashboard/general-director`

### 2. Interface Ingénieur Projet (`/dashboard/engineer`)
**Fonctionnalités principales:**
- Gestion de projets assignés
- Planning des tâches et phases
- Rapports quotidiens de chantier
- Contrôle qualité et validation
- Import et analyse de plans CAO/BIM
- Gestion d'équipe et ressources
- Calculs structurels automatisés

**Composant:** `ProjectEngineerDashboard.tsx`
**API:** `/api/dashboard/project-engineer`

### 3. Gestion des Achats (`/dashboard/purchasing`)
**Fonctionnalités principales:**
- Création et suivi des commandes d'achat
- Gestion des fournisseurs et évaluations
- Calendrier des livraisons
- Analyse budgétaire des achats
- Génération automatique de commandes
- Suivi des contrats et négociations
- Rapports de performance fournisseurs

**Composant:** `PurchasingManagementDashboard.tsx`
**API:** `/api/purchasing/*`

### 4. Logistique Équipements (`/dashboard/equipment`)
**Fonctionnalités principales:**
- Inventaire complet des équipements
- Géolocalisation temps réel
- Gestion des transferts entre chantiers
- Maintenance préventive programmée
- Gestion des locations et achats
- Optimisation de l'utilisation
- Alertes et notifications

**Composant:** `EquipmentManagementDashboard.tsx`
**API:** `/api/equipment/*`

## Système d'Authentification et Rôles

### Rôles Utilisateurs
1. **general_director** - Directeur Général
   - Accès complet à tous les modules
   - Approbation des budgets et projets
   - Rapports stratégiques

2. **project_engineer** - Ingénieur Projet
   - Gestion des projets assignés
   - Contrôle qualité et technique
   - Rapports de chantier

3. **purchasing_manager** - Responsable Achats
   - Gestion des commandes et fournisseurs
   - Approbation des achats
   - Négociations contractuelles

4. **logistics_manager** - Responsable Logistique
   - Gestion des équipements
   - Planification des transferts
   - Maintenance préventive

5. **admin** - Administrateur Système
   - Configuration système
   - Gestion des utilisateurs
   - Maintenance technique

### Authentification JWT
- Tokens sécurisés avec expiration configurables
- Middleware d'authentification automatique
- Gestion des permissions par module et action

## Système Multilingue

### Langues supportées
- **Français (fr)** - Langue principale
- **Arabe (ar)** - Support RTL complet
- **Anglais (en)** - Support international

### Implémentation
```typescript
// Utilisation dans les composants
const { t, language, setLanguage, isRTL } = useLanguage();

// Traduction
<h1>{t('dashboard.dg.title')}</h1>

// Changement de langue
setLanguage('ar'); // Bascule vers l'arabe avec RTL
```

## API Documentation

### Endpoints Principaux

#### Projets
```
GET    /api/projects              - Liste des projets
POST   /api/projects              - Créer un projet
GET    /api/projects/:id          - Détails d'un projet
PUT    /api/projects/:id          - Modifier un projet
GET    /api/projects/:id/dashboard - Dashboard projet
POST   /api/projects/:id/daily-report - Ajouter rapport quotidien
PUT    /api/projects/:id/progress - Mettre à jour progression
```

#### Achats
```
GET    /api/purchasing/orders     - Commandes d'achat
POST   /api/purchasing/orders     - Créer commande
PUT    /api/purchasing/orders/:id/approve - Approuver commande
GET    /api/purchasing/suppliers  - Liste fournisseurs
GET    /api/purchasing/dashboard  - Dashboard achats
```

#### Équipements
```
GET    /api/equipment             - Liste équipements
POST   /api/equipment/:id/transfer - Demander transfert
POST   /api/equipment/:id/maintenance - Ajouter maintenance
GET    /api/equipment/dashboard/overview - Dashboard équipements
GET    /api/equipment/map         - Données carte équipements
```

#### Notifications
```
GET    /api/notifications         - Notifications utilisateur
PUT    /api/notifications/:id/read - Marquer comme lu
PUT    /api/notifications/read-all - Tout marquer lu
GET    /api/notifications/stats   - Statistiques notifications
```

## Base de Données

### Collections MongoDB Principales

#### Users
```javascript
{
  username: String,
  password: String (hashed),
  name: String,
  role: Enum['general_director', 'project_engineer', ...],
  preferences: {
    language: Enum['fr', 'ar', 'en'],
    theme: String,
    currency: String
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    department: String
  }
}
```

#### Projects
```javascript
{
  name: String,
  code: String,
  description: String,
  location: {
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  client: {
    name: String,
    contact: String,
    email: String,
    phone: String
  },
  budget: {
    estimated: Number,
    allocated: Number,
    spent: Number,
    labor: Number,
    materials: Number,
    equipment: Number,
    contingency: Number
  },
  structure: [/* niveaux de construction */],
  phases: [/* phases du projet */],
  team: {
    projectManager: ObjectId,
    engineers: [ObjectId],
    workers: [ObjectId]
  },
  progress: {
    overall: Number,
    phases: [/* progression par phase */]
  }
}
```

## Installation et Déploiement

### Prérequis
- Node.js 18+
- MongoDB 6+
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd Civil360

# Installer les dépendances
npm install

# Configuration des variables d'environnement
cp .env.example .env
# Modifier .env avec vos configurations

# Lancer en développement
npm run dev

# Build pour production
npm run build
npm start
```

### Variables d'Environnement
```bash
# MongoDB
MONGODB_URI=mongodb+srv://[user]:[password]@[cluster]/civil360
MONGODB_DB_NAME=civil360

# Serveur
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# URLs
VITE_API_URL=http://localhost:3001
```

### Déploiement Production
1. **Base de données:** MongoDB Atlas ou serveur dédié
2. **Backend:** Deploy sur Railway, Heroku, ou VPS
3. **Frontend:** Build avec Vite et deploy sur Netlify/Vercel
4. **Domaine:** Configuration DNS et certificats SSL

## Sécurité

### Mesures Implémentées
- Authentification JWT avec expiration
- Hashage des mots de passe avec bcrypt
- Validation des données d'entrée
- CORS configuré pour production
- Rate limiting sur les endpoints sensibles
- Logs d'audit des actions critiques

### Bonnes Pratiques
- Variables d'environnement pour secrets
- Validation côté client ET serveur
- Gestion d'erreurs appropriée
- Backup automatique des données
- Monitoring des performances

## Support et Maintenance

### Fonctionnalités Avancées Implémentées
✅ Système de notifications temps réel  
✅ Support multilingue complet (FR/AR/EN)  
✅ Tableaux de bord interactifs avec graphiques  
✅ Gestion complète des projets de construction  
✅ Système d'achats et fournisseurs  
✅ Logistique des équipements avec géolocalisation  
✅ Authentification et gestion des rôles  
✅ API RESTful complète  
✅ Interface responsive et moderne  
✅ Base de données NoSQL optimisée  

### Prochaines Évolutions Possibles
- Module de facturation intégré
- Intégration avec systèmes ERP existants
- Application mobile native
- Intelligence artificielle pour prédictions
- Système de workflow avancé
- Intégration IoT pour capteurs chantier

---

**CIVIL360** - Plateforme complète de gestion de projets de génie civil  
Développé avec les technologies modernes pour une performance optimale  
Support technique: [email de support]

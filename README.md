# CIVIL360 - Advanced Construction Management Platform

##  **SINGLE-PORT NEXT.JS APPLICATION** - v3.0.0

> ✅ Fully consolidated Next.js application running on one port (3000)
> ✅ No Vite, no separate backend/frontend servers
> ✅ Unified codebase with Next.js API routes

CIVIL360 est une plateforme intégrée de gestion des projets de génie civil qui centralise l'information, synchronise les actions et optimise les ressources. Conçue pour différents profils d'Users avec des interfaces spécialisées et support multilingue complet (Français/العربية/English).

##  Objectifs principaux
-  **Réduction des délais ≤ 15%**
-  **Diminution des dépassements budgétaires de 20%** 
-  **Visibilité temps réel sur tous les projets**
- ⚡ **Optimisation intelligente des ressources**

## 🌟 Modules Fonctionnels

### 📊 **Tableau de Bord Directeur Général** (`/dashboard/dg`)
- **KPIs temps réel**: Projets actifs, budget global, avancement, collaborateurs
- **Carte interactive**: Géolocalisation des chantiers avec codes couleur de statut
- **Suivi détaillé**: Progression, budget, délais, identification des risques
- **Analyse financière**: Répartition par catégories (main d'œuvre, matériaux, équipements)
- **Gestion ressources**: Disponibilité équipements, taux utilisation, maintenance
- **Calendrier stratégique**: Livraisons, réunions, échéances de paiement
- **Centre notifications**: Alertes critiques, prioritaires et informatives
- **Rapports automatiques**: Hebdomadaires, mensuels, trimestriels

### 👷 **Interface Ingénieur Projet** (`/dashboard/engineer`)
- **Création projets**: Configuration complète avec structure par niveaux
- **Saisie technique**: Calculs automatisés béton/acier/coffrage
- **Planification phases**: Gestion chronologique avec équipes assignées
- **Commandes automatiques**: Génération basée sur métrés calculés
- **Journal chantier**: Rapports quotidiens avec matériaux et main d'œuvre
- **Import plans**: Support CAO/BIM (.dwg, .pdf, .rvt, .ifc)
- **Calcul structural**: Vérifications techniques automatisées
- **Contrôle qualité**: Inspections et validation dimensionnelle

### 🛒 **Gestion des Achats** (`/dashboard/purchasing`)
- **Commandes**: Création, suivi, approbation avec workflow
- **Fournisseurs**: Évaluation performance, notation, contrats
- **Livraisons**: Calendrier programmé avec alertes de retard
- **Budget**: Analyse mensuelle, alertes dépassement
- **Contrats**: Gestion accords cadre, ferme, spot
- **Rapports**: Économies réalisées, taux de service, délais moyens

### 🚛 **Logistique Équipements** (`/dashboard/equipment`)  
- **Inventaire**: Classification par type (compacteurs, grues, vibrateurs)
- **Transferts**: Planification optimisée entre chantiers
- **Maintenance**: Programme préventif avec historique interventions
- **Locations**: Suivi contrats, comparaison achat vs location
- **Géolocalisation**: Carte temps réel avec statuts équipements
- **Optimisation**: Suggestions utilisation, rotations intelligentes

### 🌍 **Support Multilingue Complet**
- **Français** - Interface principale avec terminologie BTP
- **العربية** - Support RTL complet avec adaptation culturelle
- **English** - Version internationale pour projets export

## 🛠️ Technology Stack

### Full-Stack Framework
- **Next.js 14** - App Router with API routes
- **React 18** with **TypeScript**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Frontend
- **TailwindCSS** for styling with glassmorphism effects
- **Radix UI** components
- **Tanstack Query** for data fetching
- **Lucide React** icons
- **Framer Motion** for animations
- **Recharts** for data visualization

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **MongoDB** (v6 or later)
- **npm** (v9 or later)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Civil360
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://127.0.0.1:27017/civil360

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d

   # Server Configuration
   NODE_ENV=development
   ```

4. **Populate the database** (first time only)
   ```bash
   npm run populate
   ```
   This creates sample data including users, projects, equipment, and more.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application runs on: **http://localhost:3000**

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Default Login Credentials (Development)
The app uses mock authentication in development mode. Access different dashboards:
- General Director: http://localhost:3000/dashboard/general-director
- Project Engineer: http://localhost:3000/dashboard/project-engineer
- Purchasing Manager: http://localhost:3000/dashboard/purchasing
- Logistics Manager: http://localhost:3000/dashboard/equipment

## 📁 Project Structure

```
Civil360/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes (Backend)
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── dashboard/    # Dashboard data endpoints
│   │   │   ├── projects/     # Project management API
│   │   │   ├── equipment/    # Equipment management API
│   │   │   ├── purchasing/   # Purchase orders API
│   │   │   └── notifications/# Notifications API
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── login/           # Login page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   └── [features]/     # Feature-specific components
│   ├── lib/                # Utilities and helpers
│   │   ├── auth-helpers.ts # Authentication for API routes
│   │   └── db-init.ts     # Database initialization
│   ├── server/            # Backend logic
│   │   ├── models/       # Mongoose models
│   │   ├── config/       # Database configuration
│   │   └── storage-mongo.ts # MongoDB storage layer
│   ├── contexts/         # React contexts
│   └── hooks/           # Custom React hooks
├── shared/              # Shared schemas and types
│   └── schema.ts       # Database schemas
├── uploads/            # File upload directory
├── populate.js        # Database seeding script
├── package.json       # Dependencies (type: module)
├── next.config.mjs   # Next.js configuration
└── .env              # Environment variables
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

### API Endpoints

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/mock-login` - Mock login (development only)
- **GET** `/api/auth/me` - Get current user profile
- **PUT** `/api/auth/me` - Update user profile
- **PUT** `/api/auth/change-password` - Change password
- **POST** `/api/auth/refresh` - Refresh token

### Development Mode
In development, the app uses mock authentication. No login required - just navigate to any dashboard URL and you'll be auto-authenticated based on the URL path.

### Production Mode
In production, proper JWT authentication is enforced. Users must register/login to access protected routes.

## 📡 API Documentation

### Dashboard
- **GET** `/api/dashboard/stats` - Get dashboard statistics

### Projects
- **GET** `/api/projects` - Get all projects
- **GET** `/api/projects/:id` - Get project by ID
- **POST** `/api/projects` - Create new project (requires auth)
- **PUT** `/api/projects/:id` - Update project (requires auth)

### AI Plan Analysis
- **GET** `/api/ai/analysis` - Get all AI analyses
- **POST** `/api/ai/analysis` - Create AI analysis (requires auth)
- **POST** `/api/ai/upload-plan` - Upload plan file for analysis (requires auth)
- **PUT** `/api/ai/analysis/:id` - Update AI analysis

### IoT Equipment
- **GET** `/api/iot/equipment` - Get all IoT equipment
- **POST** `/api/iot/equipment` - Add new equipment (requires auth)
- **PUT** `/api/iot/equipment/:id` - Update equipment (requires auth)
- **POST** `/api/iot/simulate-update` - Simulate IoT data update

### Quality Control
- **GET** `/api/quality/checks` - Get all quality checks
- **POST** `/api/quality/checks` - Create quality check (requires auth)

### Mobile Sync
- **GET** `/api/mobile/sync-queue` - Get mobile sync queue

### Odoo Integration
- **GET** `/api/odoo/sync-status` - Get Odoo sync status
- **POST** `/api/odoo/trigger-sync` - Trigger Odoo sync

### Predictions
- **GET** `/api/predictions/:projectId` - Get project predictions

## 🗄️ Database Models

The application uses the following MongoDB collections:

- **users** - User accounts and authentication
- **projects** - Construction project data
- **aiPlanAnalysis** - AI analysis results for construction plans
- **iotEquipment** - IoT device tracking and sensor data
- **qualityChecks** - Quality control inspections
- **mobileSyncQueue** - Mobile app synchronization queue
- **odooSync** - Odoo integration sync logs
- **predictions** - AI predictions for projects

## 🔧 Development

### Adding New Features

1. **Backend**: Add new routes in `server/routes.ts`
2. **Database**: Create new models in `server/models/`
3. **Frontend**: Add new pages in `client/src/pages/`
4. **Types**: Update shared types in `shared/schema.ts`

### Database Seeding

The application automatically seeds initial data on first startup:
- Default user account
- Sample projects
- Sample IoT equipment
- Sample quality checks
- Sample AI analyses

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configurable CORS settings
- **Input Validation**: Zod schema validation
- **File Upload Security**: Type and size restrictions
- **Error Handling**: Comprehensive error handling and logging

## 📱 Mobile Support

The platform includes mobile synchronization capabilities:
- Offline data collection
- Automatic sync when online
- Mobile-optimized quality check interface
- GPS location tracking for equipment and inspections

## 🔌 Integrations

### Odoo ERP Integration
- Personnel synchronization
- Project data import/export
- Billing and invoicing sync
- Automatic retry on sync failures

### File Storage
- Local file storage (development)
- Configurable cloud storage (Google Cloud Storage ready)
- Automatic file type validation
- Organized folder structure

## 🧪 Testing

Run the backend server to test the API:

```bash
npm run dev
```

Use tools like Postman or Thunder Client to test API endpoints.

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production` in `.env`
2. Configure production MongoDB connection
3. Set secure JWT secrets
4. Configure CORS for your domain

### Build and Deploy
```bash
npm run build
npm start
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Civil360** - Revolutionizing construction project management with AI and IoT integration.

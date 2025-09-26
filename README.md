# 🏗️ CIVIL360 - Plateforme Complète de Gestion de Projets de Construction

CIVIL360 est une plateforme intégrée de gestion des projets de génie civil qui centralise l'information, synchronise les actions et optimise les ressources. Conçue pour différents profils d'utilisateurs avec des interfaces spécialisées et support multilingue complet (Français/العربية/English).

## 🎯 Objectifs Principaux
- ⏱️ **Réduction des délais ≤ 15%**
- 💰 **Diminution des dépassements budgétaires de 20%** 
- 👁️ **Visibilité temps réel sur tous les projets**
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

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **TypeScript** for type safety
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Frontend
- **React** with **TypeScript**
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Radix UI** components
- **Tanstack Query** for data fetching
- **Wouter** for routing

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **MongoDB** (v6 or later)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Civil360
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   
   **Option A: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Database will be created automatically

   **Option B: MongoDB Atlas (Cloud)**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/civil360
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civil360

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the application**
   
   **Development mode:**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm run build
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api

## 📁 Project Structure

```
Civil360/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility libraries
│   │   └── App.tsx         # Main app component
├── server/                 # Express backend
│   ├── config/             # Database and app configuration
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB/Mongoose models
│   ├── routes/             # API route handlers
│   ├── index.ts            # Main server file
│   └── storage-mongo.ts    # MongoDB storage layer
├── shared/                 # Shared code between client/server
│   └── schema.ts           # Database schemas and types
├── uploads/                # File upload directory
└── .env                    # Environment variables
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

### Endpoints

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - User login
- **GET** `/api/auth/me` - Get current user profile
- **PUT** `/api/auth/me` - Update user profile
- **PUT** `/api/auth/change-password` - Change password
- **POST** `/api/auth/refresh` - Refresh token

### Default User

After starting the application, a default user will be created:
- **Username**: `marc.dubois`
- **Password**: `password`
- **Role**: `Chef d'Exécution`

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

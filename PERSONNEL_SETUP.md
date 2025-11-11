# Configuration du Module Gestion Personnel

## 📋 Vue d'ensemble

Le module de gestion du personnel permet de gérer:
- **Ouvriers/Journaliers** : Pointage hebdomadaire du personnel
- **Décomptes Sous-traitants** : Gestion des factures et paiements

Toutes les données sont enregistrées dans **MongoDB**.

---

## 🔧 Configuration MongoDB

### 1. Créer le fichier `.env.local`

À la racine du projet, créez un fichier `.env.local` avec:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/civil360
MONGODB_DB_NAME=civil360

# JWT Configuration (optionnel pour l'authentification)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-in-production
```

### 2. Installer MongoDB

**Option A: MongoDB Local**
```bash
# Windows
# Télécharger depuis: https://www.mongodb.com/try/download/community
# Installer et démarrer le service MongoDB

# Vérifier que MongoDB fonctionne
mongosh
```

**Option B: MongoDB Atlas (Cloud)**
```
1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Obtenir la connection string
4. Mettre à jour MONGODB_URI dans .env.local:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civil360?retryWrites=true&w=majority
```

---

## 📦 Modèles de Données

### Personnel (Ouvriers)
```typescript
{
  id_personnel: string,      // Téléphone utilisé comme ID
  nom: string,
  telephone: string,
  fonction: 'manoeuvre' | 'maçon' | 'ferrailleur' | 'coffreur' | 'grutier',
  pointages: [{
    semaine: string,         // Format: YYYY-MM-DD
    chantier: string,
    lundi: { present: boolean, heuresSupp: number },
    mardi: { present: boolean, heuresSupp: number },
    // ... autres jours
  }],
  actif: boolean
}
```

### Décompte (Sous-traitants)
```typescript
{
  id_decompte: string,       // Format: DEC-timestamp
  nom: string,
  telephone: string,
  chantier: string,
  date: Date,
  taches: [{
    description: string,
    quantite: number,
    unite: string,
    prix: number,
    avancement: number       // 0-100%
  }],
  statut: 'pending' | 'paid',
  montantTotal: number
}
```

---

## 🚀 API Endpoints

### Ouvriers (Journaliers)

**GET** `/api/personnel/ouvriers`
- Récupère tous les ouvriers
- Query params: `actif=true/false`

**POST** `/api/personnel/ouvriers`
- Crée un nouvel ouvrier
- Body: `{ nom, telephone, fonction }`

**PUT** `/api/personnel/ouvriers`
- Met à jour le pointage d'un ouvrier
- Body: `{ id, pointage }`

**DELETE** `/api/personnel/ouvriers?id=xxx`
- Désactive un ouvrier (soft delete)

### Décomptes (Sous-traitants)

**GET** `/api/personnel/decomptes`
- Récupère tous les décomptes
- Query params: `statut=pending/paid`, `chantier=xxx`

**POST** `/api/personnel/decomptes`
- Crée un nouveau décompte
- Body: `{ nom, telephone, chantier, date, taches }`

**PUT** `/api/personnel/decomptes`
- Met à jour un décompte (statut)
- Body: `{ id, statut }`

**DELETE** `/api/personnel/decomptes?id=xxx`
- Supprime un décompte

---

## 🎯 Utilisation

### 1. Démarrer l'application

```bash
npm run dev
```

### 2. Accéder au module

Naviguer vers: `http://localhost:3000/personna`

### 3. Fonctionnalités

**Onglet Décompte Soustraitants:**
- Cliquer sur "Nouveau Décompte Sous-traitant"
- Remplir le formulaire (nom, téléphone, chantier, tâches)
- Les données sont automatiquement sauvegardées dans MongoDB
- Marquer comme payé, générer PDF, supprimer

**Onglet Pointage Journaliers:**
- Cliquer sur "Nouveau Journalier" pour ajouter un ouvrier
- Sélectionner le chantier et la semaine
- Cocher les présences et saisir les heures supplémentaires
- Les pointages sont sauvegardés automatiquement dans MongoDB

---

## 🔍 Vérification

### Vérifier que MongoDB fonctionne

```bash
# Ouvrir MongoDB Shell
mongosh

# Se connecter à la base de données
use civil360

# Vérifier les collections
show collections

# Voir les ouvriers
db.personnels.find().pretty()

# Voir les décomptes
db.decomptes.find().pretty()
```

---

## 🐛 Dépannage

### Erreur: "Cannot connect to MongoDB"
- Vérifier que MongoDB est démarré
- Vérifier l'URI dans `.env.local`
- Vérifier les permissions réseau (firewall)

### Erreur: "Authentication required"
- Vérifier que JWT_SECRET est défini dans `.env.local`
- Redémarrer le serveur après modification du .env

### Les données ne s'affichent pas
- Ouvrir la console du navigateur (F12)
- Vérifier les erreurs réseau dans l'onglet Network
- Vérifier les logs du serveur dans le terminal

---

## 📝 Notes Importantes

1. **Données de test**: Au premier lancement, la base sera vide. Ajoutez des données via l'interface.

2. **Sauvegarde**: Les données sont persistées dans MongoDB. Pensez à faire des backups réguliers.

3. **Performance**: Les index sont créés automatiquement sur les champs clés pour optimiser les requêtes.

4. **Sécurité**: En production, utilisez des variables d'environnement sécurisées et activez l'authentification MongoDB.

---

## 🎨 Améliorations Futures

- [ ] Export Excel des pointages
- [ ] Calcul automatique des salaires
- [ ] Historique des modifications
- [ ] Notifications par email/SMS
- [ ] Tableau de bord analytique avancé

# 🚀 Démarrage Rapide - Module Personnel

## Configuration en 3 étapes

### 1️⃣ Installer MongoDB

**Windows:**
```bash
# Télécharger et installer MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Ou utiliser MongoDB Atlas (cloud gratuit)
# https://www.mongodb.com/cloud/atlas
```

### 2️⃣ Configurer les variables d'environnement

```bash
# Créer automatiquement le fichier .env.local
node setup-env.js
```

**OU** créer manuellement `.env.local` à la racine:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/civil360
MONGODB_DB_NAME=civil360
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-key
```

### 3️⃣ Démarrer l'application

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer le serveur
npm run dev
```

## ✅ Vérification

1. Ouvrir http://localhost:3000/personna
2. Cliquer sur "Nouveau Décompte Sous-traitant" ou "Nouveau Journalier"
3. Remplir et sauvegarder
4. Les données sont maintenant dans MongoDB! 🎉

## 📚 Documentation complète

Voir [PERSONNEL_SETUP.md](./PERSONNEL_SETUP.md) pour plus de détails.

## 🆘 Problèmes?

**MongoDB ne démarre pas:**
- Windows: Vérifier les services Windows (services.msc)
- Ou utiliser MongoDB Atlas (cloud)

**Erreur de connexion:**
- Vérifier que MONGODB_URI dans .env.local est correct
- Vérifier que MongoDB écoute sur le port 27017

**Les données ne s'affichent pas:**
- Ouvrir la console du navigateur (F12)
- Vérifier les erreurs dans l'onglet Console et Network

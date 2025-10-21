# 🏗️ Guide d'utilisation - Module d'Étude Quantitative

## 📍 Accès au module

L'application est maintenant en cours d'exécution. Pour accéder au module d'étude quantitative :

**URL directe** : http://localhost:3000/etude-quantitative

## 🚀 Démarrage rapide

### 1. Charger les données d'exemple

Pour voir le module en action avec un projet complet :

1. Cliquez sur le bouton **"📊 Charger données d'exemple"** en haut à droite
2. Un projet de hangar métallique de 1200 m² à Nouakchott sera chargé
3. Toutes les tables et devis seront pré-remplies

### 2. Navigation dans les onglets

Le module comprend 8 onglets :

- **Informations générales** : Métadonnées du projet (nom, client, dates, etc.)
- **Fondations** : Béton de propreté, semelles, ferraillage
- **Superstructure** : Poteaux et poutres métalliques
- **Planchers** : Dalles et planchers
- **Façades & Cloisons** : Bardage et menuiseries
- **Toiture** : Couverture et étanchéité
- **Second œuvre** : Finitions
- **Aménagements extérieurs** : VRD et espaces extérieurs

### 3. Utiliser les tables techniques

Chaque onglet contient des tables éditables :

#### Ajouter une ligne
- Cliquez sur le bouton **"Ajouter"** dans chaque table
- Remplissez les champs éditables

#### Modifier les données
- Cliquez directement dans les cellules pour modifier
- Les colonnes calculées (fond bleu) se mettent à jour automatiquement

#### Supprimer une ligne
- Cliquez sur l'icône 🗑️ (corbeille) à droite de chaque ligne

#### Recalculer
- Cliquez sur l'icône 🧮 (calculatrice) pour forcer un recalcul

### 4. Gérer le devis estimatif

Dans chaque catégorie, une section **"Devis estimatif"** est disponée :

1. Cliquez sur **"+ Ajouter ligne"**
2. Remplissez :
   - **Désignation** : Description du poste
   - **Unité** : m³, kg, m², forfait, etc.
   - **Quantité** : Nombre d'unités
   - **Prix unitaire** : Prix par unité
3. Le **Montant total** se calcule automatiquement

### 5. Consulter le récapitulatif

En bas de page, la carte **"Récapitulatif du projet"** affiche :

- 📐 **Surface totale** (m²)
- 📦 **Volume béton** (m³)
- ⚡ **Acier estimé** (kg)
- 📊 **Éléments structurels** (nombre)
- 📄 **Lignes de devis** (nombre)
- 💰 **Coût total** (MRU)

Plus des indicateurs supplémentaires :
- Densité d'acier (kg/m³)
- Coût moyen au m²
- Coût béton moyen
- Répartition estimée des coûts

## 💾 Sauvegarde et Export

### Sauvegarde automatique
- Les données sont sauvegardées automatiquement dans le navigateur
- Indication "Dernière sauvegarde" en haut de page
- Les données persistent même après fermeture du navigateur

### Export JSON
1. Cliquez sur **"Exporter"** → **"JSON"**
2. Un fichier `.json` sera téléchargé
3. Contient toutes les données du projet

### Export Excel
1. Cliquez sur **"Exporter"** → **"Excel (.xlsx)"**
2. Un fichier structuré sera généré avec :
   - Feuille "Informations"
   - Feuille "Récapitulatif"
   - Feuille "Devis Estimatif"
   - Feuilles techniques par catégorie

### Import
1. Cliquez sur **"Importer"** → Choisir le format
2. Sélectionnez votre fichier
3. Les données seront fusionnées avec le projet actuel

### Impression
1. Cliquez sur **"Imprimer"**
2. Une version optimisée pour l'impression s'affiche
3. Utilisez Ctrl+P ou Cmd+P

### Réinitialiser
⚠️ **Attention** : Cette action supprime toutes les données
1. Cliquez sur **"Réinitialiser"**
2. Confirmez l'action
3. Un projet vierge sera créé

## 📐 Formules de calcul

### Béton de propreté
```
Volume (m³) = (Épaisseur_cm / 100) × Surface_m²
```

### Semelles isolées
```
Volume (m³) = (L/100) × (l/100) × (h/100) × Nombre
```

### Poteaux/Poutres métalliques
```
Masse totale (kg) = Hauteur/Portée × Nombre × Masse linéaire
```

### Devis
```
Montant total = Quantité × Prix unitaire
Total section = Σ(Montant total lignes)
Total général = Σ(Total sections)
```

### Acier estimé
```
Quantité acier (kg) = Volume béton (m³) × 120 kg/m³
```

## 🎨 Fonctionnalités avancées

### Colonnes calculées
Les colonnes avec fond bleu clair sont calculées automatiquement selon les formules définies.

### Synchronisation multi-onglets
Si vous ouvrez plusieurs onglets du navigateur, les modifications seront synchronisées.

### Mode sombre
Le module s'adapte automatiquement au thème système (clair/sombre).

### Responsive
L'interface s'adapte aux écrans desktop, tablette et mobile.

## 🔍 Données d'exemple incluses

Le projet d'exemple "Hangar métallique - Nouakchott" contient :

### Caractéristiques
- **Surface** : 1200 m²
- **Hauteur** : 8 m
- **Structure** : Acier galvanisé
- **Couverture** : Bac acier laqué
- **Client** : SNIM

### Contenu
- 24 poteaux principaux HEB 300
- 12 poteaux secondaires HEB 200
- 8 fermes principales IPE 400
- 40 pannes IPE 160
- Fondations béton armé
- Couverture complète
- Devis détaillé par sections

### Coût total estimé
Environ **70-80 millions MRU** (à titre indicatif)

## ⚙️ Personnalisation

### Ajouter une nouvelle table

Éditez le fichier `src/modules/etude-quantitative/data/initialData.ts` :

```typescript
export function createMaNouvelleCat(): TableDefinition {
  return {
    id: generateId(),
    title: 'Ma nouvelle catégorie',
    category: 'fondations', // ou autre catégorie
    columns: [
      { key: 'nom', label: 'Nom', type: 'text', editable: true },
      { key: 'valeur', label: 'Valeur', type: 'number', unit: 'm', editable: true },
      { 
        key: 'resultat', 
        label: 'Résultat', 
        type: 'calculated', 
        formula: 'valeur * 2',
        unit: 'm²' 
      },
    ],
    rows: [],
  };
}
```

### Modifier les formules

Éditez `src/modules/etude-quantitative/utils/calculations.ts`

### Changer les styles

Éditez `src/modules/etude-quantitative/styles/etude.css`

## 🐛 Résolution de problèmes

### Les calculs ne se font pas
→ Cliquez sur l'icône calculatrice pour forcer un recalcul

### Données perdues après refresh
→ Vérifiez que localStorage est activé dans votre navigateur

### Export Excel ne fonctionne pas
→ Vérifiez que les pop-ups ne sont pas bloquées

### Interface mal affichée
→ Effacez le cache du navigateur (Ctrl+Shift+R)

## 📞 Support

Pour toute question ou problème :
- Consultez le README.md dans `src/modules/etude-quantitative/`
- Ouvrez une issue sur le dépôt GitHub
- Contactez l'équipe de développement Civil360

## 📚 Documentation technique

Consultez le fichier `src/modules/etude-quantitative/README.md` pour :
- Architecture détaillée
- API des composants
- Guide de développement
- Spécifications techniques

---

**Module développé pour Civil360**  
Version 1.0.0 - Octobre 2024

Bon travail ! 🚀

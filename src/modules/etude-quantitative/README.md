# Module d'Étude Quantitative - Civil360

Module complet de gestion de projets de construction métallique avec fiche technique interactive et devis estimatif automatisé.

## 🎯 Fonctionnalités

### Fiche Technique Projet
- **Onglets organisés** : Informations générales, Fondations, Superstructure, Planchers, Façades & Cloisons, Toiture, Second œuvre, Aménagements extérieurs
- **Tables dynamiques** : Ajout/suppression de lignes, colonnes calculées automatiquement
- **Formules physiques** : Calculs automatiques de volumes, surfaces, masses selon normes construction
- **Sauvegarde locale** : Persistance automatique dans localStorage

### Module de Devis Estimatif
- **Structure Excel** : Désignation, Unité, Quantité, Prix unitaire, Montant total
- **Calculs automatiques** : Totaux par section et total général
- **Suivi en temps réel** : Mise à jour instantanée des montants

### Récapitulatif Global
- Surface totale (m²)
- Volume béton total (m³)
- Quantité acier estimée (kg)
- Nombre d'éléments structurels
- Coût total du projet
- Ratios et indicateurs clés

### Import/Export
- **JSON** : Import/export des données complètes
- **Excel** : Export formaté avec toutes les sections
- **Impression** : Version imprimable optimisée

## 📁 Structure

```
etude-quantitative/
├── EtudeQuantitative.tsx       # Composant principal
├── types.ts                    # Types TypeScript
├── index.ts                    # Exports publics
├── components/
│   ├── TableEditable.tsx      # Tableau dynamique éditable
│   ├── SummaryCard.tsx        # Carte récapitulative
│   └── FileActions.tsx        # Actions fichiers
├── hooks/
│   └── useLocalStorage.ts     # Hook persistance
├── utils/
│   ├── calculations.ts        # Formules calculs
│   ├── formatters.ts          # Formatage données
│   └── excelAdapter.ts        # Import/export Excel
├── data/
│   └── initialData.ts         # Données initiales
└── styles/
    └── etude.css              # Styles personnalisés
```

## 🚀 Utilisation

### Installation

Le module est déjà intégré dans l'application Civil360. Accédez-y via :

```
http://localhost:3000/etude-quantitative
```

### Utilisation programmatique

```typescript
import { EtudeQuantitative } from '@/modules/etude-quantitative';

export default function MyPage() {
  return <EtudeQuantitative />;
}
```

### Utilisation des composants individuels

```typescript
import { 
  TableEditable, 
  SummaryCard,
  useLocalStorage 
} from '@/modules/etude-quantitative';

// Table éditable
<TableEditable 
  table={tableDefinition}
  onUpdate={handleUpdate}
/>

// Carte récapitulative
<SummaryCard summary={projectSummary} />

// Hook localStorage
const [data, setData, clearData] = useLocalStorage('key', initialValue);
```

## 📐 Formules de Calcul

### Béton

| Élément | Formule | Unité |
|---------|---------|-------|
| Béton de propreté | `(épaisseur_cm / 100) × surface` | m³ |
| Semelles isolées | `(L/100) × (l/100) × (h/100) × nb` | m³ |
| Semelles filantes | `(larg/100) × (haut/100) × longueur_m` | m³ |
| Plots béton | `(section/100)² × hauteur/100` | m³ |
| Longrines | `(section/100)² × portée` | m³ |

### Acier

| Élément | Formule | Unité |
|---------|---------|-------|
| Platines | `(L_mm × l_mm) / 1000000` | m² |
| Acier estimé | `volume_béton × 120` | kg |
| Masse acier | `volume_m³ × 7850` | kg |

### Devis

| Calcul | Formule |
|--------|---------|
| Montant ligne | `quantité × prix_unitaire` |
| Total section | `∑(montant_ligne)` |
| Total général | `∑(total_section)` |

## 🎨 Interface

### Thème
- **Clair par défaut** avec support du mode sombre
- **Glassmorphism** : Effets de transparence et flou
- **Animations** : Transitions fluides entre onglets (Framer Motion)
- **Responsive** : Adapté desktop, tablette, mobile

### Composants UI
Utilise **shadcn/ui** :
- Tabs, Cards, Inputs, Buttons
- Select, Textarea, Labels
- Dialogs, Dropdowns, Toast

### Icônes
**Lucide React** pour toutes les icônes

## 💾 Sauvegarde

### Automatique
- Sauvegarde locale après chaque modification (debounce 1s)
- Synchronisation entre onglets du navigateur
- Clé localStorage : `civil360-etude-quantitative`

### Manuelle
- Export JSON : Données complètes
- Export Excel : Format XLSX structuré
- Import : JSON ou Excel

## 📊 Export Excel

Structure du fichier exporté :
1. **Feuille "Informations"** : Métadonnées projet
2. **Feuille "Récapitulatif"** : Indicateurs clés
3. **Feuille "Devis Estimatif"** : Toutes les sections
4. **Feuilles techniques** : Une par catégorie

## 🔧 Personnalisation

### Ajouter une table technique

```typescript
// data/initialData.ts
export function createMaTableCustom(): TableDefinition {
  return {
    id: generateId(),
    title: 'Ma Table Custom',
    category: 'fondations',
    columns: [
      { key: 'col1', label: 'Colonne 1', type: 'text', editable: true },
      { key: 'col2', label: 'Colonne 2', type: 'number', unit: 'm', editable: true },
      { 
        key: 'result', 
        label: 'Résultat', 
        type: 'calculated', 
        unit: 'm²',
        formula: 'col2 * 2' 
      },
    ],
    rows: [],
  };
}
```

### Ajouter une formule

```typescript
// utils/calculations.ts
export function maFormuleCustom(param1: number, param2: number): number {
  return param1 * param2 * 1.5;
}
```

### Modifier le style

```css
/* styles/etude.css */
.ma-classe-custom {
  @apply bg-blue-100 rounded-lg p-4;
}
```

## 🧪 Tests

### Vérification manuelle
1. Créer un nouveau projet
2. Remplir les tables techniques
3. Ajouter des lignes de devis
4. Vérifier les calculs automatiques
5. Tester export/import
6. Vérifier la persistance (refresh)

### Points de contrôle
- ✅ Calculs corrects (volumes, masses, coûts)
- ✅ Sauvegarde automatique
- ✅ Export Excel fonctionnel
- ✅ Import JSON fonctionnel
- ✅ Responsive design
- ✅ Mode impression

## 🐛 Dépannage

### Les données ne se sauvent pas
- Vérifier que localStorage est activé
- Vider le cache du navigateur
- Vérifier la console pour erreurs

### Export Excel échoue
- Vérifier que la bibliothèque `xlsx` est installée
- Autoriser les téléchargements dans le navigateur

### Calculs incorrects
- Vérifier les formules dans `utils/calculations.ts`
- Vérifier que les valeurs sont des nombres valides
- Utiliser le bouton "Recalculer" dans la table

## 📝 Licence

Ce module fait partie de l'application Civil360.
© 2024 Civil360 - Tous droits réservés.

## 👥 Support

Pour toute question ou problème :
- Ouvrir une issue dans le dépôt
- Contacter l'équipe de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Octobre 2024  
**Compatibilité** : Next.js 14+, React 18+

import mongoose, { Schema, Document } from 'mongoose';

export interface IElementStructure extends Document {
  projet_id: mongoose.Types.ObjectId;
  chantier_id: mongoose.Types.ObjectId;
  type_element: 'semelle_isolee' | 'semelle_filante' | 'poteau' | 'poutre' | 'dalle' | 'mur' | 'fondation';
  
  designation: string;
  designation_ar: string;
  
  caracteristiques: {
    nombre: number;
    longueur_poteau?: number;
    largeur_poteau?: number;
    hauteur_poteau?: number;
    volume_beton: number;
    dimensions?: {
      longueur?: number;
      largeur?: number;
      hauteur?: number;
      epaisseur?: number;
    };
  };
  
  beton: {
    type: string;
    quantite_ciment_sacs: number;
    quantite_briquettes: number;
    quantite_m3: number;
    volume_total: number;
    
    dosage: {
      dosage_id: mongoose.Types.ObjectId;
      dosage_nom: string;
      ciment_kg_m3: number;
      gravier_kg_m3: number;
      sable_kg_m3: number;
      eau_litres_m3: number;
    };
    
    quantites_detaillees: {
      ciment: {
        kg_total: number;
        sacs_50kg: number;
        cout_unitaire: number;
        cout_total: number;
      };
      briquettes: {
        nombre: number;
        metre_cube: number;
        cout_unitaire: number;
        cout_total: number;
      };
      gravier: {
        kg_total: number;
        tonnes: number;
        metre_cube: number;
        masse_volumique: number;
        cout_tonne: number;
        cout_total: number;
      };
      sable: {
        kg_total: number;
        tonnes: number;
        metre_cube: number;
        masse_volumique: number;
        cout_tonne: number;
        cout_total: number;
      };
    };
  };
  
  ferraillage: {
    type: string;
    diametre_fer: string;
    longueur_poteau?: number;
    largeur_poteau?: number;
    hauteur_poteau?: number;
    espacement_cadre: number;
    
    cadres: {
      nombre_cadres: number;
      longueur_cadres: number;
      nombre_barres: number;
      nombre_poteau: number;
      nombre_bottes: number;
      nombre_tonnes: number;
      ratio_kg_m3: number;
      cout_kg: number;
      cout_total: number;
    };
    
    armatures_transversales?: {
      diametre_fer: string;
      espacement_cadre: number;
      nombre_cadres: number;
      longueur_cadres: number;
      nombre_barres?: number;
      nombre_poteau: number;
      nombre_bottes: number;
      nombre_tonnes: number;
      ratio_kg_m3: number;
      cout_kg: number;
      cout_total: number;
    };
  };
  
  cout_total: {
    materiaux: number;
    main_oeuvre: number;
    total: number;
  };
}

const ElementStructureSchema: Schema = new Schema({
  projet_id: { type: Schema.Types.ObjectId, ref: 'Projet', required: true },
  chantier_id: { type: Schema.Types.ObjectId, ref: 'Chantier', required: true },
  type_element: {
    type: String,
    enum: ['semelle_isolee', 'semelle_filante', 'poteau', 'poutre', 'dalle', 'mur', 'fondation'],
    required: true
  },
  
  designation: { type: String, required: true },
  designation_ar: { type: String, required: true },
  
  caracteristiques: {
    nombre: { type: Number, required: true },
    longueur_poteau: { type: Number },
    largeur_poteau: { type: Number },
    hauteur_poteau: { type: Number },
    volume_beton: { type: Number, required: true },
    dimensions: {
      longueur: { type: Number },
      largeur: { type: Number },
      hauteur: { type: Number },
      epaisseur: { type: Number }
    }
  },
  
  beton: {
    type: { type: String, required: true },
    quantite_ciment_sacs: { type: Number, required: true },
    quantite_briquettes: { type: Number, required: true },
    quantite_m3: { type: Number, required: true },
    volume_total: { type: Number, required: true },
    
    dosage: {
      dosage_id: { type: Schema.Types.ObjectId, ref: 'Dosage', required: true },
      dosage_nom: { type: String, required: true },
      ciment_kg_m3: { type: Number, required: true },
      gravier_kg_m3: { type: Number, required: true },
      sable_kg_m3: { type: Number, required: true },
      eau_litres_m3: { type: Number, required: true }
    },
    
    quantites_detaillees: {
      ciment: {
        kg_total: { type: Number, required: true },
        sacs_50kg: { type: Number, required: true },
        cout_unitaire: { type: Number, required: true },
        cout_total: { type: Number, required: true }
      },
      briquettes: {
        nombre: { type: Number, required: true },
        metre_cube: { type: Number, required: true },
        cout_unitaire: { type: Number, required: true },
        cout_total: { type: Number, required: true }
      },
      gravier: {
        kg_total: { type: Number, required: true },
        tonnes: { type: Number, required: true },
        metre_cube: { type: Number, required: true },
        masse_volumique: { type: Number, required: true },
        cout_tonne: { type: Number, required: true },
        cout_total: { type: Number, required: true }
      },
      sable: {
        kg_total: { type: Number, required: true },
        tonnes: { type: Number, required: true },
        metre_cube: { type: Number, required: true },
        masse_volumique: { type: Number, required: true },
        cout_tonne: { type: Number, required: true },
        cout_total: { type: Number, required: true }
      }
    }
  },
  
  ferraillage: {
    type: { type: String, required: true },
    diametre_fer: { type: String, required: true },
    longueur_poteau: { type: Number },
    largeur_poteau: { type: Number },
    hauteur_poteau: { type: Number },
    espacement_cadre: { type: Number, required: true },
    
    cadres: {
      nombre_cadres: { type: Number, required: true },
      longueur_cadres: { type: Number, required: true },
      nombre_barres: { type: Number, required: true },
      nombre_poteau: { type: Number, required: true },
      nombre_bottes: { type: Number, required: true },
      nombre_tonnes: { type: Number, required: true },
      ratio_kg_m3: { type: Number, required: true },
      cout_kg: { type: Number, required: true },
      cout_total: { type: Number, required: true }
    },
    
    armatures_transversales: {
      diametre_fer: { type: String },
      espacement_cadre: { type: Number },
      nombre_cadres: { type: Number },
      longueur_cadres: { type: Number },
      nombre_barres: { type: Number },
      nombre_poteau: { type: Number },
      nombre_bottes: { type: Number },
      nombre_tonnes: { type: Number },
      ratio_kg_m3: { type: Number },
      cout_kg: { type: Number },
      cout_total: { type: Number }
    }
  },
  
  cout_total: {
    materiaux: { type: Number, required: true },
    main_oeuvre: { type: Number, required: true },
    total: { type: Number, required: true }
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
ElementStructureSchema.index({ projet_id: 1 });
ElementStructureSchema.index({ chantier_id: 1 });
ElementStructureSchema.index({ type_element: 1 });

export default mongoose.models.ElementStructure || mongoose.model<IElementStructure>('ElementStructure', ElementStructureSchema);

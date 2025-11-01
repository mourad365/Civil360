import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  role_id: mongoose.Types.ObjectId;
  
  modules: {
    projets: {
      lecture: boolean;
      ecriture: boolean;
      suppression: boolean;
      export: boolean;
    };
    chantiers: {
      lecture: boolean;
      ecriture: boolean;
      suppression: boolean;
      validation: boolean;
    };
    elements_structure: {
      lecture: boolean;
      ecriture: boolean;
      calcul: boolean;
      export: boolean;
    };
    achats: {
      lecture: boolean;
      ecriture: boolean;
      validation: boolean;
      export: boolean;
    };
    demandes: {
      lecture: boolean;
      ecriture: boolean;
      validation: boolean;
      approbation: boolean;
    };
    materiaux: {
      lecture: boolean;
      ecriture: boolean;
      gestion_stock: boolean;
      prix: boolean;
    };
    outils: {
      lecture: boolean;
      ecriture: boolean;
      maintenance: boolean;
      transfert: boolean;
    };
    sous_traitants: {
      lecture: boolean;
      ecriture: boolean;
      evaluation: boolean;
      contrats: boolean;
    };
    journaliers: {
      lecture: boolean;
      ecriture: boolean;
      validation: boolean;
      export: boolean;
    };
    Users: {
      lecture: boolean;
      ecriture: boolean;
      gestion_roles: boolean;
      suppression: boolean;
    };
    rapports: {
      lecture: boolean;
      generation: boolean;
      export: boolean;
      dashboards: boolean;
    };
    parametrage: {
      lecture: boolean;
      ecriture: boolean;
      systeme: boolean;
      backup: boolean;
    };
  };
}

const PermissionSchema: Schema = new Schema({
  role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true, unique: true },
  
  modules: {
    projets: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      suppression: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    chantiers: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      suppression: { type: Boolean, default: false },
      validation: { type: Boolean, default: false }
    },
    elements_structure: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      calcul: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    achats: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      validation: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    demandes: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      validation: { type: Boolean, default: false },
      approbation: { type: Boolean, default: false }
    },
    materiaux: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      gestion_stock: { type: Boolean, default: false },
      prix: { type: Boolean, default: false }
    },
    outils: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      maintenance: { type: Boolean, default: false },
      transfert: { type: Boolean, default: false }
    },
    sous_traitants: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      evaluation: { type: Boolean, default: false },
      contrats: { type: Boolean, default: false }
    },
    journaliers: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      validation: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    Users: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      gestion_roles: { type: Boolean, default: false },
      suppression: { type: Boolean, default: false }
    },
    rapports: {
      lecture: { type: Boolean, default: false },
      generation: { type: Boolean, default: false },
      export: { type: Boolean, default: false },
      dashboards: { type: Boolean, default: false }
    },
    parametrage: {
      lecture: { type: Boolean, default: false },
      ecriture: { type: Boolean, default: false },
      systeme: { type: Boolean, default: false },
      backup: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
PermissionSchema.index({ role_id: 1 });

export default mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);

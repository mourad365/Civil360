import { Journalier, Soustraitant, Pointage } from '@/types/personnel';

const API_BASE = '/api/personnel';

// ============ OUVRIERS (Journaliers) ============

export async function fetchOuvriers(): Promise<Journalier[]> {
  try {
    const response = await fetch(`${API_BASE}/ouvriers`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch ouvriers');
    }
    
    return data.ouvriers || [];
  } catch (error) {
    console.error('Error fetching ouvriers:', error);
    return [];
  }
}

export async function createOuvrier(ouvrier: Omit<Journalier, 'id'>): Promise<Journalier | null> {
  try {
    const response = await fetch(`${API_BASE}/ouvriers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ouvrier),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create ouvrier');
    }
    
    return data.ouvrier;
  } catch (error: any) {
    console.error('Error creating ouvrier:', error);
    alert(error.message || 'Erreur lors de la création de l\'ouvrier');
    return null;
  }
}

export async function updateOuvrierPointage(
  journalierId: string,
  pointage: Pointage
): Promise<Journalier | null> {
  try {
    const response = await fetch(`${API_BASE}/ouvriers`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: journalierId,
        pointage,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update pointage');
    }
    
    return data.ouvrier;
  } catch (error: any) {
    console.error('Error updating pointage:', error);
    alert(error.message || 'Erreur lors de la mise à jour du pointage');
    return null;
  }
}

export async function updateOuvrier(ouvrier: Journalier): Promise<Journalier | null> {
  try {
    const response = await fetch(`${API_BASE}/ouvriers`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: ouvrier.id,
        nom: ouvrier.nom,
        telephone: ouvrier.telephone,
        fonction: ouvrier.fonction,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update ouvrier');
    }
    
    return data.ouvrier;
  } catch (error: any) {
    console.error('Error updating ouvrier:', error);
    alert(error.message || 'Erreur lors de la mise à jour de l\'ouvrier');
    return null;
  }
}

export async function deleteOuvrier(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/ouvriers?id=${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete ouvrier');
    }
    
    return true;
  } catch (error: any) {
    console.error('Error deleting ouvrier:', error);
    alert(error.message || 'Erreur lors de la suppression de l\'ouvrier');
    return false;
  }
}

// ============ DÉCOMPTES (Sous-traitants) ============

export async function fetchDecomptes(): Promise<Soustraitant[]> {
  try {
    const response = await fetch(`${API_BASE}/decomptes`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch decomptes');
    }
    
    return data.decomptes || [];
  } catch (error) {
    console.error('Error fetching decomptes:', error);
    return [];
  }
}

export async function createDecompte(decompte: Soustraitant): Promise<Soustraitant | null> {
  try {
    const response = await fetch(`${API_BASE}/decomptes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(decompte),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create decompte');
    }
    
    return data.decompte;
  } catch (error: any) {
    console.error('Error creating decompte:', error);
    alert(error.message || 'Erreur lors de la création du décompte');
    return null;
  }
}

export async function updateDecompteStatut(id: string, statut: 'pending' | 'paid'): Promise<Soustraitant | null> {
  try {
    const response = await fetch(`${API_BASE}/decomptes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        statut,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update decompte');
    }
    
    return data.decompte;
  } catch (error: any) {
    console.error('Error updating decompte:', error);
    alert(error.message || 'Erreur lors de la mise à jour du décompte');
    return null;
  }
}

export async function updateDecompte(decompte: Soustraitant): Promise<Soustraitant | null> {
  try {
    const response = await fetch(`${API_BASE}/decomptes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: decompte.id,
        nom: decompte.nom,
        telephone: decompte.telephone,
        chantier: decompte.chantier,
        date: decompte.date,
        taches: decompte.taches,
        statut: decompte.statut,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update decompte');
    }
    
    return data.decompte;
  } catch (error: any) {
    console.error('Error updating decompte:', error);
    alert(error.message || 'Erreur lors de la mise à jour du décompte');
    return null;
  }
}

export async function deleteDecompte(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/decomptes?id=${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete decompte');
    }
    
    return true;
  } catch (error: any) {
    console.error('Error deleting decompte:', error);
    alert(error.message || 'Erreur lors de la suppression du décompte');
    return false;
  }
}

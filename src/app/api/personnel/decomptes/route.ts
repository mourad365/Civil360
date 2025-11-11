import { NextRequest, NextResponse } from 'next/server';
import Decompte from '@/server/models/Decompte';
import dbConnect from '@/lib/mongodb';

// GET - Récupérer tous les décomptes
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const statut = searchParams.get('statut');
    const chantier = searchParams.get('chantier');
    
    const filter: any = {};
    if (statut) filter.statut = statut;
    if (chantier) filter.chantier = chantier;
    
    const decomptes = await Decompte.find(filter).sort({ date: -1 }).lean();
    
    return NextResponse.json({ 
      success: true, 
      decomptes: decomptes.map(d => ({
        id: d.id_decompte,
        nom: d.nom,
        telephone: d.telephone,
        chantier: d.chantier,
        date: d.date,
        taches: d.taches,
        statut: d.statut,
        montantTotal: d.montantTotal
      }))
    });
  } catch (error: any) {
    console.error('Get decomptes error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch decomptes', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Créer un nouveau décompte
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Validation
    if (!body.nom || !body.telephone || !body.chantier || !body.date || !body.taches || body.taches.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: nom, telephone, chantier, date, taches' 
      }, { status: 400 });
    }
    
    // Calculer le montant total
    const montantTotal = body.taches.reduce((sum: number, tache: any) => {
      return sum + (tache.quantite * tache.prix);
    }, 0);
    
    const data = {
      id_decompte: body.id || `DEC-${Date.now()}`,
      nom: body.nom,
      telephone: body.telephone,
      chantier: body.chantier,
      date: new Date(body.date),
      taches: body.taches,
      statut: body.statut || 'pending',
      montantTotal
    };
    
    const decompte = new Decompte(data);
    await decompte.save();
    
    return NextResponse.json({ 
      success: true, 
      decompte: {
        id: decompte.id_decompte,
        nom: decompte.nom,
        telephone: decompte.telephone,
        chantier: decompte.chantier,
        date: decompte.date,
        taches: decompte.taches,
        statut: decompte.statut,
        montantTotal: decompte.montantTotal
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create decompte error:', error);
    return NextResponse.json({ 
      error: 'Failed to create decompte', 
      details: error.message 
    }, { status: 500 });
  }
}

// PUT - Mettre à jour un décompte (toutes les données)
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json({ 
        error: 'Missing required field: id' 
      }, { status: 400 });
    }
    
    const updateData: any = {};
    if (body.nom) updateData.nom = body.nom;
    if (body.telephone) updateData.telephone = body.telephone;
    if (body.chantier) updateData.chantier = body.chantier;
    if (body.date) updateData.date = new Date(body.date);
    if (body.statut) updateData.statut = body.statut;
    if (body.taches) {
      updateData.taches = body.taches;
      updateData.montantTotal = body.taches.reduce((sum: number, tache: any) => {
        return sum + (tache.quantite * tache.prix);
      }, 0);
    }
    
    const decompte = await Decompte.findOneAndUpdate(
      { id_decompte: body.id },
      updateData,
      { new: true }
    );
    
    if (!decompte) {
      return NextResponse.json({ 
        error: 'Decompte not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      decompte: {
        id: decompte.id_decompte,
        nom: decompte.nom,
        telephone: decompte.telephone,
        chantier: decompte.chantier,
        date: decompte.date,
        taches: decompte.taches,
        statut: decompte.statut,
        montantTotal: decompte.montantTotal
      }
    });
  } catch (error: any) {
    console.error('Update decompte error:', error);
    return NextResponse.json({ 
      error: 'Failed to update decompte', 
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE - Supprimer un décompte
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Missing required parameter: id' 
      }, { status: 400 });
    }
    
    const decompte = await Decompte.findOneAndDelete({ id_decompte: id });
    
    if (!decompte) {
      return NextResponse.json({ 
        error: 'Decompte not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Décompte supprimé avec succès' 
    });
  } catch (error: any) {
    console.error('Delete decompte error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete decompte', 
      details: error.message 
    }, { status: 500 });
  }
}

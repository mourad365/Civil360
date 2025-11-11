import { NextRequest, NextResponse } from 'next/server';
import Personnel from '@/server/models/Personnel';
import dbConnect from '@/lib/mongodb';

// GET - Récupérer tous les ouvriers
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const actif = searchParams.get('actif');
    
    const filter = actif !== null ? { actif: actif === 'true' } : {};
    
    const ouvriers = await Personnel.find(filter).sort({ nom: 1 }).lean();
    
    return NextResponse.json({ 
      success: true, 
      ouvriers: ouvriers.map(o => ({
        id: o.id_personnel,
        nom: o.nom,
        telephone: o.telephone,
        fonction: o.fonction,
        pointages: o.pointages || [],
        actif: o.actif
      }))
    });
  } catch (error: any) {
    console.error('Get ouvriers error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch ouvriers', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Créer un nouvel ouvrier
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Validation
    if (!body.nom || !body.telephone || !body.fonction) {
      return NextResponse.json({ 
        error: 'Missing required fields: nom, telephone, fonction' 
      }, { status: 400 });
    }
    
    // Vérifier si l'ouvrier existe déjà
    const existingOuvrier = await Personnel.findOne({ telephone: body.telephone });
    if (existingOuvrier) {
      return NextResponse.json({ 
        error: 'Un ouvrier avec ce numéro de téléphone existe déjà' 
      }, { status: 409 });
    }
    
    const data = {
      id_personnel: body.telephone, // Utilise le téléphone comme ID
      nom: body.nom,
      telephone: body.telephone,
      fonction: body.fonction,
      pointages: body.pointages || [],
      actif: true
    };
    
    const ouvrier = new Personnel(data);
    await ouvrier.save();
    
    return NextResponse.json({ 
      success: true, 
      ouvrier: {
        id: ouvrier.id_personnel,
        nom: ouvrier.nom,
        telephone: ouvrier.telephone,
        fonction: ouvrier.fonction,
        pointages: ouvrier.pointages,
        actif: ouvrier.actif
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create ouvrier error:', error);
    return NextResponse.json({ 
      error: 'Failed to create ouvrier', 
      details: error.message 
    }, { status: 500 });
  }
}

// PUT - Mettre à jour un ouvrier (pointage)
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    if (!body.id || !body.pointage) {
      return NextResponse.json({ 
        error: 'Missing required fields: id, pointage' 
      }, { status: 400 });
    }
    
    const ouvrier = await Personnel.findOne({ id_personnel: body.id });
    
    if (!ouvrier) {
      return NextResponse.json({ 
        error: 'Ouvrier not found' 
      }, { status: 404 });
    }
    
    // Trouver et mettre à jour le pointage existant ou en ajouter un nouveau
    const pointageIndex = ouvrier.pointages.findIndex(
      (p: any) => p.semaine === body.pointage.semaine && p.chantier === body.pointage.chantier
    );
    
    if (pointageIndex >= 0) {
      ouvrier.pointages[pointageIndex] = body.pointage;
    } else {
      ouvrier.pointages.push(body.pointage);
    }
    
    await ouvrier.save();
    
    return NextResponse.json({ 
      success: true, 
      ouvrier: {
        id: ouvrier.id_personnel,
        nom: ouvrier.nom,
        telephone: ouvrier.telephone,
        fonction: ouvrier.fonction,
        pointages: ouvrier.pointages,
        actif: ouvrier.actif
      }
    });
  } catch (error: any) {
    console.error('Update ouvrier error:', error);
    return NextResponse.json({ 
      error: 'Failed to update ouvrier', 
      details: error.message 
    }, { status: 500 });
  }
}

// PATCH - Mettre à jour les informations de base d'un ouvrier
export async function PATCH(req: NextRequest) {
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
    if (body.fonction) updateData.fonction = body.fonction;
    
    const ouvrier = await Personnel.findOneAndUpdate(
      { id_personnel: body.id },
      updateData,
      { new: true }
    );
    
    if (!ouvrier) {
      return NextResponse.json({ 
        error: 'Ouvrier not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      ouvrier: {
        id: ouvrier.id_personnel,
        nom: ouvrier.nom,
        telephone: ouvrier.telephone,
        fonction: ouvrier.fonction,
        pointages: ouvrier.pointages,
        actif: ouvrier.actif
      }
    });
  } catch (error: any) {
    console.error('Patch ouvrier error:', error);
    return NextResponse.json({ 
      error: 'Failed to update ouvrier', 
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE - Supprimer un ouvrier (soft delete)
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
    
    const ouvrier = await Personnel.findOneAndUpdate(
      { id_personnel: id },
      { actif: false },
      { new: true }
    );
    
    if (!ouvrier) {
      return NextResponse.json({ 
        error: 'Ouvrier not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Ouvrier désactivé avec succès' 
    });
  } catch (error: any) {
    console.error('Delete ouvrier error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete ouvrier', 
      details: error.message 
    }, { status: 500 });
  }
}

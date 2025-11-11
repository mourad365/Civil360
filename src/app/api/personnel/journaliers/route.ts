import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Journalier from '@/server/models/Journalier';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit')) || 20;

    const journaliers = await Journalier.find({}).sort({ date_rapport: -1 }).limit(limit).lean();
    return NextResponse.json({ success: true, journaliers });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Get journaliers error:', error);
    return NextResponse.json({ error: 'Failed to fetch journaliers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    const body = await req.json();

    // Simple mapping: allow client to send main_oeuvre array and basic fields
    const data: any = {
      projet_id: body.projet_id ? body.projet_id : new mongoose.Types.ObjectId(),
      chantier_id: body.chantier_id ? body.chantier_id : new mongoose.Types.ObjectId(),
      date_rapport: body.date_rapport ? new Date(body.date_rapport) : new Date(),
      redige_par: authUser.id,
      main_oeuvre: body.main_oeuvre || [],
      observations: body.observations || '',
      note_journee: body.note_journee || 0
    };

    const j = new Journalier(data);
    await j.save();

    return NextResponse.json({ success: true, journalier: j }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Create journalier error:', error);
    return NextResponse.json({ error: 'Failed to create journalier' }, { status: 500 });
  }
}

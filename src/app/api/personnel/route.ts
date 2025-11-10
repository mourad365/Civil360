import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Utilisateur from '@/server/models/Utilisateur';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const users = await Utilisateur.find({ is_active: true }).select('profil.prenom profil.nom profil.telephone profil.departement profil.avatar');
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Get personnel error:', error);
    return NextResponse.json({ error: 'Failed to fetch personnel' }, { status: 500 });
  }
}

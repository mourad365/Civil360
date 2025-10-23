import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import ProjetModel from '@/server/models/Projet';

export async function GET(req: NextRequest) {
  try {
    await getAuthUser(req); // Optional auth
    
    // Calculate dashboard stats using MongoDB models
    const activeProjects = await ProjetModel.countDocuments({ statut: 'en_cours' });
    const totalProjects = await ProjetModel.countDocuments();
    
    const stats = {
      activeProjects,
      activeTeams: activeProjects * 3, // Simulated team count
      qualityAlerts: 2, // Placeholder - would need QualityCheck model
      productivityGain: 32 // Placeholder - would need calculation logic
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

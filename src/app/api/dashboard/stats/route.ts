import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { mongoStorage } from '@/server/storage-mongo';

export async function GET(req: NextRequest) {
  try {
    await getAuthUser(req); // Optional auth
    const stats = await mongoStorage.getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

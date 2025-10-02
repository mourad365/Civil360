import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Equipment from '@/server/models/Equipment';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    
    const equipment = await Equipment.findById(params.id)
      .populate('location.currentProject', 'name code location')
      .populate('assignment.assignedTo', 'name email phone')
      .populate('assignment.assignedProject', 'name code')
      .populate('rental.supplier', 'name contact rating')
      .populate('transfers.fromProject', 'name code')
      .populate('transfers.toProject', 'name code')
      .populate('transfers.requestedBy', 'name email')
      .populate('transfers.approvedBy', 'name email');

    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, equipment });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Get equipment error:', error);
    return NextResponse.json({ error: 'Failed to fetch equipment' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    const body = await req.json();
    
    const equipment = await Equipment.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).populate('location.currentProject', 'name code');

    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Equipment updated successfully',
      equipment
    });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Update equipment error:', error);
    return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    
    const equipment = await Equipment.findByIdAndUpdate(
      params.id,
      { isActive: false },
      { new: true }
    );

    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Equipment deleted successfully'
    });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Delete equipment error:', error);
    return NextResponse.json({ error: 'Failed to delete equipment' }, { status: 500 });
  }
}

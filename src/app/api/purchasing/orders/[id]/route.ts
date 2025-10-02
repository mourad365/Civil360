import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import PurchaseOrder from '@/server/models/PurchaseOrder';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    
    const order = await PurchaseOrder.findById(params.id)
      .populate('project', 'name code location')
      .populate('supplier', 'name contact rating')
      .populate('requestedBy', 'name email phone')
      .populate('approvedBy', 'name email')
      .populate('tracking.updatedBy', 'name email');

    if (!order) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Get purchase order error:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase order' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    const body = await req.json();
    
    const order = await PurchaseOrder.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate('project', 'name code')
      .populate('supplier', 'name contact');

    if (!order) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Purchase order updated successfully',
      order
    });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Update purchase order error:', error);
    return NextResponse.json({ error: 'Failed to update purchase order' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    
    const order = await PurchaseOrder.findByIdAndUpdate(
      params.id,
      { isActive: false },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Purchase order deleted successfully'
    });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Delete purchase order error:', error);
    return NextResponse.json({ error: 'Failed to delete purchase order' }, { status: 500 });
  }
}

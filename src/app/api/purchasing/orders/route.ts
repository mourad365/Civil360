import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import PurchaseOrder from '@/server/models/PurchaseOrder';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const project = searchParams.get('project');
    const supplier = searchParams.get('supplier');
    const search = searchParams.get('search');

    const filter: any = { isActive: true };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;
    if (supplier) filter.supplier = supplier;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'items.description': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await PurchaseOrder.find(filter)
      .populate('project', 'name code')
      .populate('supplier', 'name contact.email contact.phone')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await PurchaseOrder.countDocuments(filter);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Get purchase orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    const body = await req.json();
    
    const orderCount = await PurchaseOrder.countDocuments();
    const orderNumber = `PO${String(orderCount + 1).padStart(6, '0')}`;

    const orderData = {
      ...body,
      orderNumber,
      requestedBy: authUser.id
    };

    const order = new PurchaseOrder(orderData);
    await order.save();

    const populatedOrder = await PurchaseOrder.findById(order._id)
      .populate('project', 'name code')
      .populate('supplier', 'name contact')
      .populate('requestedBy', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Purchase order created successfully',
      order: populatedOrder
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Create purchase order error:', error);
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 });
  }
}

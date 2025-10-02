import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Equipment from '@/server/models/Equipment';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const project = searchParams.get('project');
    const search = searchParams.get('search');

    const filter: any = { isActive: true };
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (project) filter['assignment.assignedProject'] = project;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'specifications.model': { $regex: search, $options: 'i' } }
      ];
    }

    const equipment = await Equipment.find(filter)
      .populate('location.currentProject', 'name code')
      .populate('assignment.assignedTo', 'name email')
      .populate('assignment.assignedProject', 'name code')
      .populate('rental.supplier', 'name contact')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Equipment.countDocuments(filter);

    return NextResponse.json({
      success: true,
      equipment,
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
    console.error('Get equipment error:', error);
    return NextResponse.json({ error: 'Failed to fetch equipment' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const body = await req.json();
    
    const equipment = new Equipment(body);
    await equipment.save();

    const populatedEquipment = await Equipment.findById(equipment._id)
      .populate('location.currentProject', 'name code');

    return NextResponse.json({
      success: true,
      message: 'Equipment created successfully',
      equipment: populatedEquipment
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Create equipment error:', error);
    return NextResponse.json({ error: 'Failed to create equipment' }, { status: 500 });
  }
}

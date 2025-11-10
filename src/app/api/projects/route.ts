import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getAuthUser } from '@/lib/auth-helpers';
import { insertProjectSchema } from '@shared/schema';
import Project from '@/server/models/Project';

export async function GET(req: NextRequest) {
  try {
    await getAuthUser(req); // Optional auth
    
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const filter: any = { isActive: true };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'client.name': { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
      .populate('team.projectManager', 'name email role')
      .populate('team.engineers', 'name email role')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(filter);

    return NextResponse.json({
      success: true,
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    const body = await req.json();
    
    const validatedData = insertProjectSchema.parse(body);
    const project = new Project(validatedData);
    await project.save();
    
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Invalid project data' },
      { status: 400 }
    );
  }
}

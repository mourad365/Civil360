import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Notification from '@/server/models/Notification';

export async function GET(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const unread = searchParams.get('unread');

    const filter: any = {
      'recipients.user': authUser.id,
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } }
      ]
    };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (unread === 'true') {
      filter['recipients.read'] = false;
    }

    const notifications = await Notification.find(filter)
      .populate('createdBy', 'name email')
      .populate('relatedEntity.entityId')
      .sort({ priority: 1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      'recipients.user': authUser.id,
      'recipients.read': false,
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } }
      ]
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
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
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    const body = await req.json();
    
    const notification = new Notification({
      ...body,
      createdBy: authUser.id
    });

    await notification.save();

    const populatedNotification = await Notification.findById(notification._id)
      .populate('createdBy', 'name email')
      .populate('recipients.user', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Notification created successfully',
      notification: populatedNotification
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Create notification error:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Notification from '@/server/models/Notification';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth(req);
    
    const notification = await Notification.findById(params.id);
    
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    const recipient = (notification.recipients as any[]).find(
      r => r.user.toString() === authUser.id
    );

    if (!recipient) {
      return NextResponse.json(
        { error: 'Not authorized to read this notification' },
        { status: 403 }
      );
    }

    recipient.read = true;
    recipient.readAt = new Date();

    await notification.save();

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Mark notification as read error:', error);
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
  }
}

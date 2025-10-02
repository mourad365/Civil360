import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Notification from '@/server/models/Notification';

export async function PUT(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    
    await Notification.updateMany(
      {
        'recipients.user': authUser.id,
        'recipients.read': false,
        isActive: true
      },
      {
        $set: {
          'recipients.$.read': true,
          'recipients.$.readAt': new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Mark all notifications as read error:', error);
    return NextResponse.json({ error: 'Failed to mark all notifications as read' }, { status: 500 });
  }
}

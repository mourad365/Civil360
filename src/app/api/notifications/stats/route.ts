import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Notification from '@/server/models/Notification';

export async function GET(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);

    const stats = await Notification.aggregate([
      {
        $match: {
          'recipients.user': authUser.id,
          isActive: true,
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: { $gte: new Date() } }
          ]
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            priority: '$priority',
            category: '$category'
          },
          count: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [
                { $eq: ['$recipients.read', false] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const summary = {
      total: 0,
      unread: 0,
      byType: {} as any,
      byPriority: {} as any,
      byCategory: {} as any
    };

    stats.forEach(stat => {
      summary.total += stat.count;
      summary.unread += stat.unreadCount;

      if (!summary.byType[stat._id.type]) {
        summary.byType[stat._id.type] = { total: 0, unread: 0 };
      }
      summary.byType[stat._id.type].total += stat.count;
      summary.byType[stat._id.type].unread += stat.unreadCount;

      if (!summary.byPriority[stat._id.priority]) {
        summary.byPriority[stat._id.priority] = { total: 0, unread: 0 };
      }
      summary.byPriority[stat._id.priority].total += stat.count;
      summary.byPriority[stat._id.priority].unread += stat.unreadCount;

      if (!summary.byCategory[stat._id.category]) {
        summary.byCategory[stat._id.category] = { total: 0, unread: 0 };
      }
      summary.byCategory[stat._id.category].total += stat.count;
      summary.byCategory[stat._id.category].unread += stat.unreadCount;
    });

    return NextResponse.json({ success: true, stats: summary });
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Get notification stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch notification statistics' }, { status: 500 });
  }
}

import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Notification from '../models/Notification';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      priority,
      unread
    } = req.query;

    const filter: any = {
      'recipients.user': req.user!.id,
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
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      'recipients.user': req.user!.id,
      'recipients.read': false,
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } }
      ]
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const recipient = notification.recipients.find(
      r => r.user.toString() === req.user!.id
    );

    if (!recipient) {
      return res.status(403).json({ error: 'Not authorized to read this notification' });
    }

    recipient.read = true;
    recipient.readAt = new Date();

    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error: any) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        'recipients.user': req.user!.id,
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

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error: any) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Create notification (for system use)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const notification = new Notification({
      ...req.body,
      createdBy: req.user!.id
    });

    await notification.save();

    const populatedNotification = await Notification.findById(notification._id)
      .populate('createdBy', 'name email')
      .populate('recipients.user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification: populatedNotification
    });
  } catch (error: any) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Get notification statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;

    const stats = await Notification.aggregate([
      {
        $match: {
          'recipients.user': userId,
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

      // Group by type
      if (!summary.byType[stat._id.type]) {
        summary.byType[stat._id.type] = { total: 0, unread: 0 };
      }
      summary.byType[stat._id.type].total += stat.count;
      summary.byType[stat._id.type].unread += stat.unreadCount;

      // Group by priority
      if (!summary.byPriority[stat._id.priority]) {
        summary.byPriority[stat._id.priority] = { total: 0, unread: 0 };
      }
      summary.byPriority[stat._id.priority].total += stat.count;
      summary.byPriority[stat._id.priority].unread += stat.unreadCount;

      // Group by category
      if (!summary.byCategory[stat._id.category]) {
        summary.byCategory[stat._id.category] = { total: 0, unread: 0 };
      }
      summary.byCategory[stat._id.category].total += stat.count;
      summary.byCategory[stat._id.category].unread += stat.unreadCount;
    });

    res.json({ success: true, stats: summary });
  } catch (error: any) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ error: 'Failed to fetch notification statistics' });
  }
});

export default router;

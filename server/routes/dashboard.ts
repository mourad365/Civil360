import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Project from '../models/Project';
import Equipment from '../models/Equipment';
import PurchaseOrder from '../models/PurchaseOrder';
import Supplier from '../models/Supplier';
import User from '../models/User';
import Notification from '../models/Notification';

const router = express.Router();

// General Director Dashboard
router.get('/general-director', authenticateToken, async (req, res) => {
  try {
    // Key Performance Indicators
    const activeProjects = await Project.countDocuments({ 
      status: 'in_progress', 
      isActive: true 
    });

    // Budget calculations
    const budgetStats = await Project.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget.estimated' },
          allocatedBudget: { $sum: '$budget.allocated' },
          spentBudget: { $sum: '$budget.spent' }
        }
      }
    ]);

    const budget = budgetStats[0] || { totalBudget: 0, allocatedBudget: 0, spentBudget: 0 };
    const budgetUtilization = budget.allocatedBudget > 0 
      ? (budget.spentBudget / budget.allocatedBudget) * 100 
      : 0;

    // Overall progress calculation
    const progressStats = await Project.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgProgress: { $avg: '$progress.overall' }
        }
      }
    ]);

    const overallProgress = progressStats[0]?.avgProgress || 0;

    // Delay analysis
    const delayedProjects = await Project.countDocuments({
      'dates.endDate': { $lt: new Date() },
      status: { $in: ['planning', 'in_progress'] },
      isActive: true
    });

    const totalProjects = await Project.countDocuments({ isActive: true });
    const onTimePerformance = totalProjects > 0 
      ? ((totalProjects - delayedProjects) / totalProjects) * 100 
      : 100;

    // Active collaborators
    const activeUsers = await User.countDocuments({ isActive: true });

    // Critical alerts
    const criticalAlerts = await Notification.countDocuments({
      priority: 'critical',
      isActive: true,
      resolvedAt: { $exists: false }
    });

    // Project status distribution with map data
    const projectStatusMap = await Project.find({
      isActive: true,
      'location.coordinates.lat': { $exists: true },
      'location.coordinates.lng': { $exists: true }
    }).select('name code status priority progress location dates');

    const mapProjects = projectStatusMap.map(project => {
      let statusColor = '#22c55e'; // Green - on time
      
      // Determine status color based on schedule and progress
      if (project.dates.endDate < new Date() && project.status !== 'completed') {
        statusColor = '#ef4444'; // Red - overdue
      } else if (project.progress.overall < 50) {
        statusColor = '#f59e0b'; // Orange - attention needed
      }

      return {
        id: project._id,
        name: project.name,
        code: project.code,
        status: project.status,
        priority: project.priority,
        progress: project.progress.overall,
        coordinates: project.location.coordinates,
        statusColor
      };
    });

    // Detailed project tracking
    const detailedProjects = await Project.find({ isActive: true })
      .populate('team.projectManager', 'name')
      .select('name code status priority progress budget dates location risks')
      .sort({ 'dates.startDate': -1 })
      .limit(20);

    const projectsWithMetrics = detailedProjects.map(project => {
      const budgetUsage = project.budget.allocated > 0 
        ? (project.budget.spent / project.budget.allocated) * 100 
        : 0;

      const daysRemaining = Math.ceil(
        (project.dates.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      const openRisks = project.risks.filter(r => r.status === 'open').length;

      return {
        id: project._id,
        name: project.name,
        code: project.code,
        status: project.status,
        progress: project.progress.overall,
        budgetUsage: Math.round(budgetUsage),
        budgetSpent: project.budget.spent,
        budgetAllocated: project.budget.allocated,
        daysRemaining,
        location: project.location.address,
        manager: project.team.projectManager,
        openRisks
      };
    });

    // Financial analysis with budget breakdown
    const budgetBreakdown = await Project.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          labor: { $sum: '$budget.labor' },
          materials: { $sum: '$budget.materials' },
          equipment: { $sum: '$budget.equipment' },
          contingency: { $sum: '$budget.contingency' }
        }
      }
    ]);

    const breakdown = budgetBreakdown[0] || { labor: 0, materials: 0, equipment: 0, contingency: 0 };
    const totalBudgetAmount = breakdown.labor + breakdown.materials + breakdown.equipment + breakdown.contingency;

    const financialAnalysis = {
      budgetBreakdown: {
        labor: { 
          amount: breakdown.labor, 
          percentage: totalBudgetAmount > 0 ? (breakdown.labor / totalBudgetAmount) * 100 : 0 
        },
        materials: { 
          amount: breakdown.materials, 
          percentage: totalBudgetAmount > 0 ? (breakdown.materials / totalBudgetAmount) * 100 : 0 
        },
        equipment: { 
          amount: breakdown.equipment, 
          percentage: totalBudgetAmount > 0 ? (breakdown.equipment / totalBudgetAmount) * 100 : 0 
        },
        contingency: { 
          amount: breakdown.contingency, 
          percentage: totalBudgetAmount > 0 ? (breakdown.contingency / totalBudgetAmount) * 100 : 0 
        }
      },
      monthlyTrends: [] // This would be calculated with time-series data
    };

    // Resource management overview
    const equipmentStats = await Equipment.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          utilizationRate: { $avg: '$utilization.utilizationRate' }
        }
      }
    ]);

    const resourceOverview = {
      equipment: {
        total: await Equipment.countDocuments({ isActive: true }),
        available: equipmentStats.find(s => s._id === 'available')?.count || 0,
        inUse: equipmentStats.find(s => s._id === 'in_use')?.count || 0,
        maintenance: equipmentStats.find(s => s._id === 'maintenance')?.count || 0,
        avgUtilization: equipmentStats.reduce((sum, stat) => sum + (stat.utilizationRate || 0), 0) / equipmentStats.length || 0
      }
    };

    // Strategic calendar - key events
    const upcomingDeadlines = await Project.find({
      'dates.endDate': { 
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
      },
      status: { $in: ['planning', 'in_progress'] },
      isActive: true
    }).select('name dates.endDate').limit(10);

    const upcomingDeliveries = await PurchaseOrder.find({
      'dates.expectedDelivery': {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
      },
      status: { $in: ['approved', 'sent', 'confirmed'] },
      isActive: true
    })
    .populate('project', 'name')
    .populate('supplier', 'name')
    .select('orderNumber dates.expectedDelivery project supplier')
    .limit(10);

    const strategicCalendar = {
      projectDeadlines: upcomingDeadlines,
      deliveries: upcomingDeliveries,
      meetings: [], // This would come from a meetings collection
      milestones: [] // This would come from project milestones
    };

    // Notifications center
    const notifications = await Notification.find({
      'recipients.user': req.user!.id,
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } }
      ]
    })
    .populate('createdBy', 'name')
    .sort({ priority: 1, createdAt: -1 })
    .limit(20);

    const notificationsByType = {
      urgent: notifications.filter(n => n.type === 'urgent').length,
      warning: notifications.filter(n => n.type === 'warning').length,
      info: notifications.filter(n => n.type === 'info').length,
      unread: notifications.filter(n => !n.recipients.find(r => r.user.toString() === req.user!.id)?.read).length
    };

    // Compile dashboard data
    const dashboard = {
      kpis: {
        activeProjects,
        totalBudget: budget.totalBudget,
        budgetUtilization: Math.round(budgetUtilization),
        overallProgress: Math.round(overallProgress),
        onTimePerformance: Math.round(onTimePerformance),
        activeCollaborators: activeUsers,
        criticalAlerts
      },
      interactiveMap: {
        projects: mapProjects
      },
      projectTracking: projectsWithMetrics,
      financialAnalysis,
      resourceManagement: resourceOverview,
      strategicCalendar,
      notificationsCenter: {
        notifications,
        summary: notificationsByType
      }
    };

    res.json({ success: true, dashboard });
  } catch (error: any) {
    console.error('Get general director dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Project Engineer Dashboard
router.get('/project-engineer', authenticateToken, async (req, res) => {
  try {
    // Get projects assigned to this engineer
    const engineerProjects = await Project.find({
      $or: [
        { 'team.projectManager': req.user!.id },
        { 'team.engineers': req.user!.id }
      ],
      isActive: true
    }).populate('team.projectManager', 'name');

    // Recent activities and tasks
    const recentActivities = await Project.aggregate([
      {
        $match: {
          $or: [
            { 'team.projectManager': req.user!.id },
            { 'team.engineers': req.user!.id }
          ],
          isActive: true
        }
      },
      { $unwind: '$dailyReports' },
      { $sort: { 'dailyReports.date': -1 } },
      { $limit: 10 }
    ]);

    // Upcoming deadlines for engineer's projects
    const upcomingTasks = await Project.find({
      $or: [
        { 'team.projectManager': req.user!.id },
        { 'team.engineers': req.user!.id }
      ],
      'phases.endDate': {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      isActive: true
    }).select('name phases');

    const dashboard = {
      projects: engineerProjects.map(project => ({
        id: project._id,
        name: project.name,
        code: project.code,
        status: project.status,
        progress: project.progress.overall,
        nextPhase: project.phases.find(p => p.status === 'pending')?.name || 'N/A',
        budget: {
          allocated: project.budget.allocated,
          spent: project.budget.spent
        }
      })),
      recentActivities,
      upcomingTasks: upcomingTasks.map(project => 
        project.phases
          .filter(phase => 
            phase.endDate >= new Date() && 
            phase.endDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          )
          .map(phase => ({
            projectName: project.name,
            taskName: phase.name,
            deadline: phase.endDate,
            status: phase.status
          }))
      ).flat(),
      notifications: await Notification.find({
        'recipients.user': req.user!.id,
        category: { $in: ['project', 'quality', 'safety'] },
        isActive: true
      }).limit(10)
    };

    res.json({ success: true, dashboard });
  } catch (error: any) {
    console.error('Get project engineer dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;

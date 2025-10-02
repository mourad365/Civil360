import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Project from '@/server/models/Project';
import User from '@/server/models/User';
import Notification from '@/server/models/Notification';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const activeProjects = await Project.countDocuments({ 
      status: 'in_progress', 
      isActive: true 
    });

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

    const delayedProjects = await Project.countDocuments({
      'dates.endDate': { $lt: new Date() },
      status: { $in: ['planning', 'in_progress'] },
      isActive: true
    });

    const totalProjects = await Project.countDocuments({ isActive: true });
    const onTimePerformance = totalProjects > 0 
      ? ((totalProjects - delayedProjects) / totalProjects) * 100 
      : 100;

    const activeUsers = await User.countDocuments({ isActive: true });

    const criticalAlerts = await Notification.countDocuments({
      priority: 'critical',
      isActive: true,
      resolvedAt: { $exists: false }
    });

    const projectStatusMap = await Project.find({
      isActive: true,
      'location.coordinates.lat': { $exists: true },
      'location.coordinates.lng': { $exists: true }
    }).select('name code status priority progress location dates');

    const mapProjects = projectStatusMap.map(project => {
      let statusColor = '#22c55e';
      
      if ((project.dates as any).endDate < new Date() && project.status !== 'completed') {
        statusColor = '#ef4444';
      } else if ((project.progress as any).overall < 50) {
        statusColor = '#f59e0b';
      }

      return {
        id: project._id,
        name: project.name,
        code: project.code,
        status: project.status,
        priority: project.priority,
        progress: (project.progress as any).overall,
        coordinates: (project.location as any).coordinates,
        statusColor
      };
    });

    const detailedProjects = await Project.find({ isActive: true })
      .populate('team.projectManager', 'name')
      .select('name code status priority progress budget dates location risks')
      .sort({ 'dates.startDate': -1 })
      .limit(20);

    const projectsWithMetrics = detailedProjects.map(project => {
      const budgetUsage = (project.budget as any).allocated > 0 
        ? ((project.budget as any).spent / (project.budget as any).allocated) * 100 
        : 0;

      const daysRemaining = Math.ceil(
        ((project.dates as any).endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      const openRisks = (project.risks || []).filter((r: any) => r.status === 'open').length;

      return {
        id: project._id,
        name: project.name,
        code: project.code,
        status: project.status,
        progress: (project.progress as any).overall,
        budgetUsage: Math.round(budgetUsage),
        budgetSpent: (project.budget as any).spent,
        budgetAllocated: (project.budget as any).allocated,
        daysRemaining,
        location: (project.location as any).address,
        manager: (project.team as any).projectManager,
        openRisks
      };
    });

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

    return NextResponse.json({
      success: true,
      kpis: {
        activeProjects,
        budgetUtilization: Math.round(budgetUtilization),
        overallProgress: Math.round(overallProgress),
        onTimePerformance: Math.round(onTimePerformance),
        activeCollaborators: activeUsers,
        criticalAlerts
      },
      budget: {
        ...budget,
        breakdown: budgetBreakdown[0] || { labor: 0, materials: 0, equipment: 0, contingency: 0 }
      },
      projects: projectsWithMetrics,
      mapData: mapProjects
    });

  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

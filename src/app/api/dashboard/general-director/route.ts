import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import Project from '@/server/models/Project';
import User from '@/server/models/User';
import Notification from '@/server/models/Notification';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const activeProjects = await Project.countDocuments({ 
      statut: 'en_cours'
    });

    const budgetStats = await Project.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget.total_alloue' },
          allocatedBudget: { $sum: '$budget.total_alloue' },
          spentBudget: { $sum: '$budget.total_depense' }
        }
      }
    ]);

    const budget = budgetStats[0] || { totalBudget: 0, allocatedBudget: 0, spentBudget: 0 };
    const budgetUtilization = budget.allocatedBudget > 0 
      ? (budget.spentBudget / budget.allocatedBudget) * 100 
      : 0;

    const progressStats = await Project.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null,
          avgProgress: { $avg: '$avancement.pourcentage_global' }
        }
      }
    ]);

    const overallProgress = progressStats[0]?.avgProgress || 0;

    const delayedProjects = await Project.countDocuments({
      'calendrier.date_fin_prevue': { $lt: new Date() },
      statut: { $in: ['planification', 'en_cours'] }
    });

    const totalProjects = await Project.countDocuments({});
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
      'localisation.coordonnees.latitude': { $exists: true },
      'localisation.coordonnees.longitude': { $exists: true }
    }).select('nom code statut avancement localisation calendrier');

    const mapProjects = projectStatusMap.map(project => {
      let statusColor = '#22c55e';
      
      if ((project as any).calendrier?.date_fin_prevue < new Date() && (project as any).statut !== 'termine') {
        statusColor = '#ef4444';
      } else if ((project as any).avancement?.pourcentage_global < 50) {
        statusColor = '#f59e0b';
      }

      return {
        id: project._id,
        name: (project as any).nom,
        code: project.code,
        status: (project as any).statut,
        priority: 'medium',
        progress: (project as any).avancement?.pourcentage_global,
        coordinates: (project as any).localisation?.coordonnees,
        statusColor
      };
    });

    const detailedProjects = await Project.find({})
      .select('nom code statut avancement budget calendrier localisation')
      .sort({ 'calendrier.date_debut': -1 })
      .limit(20);

    const projectsWithMetrics = detailedProjects.map(project => {
      const allocated = (project as any).budget?.total_alloue || 0;
      const spent = (project as any).budget?.total_depense || 0;
      const budgetUsage = allocated > 0 
        ? (spent / allocated) * 100 
        : 0;

      const endDate = (project as any).calendrier?.date_fin_prevue as Date | undefined;
      const daysRemaining = endDate 
        ? Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      const openRisks = 0;

      return {
        id: project._id,
        name: (project as any).nom,
        code: project.code,
        status: (project as any).statut,
        progress: (project as any).avancement?.pourcentage_global,
        budgetUsage: Math.round(budgetUsage),
        budgetSpent: spent,
        budgetAllocated: allocated,
        daysRemaining,
        location: (project as any).localisation?.adresse,
        manager: undefined,
        openRisks
      };
    });

    const budgetBreakdown = await Project.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null,
          labor: { $sum: '$budget.repartition.main_oeuvre.depense' },
          materials: { $sum: '$budget.repartition.materiaux.depense' },
          equipment: { $sum: '$budget.repartition.equipements.depense' },
          contingency: { $sum: '$budget.repartition.imprevus.depense' }
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

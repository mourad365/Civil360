import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Project from '../models/Project';
import { Types } from 'mongoose';

const router = express.Router();

// Get all projects with filtering and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

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
      .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('team.projectManager', 'name email role phone')
      .populate('team.engineers', 'name email role phone')
      .populate('team.workers', 'name email role phone')
      .populate('phases.assignedTeam', 'name email role')
      .populate('qualityChecks.inspector', 'name email')
      .populate('dailyReports.reportedBy', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      team: {
        projectManager: req.user!.id,
        ...req.body.team
      }
    };

    const project = new Project(projectData);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('team.projectManager', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: populatedProject
    });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: 'Failed to create project',
      details: error.message
    });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('team.projectManager', 'name email role');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error: any) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Add daily report
router.post('/:id/daily-report', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const report = {
      ...req.body,
      reportedBy: req.user!.id,
      date: new Date()
    };

    project.dailyReports.push(report);
    await project.save();

    res.json({
      success: true,
      message: 'Daily report added successfully',
      report
    });
  } catch (error: any) {
    console.error('Add daily report error:', error);
    res.status(500).json({ error: 'Failed to add daily report' });
  }
});

// Add quality check
router.post('/:id/quality-check', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const qualityCheck = {
      ...req.body,
      inspector: req.user!.id,
      date: new Date()
    };

    project.qualityChecks.push(qualityCheck);
    await project.save();

    res.json({
      success: true,
      message: 'Quality check added successfully',
      qualityCheck
    });
  } catch (error: any) {
    console.error('Add quality check error:', error);
    res.status(500).json({ error: 'Failed to add quality check' });
  }
});

// Update project progress
router.put('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { phaseId, completion } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update phase progress
    if (phaseId) {
      const phase = project.phases.find(p => p._id?.toString() === phaseId);
      if (phase) {
        phase.progress = completion;
      }
    }

    // Update overall progress
    if (project.phases.length > 0) {
      const totalProgress = project.phases.reduce((sum, phase) => sum + phase.progress, 0);
      project.progress.overall = Math.round(totalProgress / project.phases.length);
    }

    await project.save();

    res.json({
      success: true,
      message: 'Project progress updated successfully',
      progress: project.progress
    });
  } catch (error: any) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get project dashboard data
router.get('/:id/dashboard', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Calculate KPIs
    const budgetUtilization = project.budget.allocated > 0 
      ? (project.budget.spent / project.budget.allocated) * 100 
      : 0;

    const scheduleStatus = project.dates.endDate < new Date() && project.status !== 'completed' 
      ? 'overdue' : 'on_time';

    const riskCount = project.risks.filter(r => r.status === 'open').length;

    const dashboard = {
      overview: {
        name: project.name,
        code: project.code,
        status: project.status,
        progress: project.progress.overall,
        budgetUtilization,
        scheduleStatus
      },
      budget: {
        estimated: project.budget.estimated,
        allocated: project.budget.allocated,
        spent: project.budget.spent,
        remaining: project.budget.allocated - project.budget.spent
      },
      schedule: {
        startDate: project.dates.startDate,
        endDate: project.dates.endDate,
        actualStartDate: project.dates.actualStartDate,
        daysRemaining: Math.ceil(
          (project.dates.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
      },
      team: {
        manager: project.team.projectManager,
        engineers: project.team.engineers.length,
        workers: project.team.workers.length
      },
      risks: {
        total: project.risks.length,
        open: riskCount,
        high: project.risks.filter(r => r.impact === 'high' && r.status === 'open').length
      },
      recentActivities: project.dailyReports
        .slice(-5)
        .map(report => ({
          date: report.date,
          progress: report.progress,
          issues: report.issues.length
        }))
    };

    res.json({ success: true, dashboard });
  } catch (error: any) {
    console.error('Get project dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;

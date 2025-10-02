// @ts-nocheck
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Equipment from '../models/Equipment';
import Supplier from '../models/Supplier';

const router = express.Router();

// Get all equipment with filtering
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      category,
      project,
      search
    } = req.query;

    const filter: any = { isActive: true };
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (project) filter['assignment.assignedProject'] = project;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'specifications.model': { $regex: search, $options: 'i' } }
      ];
    }

    const equipment = await Equipment.find(filter)
      .populate('location.currentProject', 'name code')
      .populate('assignment.assignedTo', 'name email')
      .populate('assignment.assignedProject', 'name code')
      .populate('rental.supplier', 'name contact')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Equipment.countDocuments(filter);

    res.json({
      success: true,
      equipment,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Get single equipment
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('location.currentProject', 'name code location')
      .populate('assignment.assignedTo', 'name email phone')
      .populate('assignment.assignedProject', 'name code')
      .populate('rental.supplier', 'name contact rating')
      .populate('transfers.fromProject', 'name code')
      .populate('transfers.toProject', 'name code')
      .populate('transfers.requestedBy', 'name email')
      .populate('transfers.approvedBy', 'name email');

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({ success: true, equipment });
  } catch (error: any) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Create equipment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();

    const populatedEquipment = await Equipment.findById(equipment._id)
      .populate('location.currentProject', 'name code');

    res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      equipment: populatedEquipment
    });
  } catch (error: any) {
    console.error('Create equipment error:', error);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
});

// Update equipment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('location.currentProject', 'name code');

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({
      success: true,
      message: 'Equipment updated successfully',
      equipment
    });
  } catch (error: any) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

// Request equipment transfer
router.post('/:id/transfer', authenticateToken, async (req, res) => {
  try {
    const { toProject, transferDate, notes } = req.body;
    
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const transfer = {
      fromProject: equipment.assignment.assignedProject,
      toProject,
      transferDate: new Date(transferDate),
      requestedBy: req.user!.id,
      status: 'requested' as const,
      notes
    };

    equipment.transfers.push(transfer);
    await equipment.save();

    res.json({
      success: true,
      message: 'Transfer request created successfully',
      transfer
    });
  } catch (error: any) {
    console.error('Request transfer error:', error);
    res.status(500).json({ error: 'Failed to request transfer' });
  }
});

// Approve equipment transfer
router.put('/transfers/:transferId/approve', authenticateToken, async (req, res) => {
  try {
    const { transferId } = req.params;
    const { estimatedArrival } = req.body;

    const equipment = await Equipment.findOne({
      'transfers._id': transferId
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Transfer request not found' });
    }

    const transfer = equipment.transfers.find(t => (t as any)._id?.toString() === transferId);
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    transfer.status = 'approved';
    transfer.approvedBy = req.user!.id;
    transfer.estimatedArrival = estimatedArrival ? new Date(estimatedArrival) : undefined;

    // Update equipment status
    equipment.status = 'transferred';

    await equipment.save();

    res.json({
      success: true,
      message: 'Transfer approved successfully',
      transfer
    });
  } catch (error: any) {
    console.error('Approve transfer error:', error);
    res.status(500).json({ error: 'Failed to approve transfer' });
  }
});

// Complete equipment transfer
router.put('/transfers/:transferId/complete', authenticateToken, async (req, res) => {
  try {
    const { transferId } = req.params;
    const { actualArrival, transferCost } = req.body;

    const equipment = await Equipment.findOne({
      'transfers._id': transferId
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Transfer request not found' });
    }

    const transfer = equipment.transfers.find(t => (t as any)._id?.toString() === transferId);
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    // Update transfer
    transfer.status = 'completed';
    transfer.actualArrival = actualArrival ? new Date(actualArrival) : new Date();
    transfer.transferCost = transferCost || 0;

    // Update equipment assignment
    equipment.assignment.assignedProject = transfer.toProject;
    equipment.location.currentProject = transfer.toProject;
    equipment.location.lastUpdated = new Date();
    equipment.status = 'available';

    await equipment.save();

    res.json({
      success: true,
      message: 'Transfer completed successfully',
      transfer
    });
  } catch (error: any) {
    console.error('Complete transfer error:', error);
    res.status(500).json({ error: 'Failed to complete transfer' });
  }
});

// Add maintenance record
router.post('/:id/maintenance', authenticateToken, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const maintenanceRecord = {
      ...req.body,
      date: new Date()
    };

    equipment.maintenance.maintenanceHistory.push(maintenanceRecord);
    equipment.maintenance.lastMaintenance = new Date();
    
    if (req.body.nextMaintenanceDate) {
      equipment.maintenance.nextMaintenance = new Date(req.body.nextMaintenanceDate);
    }

    // Update financial records
    equipment.financial.totalMaintenanceCost += req.body.cost || 0;

    await equipment.save();

    res.json({
      success: true,
      message: 'Maintenance record added successfully',
      maintenanceRecord
    });
  } catch (error: any) {
    console.error('Add maintenance error:', error);
    res.status(500).json({ error: 'Failed to add maintenance record' });
  }
});

// Update equipment location
router.put('/:id/location', authenticateToken, async (req, res) => {
  try {
    const { coordinates, address } = req.body;
    
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    equipment.location.coordinates = coordinates;
    equipment.location.address = address || equipment.location.address;
    equipment.location.lastUpdated = new Date();

    await equipment.save();

    res.json({
      success: true,
      message: 'Equipment location updated successfully',
      location: equipment.location
    });
  } catch (error: any) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Get equipment dashboard
router.get('/dashboard/overview', authenticateToken, async (req, res) => {
  try {
    // Get equipment statistics
    const totalEquipment = await Equipment.countDocuments({ isActive: true });
    
    const statusCounts = await Equipment.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const typeCounts = await Equipment.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const categoryCounts = await Equipment.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Calculate utilization rates
    const utilizationStats = await Equipment.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgUtilization: { $avg: '$utilization.utilizationRate' },
          totalHoursUsed: { $sum: '$utilization.hoursUsed' },
          totalHoursAvailable: { $sum: '$utilization.totalHours' }
        }
      }
    ]);

    // Get maintenance alerts
    const maintenanceAlerts = await Equipment.find({
      'maintenance.nextMaintenance': { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      isActive: true
    }).populate('location.currentProject', 'name').limit(10);

    // Get rental cost summary
    const rentalCosts = await Equipment.aggregate([
      { $match: { category: 'rented', isActive: true } },
      {
        $group: {
          _id: null,
          monthlyTotal: { $sum: '$rental.monthlyRate' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent transfers
    const recentTransfers = await Equipment.find({
      'transfers.status': { $in: ['requested', 'approved', 'in_transit'] },
      isActive: true
    })
    .populate('transfers.fromProject', 'name')
    .populate('transfers.toProject', 'name')
    .populate('transfers.requestedBy', 'name')
    .limit(10);

    const dashboard = {
      overview: {
        total: totalEquipment,
        available: statusCounts.find(s => s._id === 'available')?.count || 0,
        inUse: statusCounts.find(s => s._id === 'in_use')?.count || 0,
        maintenance: statusCounts.find(s => s._id === 'maintenance')?.count || 0,
        avgUtilization: utilizationStats[0]?.avgUtilization || 0
      },
      breakdown: {
        byStatus: statusCounts,
        byType: typeCounts,
        byCategory: categoryCounts
      },
      utilization: {
        overall: utilizationStats[0]?.avgUtilization || 0,
        hoursUsed: utilizationStats[0]?.totalHoursUsed || 0,
        hoursAvailable: utilizationStats[0]?.totalHoursAvailable || 0
      },
      maintenance: {
        upcomingCount: maintenanceAlerts.length,
        alerts: maintenanceAlerts
      },
      rental: {
        monthlyTotal: rentalCosts[0]?.monthlyTotal || 0,
        equipmentCount: rentalCosts[0]?.count || 0
      },
      transfers: {
        recent: recentTransfers.map(eq => eq.transfers.filter(t => 
          ['requested', 'approved', 'in_transit'].includes(t.status)
        )).flat()
      }
    };

    res.json({ success: true, dashboard });
  } catch (error: any) {
    console.error('Get equipment dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get equipment map data
router.get('/map', authenticateToken, async (req, res) => {
  try {
    const equipment = await Equipment.find({ 
      isActive: true,
      'location.coordinates.lat': { $exists: true },
      'location.coordinates.lng': { $exists: true }
    })
    .populate('location.currentProject', 'name code')
    .populate('assignment.assignedTo', 'name')
    .select('name code type status location assignment');

    const mapData = equipment.map(eq => ({
      id: eq._id,
      name: eq.name,
      code: eq.code,
      type: eq.type,
      status: eq.status,
      coordinates: eq.location.coordinates,
      project: eq.location.currentProject,
      assignedTo: eq.assignment.assignedTo
    }));

    res.json({ success: true, equipment: mapData });
  } catch (error: any) {
    console.error('Get equipment map error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment map data' });
  }
});

export default router;

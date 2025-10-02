import express from 'express';
import { authenticateToken } from '../middleware/auth';
import PurchaseOrder from '../models/PurchaseOrder';
import Supplier from '../models/Supplier';
import Material from '../models/Material';

const router = express.Router();

// Get all purchase orders with filtering
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      project,
      supplier,
      search
    } = req.query;

    const filter: any = { isActive: true };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;
    if (supplier) filter.supplier = supplier;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'items.description': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await PurchaseOrder.find(filter)
      .populate('project', 'name code')
      .populate('supplier', 'name contact.email contact.phone')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await PurchaseOrder.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get purchase orders error:', error);
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

// Get single purchase order
router.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate('project', 'name code location')
      .populate('supplier', 'name contact rating')
      .populate('requestedBy', 'name email phone')
      .populate('approvedBy', 'name email')
      .populate('tracking.updatedBy', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    res.json({ success: true, order });
  } catch (error: any) {
    console.error('Get purchase order error:', error);
    res.status(500).json({ error: 'Failed to fetch purchase order' });
  }
});

// Create purchase order
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    // Generate order number
    const orderCount = await PurchaseOrder.countDocuments();
    const orderNumber = `PO${String(orderCount + 1).padStart(6, '0')}`;

    const orderData = {
      ...req.body,
      orderNumber,
      requestedBy: req.user!.id
    };

    const order = new PurchaseOrder(orderData);
    await order.save();

    const populatedOrder = await PurchaseOrder.findById(order._id)
      .populate('project', 'name code')
      .populate('supplier', 'name contact');

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      order: populatedOrder
    });
  } catch (error: any) {
    console.error('Create purchase order error:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

// Update purchase order
router.put('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('project', 'name code')
     .populate('supplier', 'name contact');

    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    res.json({
      success: true,
      message: 'Purchase order updated successfully',
      order
    });
  } catch (error: any) {
    console.error('Update purchase order error:', error);
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
});

// Approve purchase order
router.put('/orders/:id/approve', authenticateToken, async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    if (order.status !== 'pending_approval') {
      return res.status(400).json({ error: 'Order is not pending approval' });
    }

    order.status = 'approved';
    order.approvedBy = req.user!.id;
    order.dates.approved = new Date();

    // Add tracking entry
    order.tracking.push({
      status: 'approved',
      date: new Date(),
      notes: req.body.notes || 'Order approved',
      updatedBy: req.user!.id
    });

    await order.save();

    res.json({
      success: true,
      message: 'Purchase order approved successfully',
      order
    });
  } catch (error: any) {
    console.error('Approve purchase order error:', error);
    res.status(500).json({ error: 'Failed to approve purchase order' });
  }
});

// Update delivery status
router.put('/orders/:id/delivery', authenticateToken, async (req, res) => {
  try {
    const { itemId, deliveredQuantity, status } = req.body;
    
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    // Update item delivery status
    if (itemId) {
      const item = order.items.find(item => item._id?.toString() === itemId);
      if (item) {
        item.deliveredQuantity = deliveredQuantity || item.deliveredQuantity;
        item.status = status || item.status;
      }
    }

    // Update overall order status
    const allItemsDelivered = order.items.every(item => item.status === 'delivered');
    const someItemsDelivered = order.items.some(item => item.deliveredQuantity > 0);

    if (allItemsDelivered) {
      order.status = 'completed';
      order.dates.actualDelivery = new Date();
    } else if (someItemsDelivered) {
      order.status = 'partial_delivery';
    }

    // Add tracking entry
    order.tracking.push({
      status: order.status,
      date: new Date(),
      notes: req.body.notes || 'Delivery status updated',
      updatedBy: req.user!.id
    });

    await order.save();

    res.json({
      success: true,
      message: 'Delivery status updated successfully',
      order
    });
  } catch (error: any) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

// Get all suppliers
router.get('/suppliers', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      search
    } = req.query;

    const filter: any = { isActive: true };
    
    if (type) filter.type = type;
    if (category) filter.categories = { $in: [category] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'contact.primaryContact': { $regex: search, $options: 'i' } }
      ];
    }

    const suppliers = await Supplier.find(filter)
      .sort({ 'rating.overall': -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Supplier.countDocuments(filter);

    res.json({
      success: true,
      suppliers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Create supplier
router.post('/suppliers', authenticateToken, async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      supplier
    });
  } catch (error: any) {
    console.error('Create supplier error:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// Update supplier rating
router.put('/suppliers/:id/rating', authenticateToken, async (req, res) => {
  try {
    const { quality, delivery, price, service } = req.body;
    
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    supplier.rating.quality = quality;
    supplier.rating.delivery = delivery;
    supplier.rating.price = price;
    supplier.rating.service = service;
    supplier.rating.overall = (quality + delivery + price + service) / 4;

    await supplier.save();

    res.json({
      success: true,
      message: 'Supplier rating updated successfully',
      rating: supplier.rating
    });
  } catch (error: any) {
    console.error('Update supplier rating error:', error);
    res.status(500).json({ error: 'Failed to update supplier rating' });
  }
});

// Get all materials
router.get('/materials', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      subcategory,
      search
    } = req.query;

    const filter: any = { isActive: true };
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const materials = await Material.find(filter)
      .populate('suppliers.supplier', 'name contact rating')
      .populate('locations.project', 'name code')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Material.countDocuments(filter);

    res.json({
      success: true,
      materials,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get materials error:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Get purchasing dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Get monthly statistics
    const monthlyOrders = await PurchaseOrder.find({
      createdAt: { $gte: currentMonth, $lt: nextMonth },
      isActive: true
    });

    const totalOrders = await PurchaseOrder.countDocuments({ isActive: true });
    const pendingApproval = await PurchaseOrder.countDocuments({ 
      status: 'pending_approval', 
      isActive: true 
    });
    const overdueDelveries = await PurchaseOrder.countDocuments({
      'dates.expectedDelivery': { $lt: new Date() },
      status: { $in: ['approved', 'sent', 'confirmed'] },
      isActive: true
    });

    // Calculate monthly budget
    const monthlyBudget = monthlyOrders.reduce((sum, order) => 
      sum + order.financial.totalAmount, 0
    );

    // Get top suppliers
    const supplierStats = await Supplier.aggregate([
      { $match: { isActive: true } },
      { $sort: { 'performance.onTimePercentage': -1, 'rating.overall': -1 } },
      { $limit: 5 }
    ]);

    // Get delivery calendar
    const deliveryCalendar = await PurchaseOrder.find({
      'dates.expectedDelivery': { 
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
      },
      status: { $in: ['approved', 'sent', 'confirmed'] },
      isActive: true
    })
    .populate('project', 'name')
    .populate('supplier', 'name')
    .select('orderNumber dates.expectedDelivery project supplier items.materialType')
    .limit(10);

    const dashboard = {
      overview: {
        totalOrders,
        monthlyOrders: monthlyOrders.length,
        monthlyBudget,
        pendingApproval,
        overdueDelveries,
        onTimeDeliveryRate: 85 // This would be calculated from actual data
      },
      topSuppliers: supplierStats,
      deliveryCalendar,
      budgetBreakdown: {
        materials: monthlyBudget * 0.7,
        equipment: monthlyBudget * 0.2,
        services: monthlyBudget * 0.1
      }
    };

    res.json({ success: true, dashboard });
  } catch (error: any) {
    console.error('Get purchasing dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;

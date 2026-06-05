const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

const ORDER_STATUSES = ['nuevo', 'procesando', 'enviado', 'entregado', 'cancelado'];

// ── GET /api/orders (Admin) ────────────────────────────────────────────────────
router.get('/', adminMiddleware, (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  let orders = db.getAll('orders').sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }

  const total = orders.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const paginated = orders.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  // Calcular estadísticas
  const allOrders = db.getAll('orders');
  const stats = {
    total: allOrders.length,
    nuevo: allOrders.filter(o => o.status === 'nuevo').length,
    procesando: allOrders.filter(o => o.status === 'procesando').length,
    enviado: allOrders.filter(o => o.status === 'enviado').length,
    entregado: allOrders.filter(o => o.status === 'entregado').length,
    cancelado: allOrders.filter(o => o.status === 'cancelado').length,
    revenue: allOrders
      .filter(o => o.status !== 'cancelado')
      .reduce((sum, o) => sum + (o.total || 0), 0),
  };

  res.json({
    orders: paginated,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    stats,
  });
});

// ── GET /api/orders/:id ────────────────────────────────────────────────────────
router.get('/:id', adminMiddleware, (req, res) => {
  const order = db.getById('orders', req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json({ order });
});

// ── POST /api/orders (Público) ─────────────────────────────────────────────────
router.post('/',
  [
    body('customerName').notEmpty().withMessage('El nombre es requerido'),
    body('customerEmail').isEmail().withMessage('Email inválido'),
    body('customerPhone').notEmpty().withMessage('El teléfono es requerido'),
    body('items').isArray({ min: 1 }).withMessage('Se requiere al menos un producto'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors.array() });
    }

    const { customerName, customerEmail, customerPhone, customerAddress, items, notes } = req.body;

    // Validar y calcular total
    let subtotal = 0;
    const validatedItems = items.map(item => {
      const product = db.getById('products', item.productId);
      if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Generar número de pedido
    const orderCount = db.count('orders') + 1;
    const orderNumber = `ZEN-${String(orderCount).padStart(3, '0')}`;

    const newOrder = {
      id: uuidv4(),
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress: customerAddress || '',
      items: validatedItems,
      subtotal,
      total: subtotal,
      status: 'nuevo',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.create('orders', newOrder);

    res.status(201).json({
      message: '¡Pedido recibido! Te contactaremos pronto.',
      order: newOrder,
    });
  }
);

// ── PUT /api/orders/:id/status (Admin) ────────────────────────────────────────
router.put('/:id/status', adminMiddleware,
  [body('status').isIn(ORDER_STATUSES).withMessage('Estado inválido')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Estado inválido', validStatuses: ORDER_STATUSES });
    }

    const order = db.getById('orders', req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

    const updated = db.update('orders', req.params.id, { status: req.body.status });
    res.json({ message: 'Estado actualizado', order: updated });
  }
);

// ── DELETE /api/orders/:id (Admin) ────────────────────────────────────────────
router.delete('/:id', adminMiddleware, (req, res) => {
  const order = db.getById('orders', req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
  db.delete('orders', req.params.id);
  res.json({ message: 'Pedido eliminado' });
});

module.exports = router;

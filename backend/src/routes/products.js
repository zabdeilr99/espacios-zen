const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/products ──────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const { category, search, featured, sort, page = 1, limit = 12 } = req.query;

  let products = db.getAll('products').filter(p => p.active !== false);

  // Filtro por categoría
  if (category && category !== 'all') {
    products = products.filter(p => p.categoryId === category);
  }

  // Búsqueda por nombre
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Solo destacados
  if (featured === 'true') {
    products = products.filter(p => p.featured === true);
  }

  // Ordenar
  if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
  else if (sort === 'newest') products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Paginación
  const total = products.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const paginated = products.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    products: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// ── GET /api/products/:id ──────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const product = db.getById('products', req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  // Obtener productos relacionados (misma categoría, diferente ID)
  const related = db.find('products', p =>
    p.categoryId === product.categoryId &&
    p.id !== product.id &&
    p.active !== false
  ).slice(0, 4);

  res.json({ product, related });
});

// ── POST /api/products (Admin) ─────────────────────────────────────────────────
router.post('/', adminMiddleware,
  [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('price').isNumeric().withMessage('El precio debe ser un número'),
    body('categoryId').notEmpty().withMessage('La categoría es requerida'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors.array() });
    }

    const newProduct = {
      id: uuidv4(),
      ...req.body,
      active: req.body.active ?? true,
      featured: req.body.featured ?? false,
      rating: req.body.rating ?? 5.0,
      reviewCount: req.body.reviewCount ?? 0,
      stock: req.body.stock ?? 10,
      gradient: req.body.gradient ?? 'from-green-100 to-emerald-200',
      emoji: req.body.emoji ?? '📦',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.create('products', newProduct);
    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
  }
);

// ── PUT /api/products/:id (Admin) ──────────────────────────────────────────────
router.put('/:id', adminMiddleware, (req, res) => {
  const existing = db.getById('products', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Producto no encontrado' });

  const updated = db.update('products', req.params.id, req.body);
  res.json({ message: 'Producto actualizado', product: updated });
});

// ── DELETE /api/products/:id (Admin) ──────────────────────────────────────────
router.delete('/:id', adminMiddleware, (req, res) => {
  const existing = db.getById('products', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Producto no encontrado' });

  // Soft delete
  db.update('products', req.params.id, { active: false });
  res.json({ message: 'Producto eliminado exitosamente' });
});

module.exports = router;

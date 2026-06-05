const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/categories ────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const categories = db.getAll('categories')
    .filter(c => c.active !== false)
    .sort((a, b) => a.order - b.order);

  // Agregar conteo de productos por categoría
  const products = db.getAll('products').filter(p => p.active !== false);

  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.categoryId === cat.id).length,
  }));

  res.json({ categories: categoriesWithCount });
});

// ── GET /api/categories/:id ────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const category = db.getById('categories', req.params.id);
  if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json({ category });
});

// ── POST /api/categories (Admin) ──────────────────────────────────────────────
router.post('/', adminMiddleware, (req, res) => {
  const newCategory = {
    id: uuidv4(),
    ...req.body,
    active: true,
    createdAt: new Date().toISOString(),
  };
  db.create('categories', newCategory);
  res.status(201).json({ message: 'Categoría creada', category: newCategory });
});

module.exports = router;

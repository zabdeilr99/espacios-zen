require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const categoryRoutes = require('./src/routes/categories');
const orderRoutes = require('./src/routes/orders');
const contactRoutes = require('./src/routes/contact');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Seguridad y middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas API ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🌿 Espacios Zen API activa',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', path: req.originalUrl });
});

// ── Error global ───────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Iniciar servidor ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n🌿 ═══════════════════════════════════════════════');
  console.log(`   Espacios Zen – API REST`);
  console.log(`   Servidor: http://localhost:${PORT}`);
  console.log(`   Entorno:  ${process.env.NODE_ENV}`);
  console.log('═══════════════════════════════════════════════\n');
});

module.exports = app;

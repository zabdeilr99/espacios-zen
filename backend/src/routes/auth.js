const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// ── POST /api/auth/login ───────────────────────────────────────────────────────
router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors.array() });
    }

    const { email, password } = req.body;

    const user = db.find('users', u => u.email === email.toLowerCase())[0];
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userWithoutPassword,
    });
  }
);

// ── GET /api/auth/me ───────────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ── POST /api/auth/logout ──────────────────────────────────────────────────────
router.post('/logout', authMiddleware, (req, res) => {
  // En una app real, aquí se invalidaría el token en una blacklist
  res.json({ message: 'Sesión cerrada exitosamente' });
});

module.exports = router;

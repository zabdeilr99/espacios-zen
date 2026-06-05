const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

const router = express.Router();

// ── POST /api/contact ──────────────────────────────────────────────────────────
router.post('/',
  [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('message').isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors.array() });
    }

    const { name, email, phone, subject, message } = req.body;

    const contact = {
      id: uuidv4(),
      name,
      email,
      phone: phone || '',
      subject: subject || 'Consulta general',
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    db.create('contacts', contact);

    console.log(`\n📩 Nuevo mensaje de contacto de: ${name} (${email})`);

    res.status(201).json({
      message: '¡Mensaje enviado! Te responderemos a la brevedad.',
      id: contact.id,
    });
  }
);

// ── GET /api/contact (Admin) ───────────────────────────────────────────────────
router.get('/', (req, res) => {
  const contacts = db.getAll('contacts').sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json({ contacts, total: contacts.length });
});

module.exports = router;

const jwt = require('jsonwebtoken');
const db = require('../database');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Se requiere token de autenticación',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.getById('users', decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Adjuntar usuario a la request (sin password)
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado', message: 'Por favor inicia sesión de nuevo' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware solo para admin
const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado', message: 'Se requieren permisos de administrador' });
    }
    next();
  });
};

module.exports = { authMiddleware, adminMiddleware };

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Estructura inicial vacía
const DEFAULT_DB = {
  users: [],
  categories: [],
  products: [],
  orders: [],
  contacts: [],
};

// ── Lectura sincrónica de la DB ────────────────────────────────────────────────
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDB(DEFAULT_DB);
      return { ...DEFAULT_DB };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('❌ Error leyendo base de datos:', err.message);
    return { ...DEFAULT_DB };
  }
}

// ── Escritura sincrónica de la DB ──────────────────────────────────────────────
function writeDB(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('❌ Error escribiendo base de datos:', err.message);
    return false;
  }
}

// ── Helpers genéricos ──────────────────────────────────────────────────────────
const db = {
  // Obtener todos los registros de una colección
  getAll(collection) {
    const data = readDB();
    return data[collection] || [];
  },

  // Obtener por ID
  getById(collection, id) {
    const data = readDB();
    return (data[collection] || []).find(item => item.id === id) || null;
  },

  // Crear registro
  create(collection, record) {
    const data = readDB();
    if (!data[collection]) data[collection] = [];
    data[collection].push(record);
    writeDB(data);
    return record;
  },

  // Actualizar registro por ID
  update(collection, id, updates) {
    const data = readDB();
    if (!data[collection]) return null;
    const index = data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    data[collection][index] = { ...data[collection][index], ...updates, updatedAt: new Date().toISOString() };
    writeDB(data);
    return data[collection][index];
  },

  // Eliminar por ID
  delete(collection, id) {
    const data = readDB();
    if (!data[collection]) return false;
    const index = data[collection].findIndex(item => item.id === id);
    if (index === -1) return false;
    data[collection].splice(index, 1);
    writeDB(data);
    return true;
  },

  // Buscar con filtro
  find(collection, filterFn) {
    const data = readDB();
    return (data[collection] || []).filter(filterFn);
  },

  // Contar registros
  count(collection) {
    const data = readDB();
    return (data[collection] || []).length;
  },

  // Reemplazar colección completa
  replaceCollection(collection, items) {
    const data = readDB();
    data[collection] = items;
    writeDB(data);
  },
};

module.exports = db;

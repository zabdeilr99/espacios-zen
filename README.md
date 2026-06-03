# 🌿 Espacios Zen – Organización Inteligente del Hogar

> **"Transforma tu espacio, transforma tu vida."**

Plataforma web MVP completa para la microempresa **Espacios Zen**, desarrollada como prototipo profesional listo para producción.

---

## 📋 Descripción del Proyecto

**Espacios Zen** es una solución e-commerce + gestión empresarial para la venta de organizadores del hogar en Villahermosa, Tabasco, México. El sistema incluye:

- 🛍️ Tienda en línea con catálogo de productos
- 🛒 Carrito de compras funcional
- 📊 Panel de administración completo
- 📦 Gestión de pedidos
- 📱 Integración con WhatsApp Business

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + Vite 5 |
| Estilos | Tailwind CSS 3 |
| Routing | React Router 6 |
| Iconos | Lucide React |
| Backend | Node.js + Express 4 |
| Base de Datos | JSON (lowdb-style, sin instalación nativa) |
| Autenticación | JWT + bcryptjs |
| Notificaciones | react-hot-toast |

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18.x
- npm >= 9.x

### 1. Clonar / Descomprimir el Proyecto

```bash
cd espacios-zen
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno (Backend)

```bash
cp .env.example .env
# Editar .env si es necesario
```

### 4. Inicializar la Base de Datos con Datos de Prueba

```bash
node src/seed.js
```

### 5. Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

### 6. Ejecutar en Desarrollo

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
# Servidor en http://localhost:3001
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
# App en http://localhost:5173
```

---

## 🔐 Credenciales de Acceso al Panel Admin

| Campo | Valor |
|-------|-------|
| Email | `admin@espacioszen.mx` |
| Contraseña | `Zen2024Admin` |

Acceso: `http://localhost:5173/admin/login`

---

## 📁 Estructura del Proyecto

```
espacios-zen/
├── README.md
├── .gitignore
├── backend/
│   ├── server.js              # Punto de entrada del servidor
│   ├── .env                   # Variables de entorno
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── database.js        # Gestor de base de datos JSON
│       ├── seed.js            # Datos de prueba iniciales
│       ├── middleware/
│       │   ├── auth.js        # Middleware JWT
│       │   └── errorHandler.js
│       └── routes/
│           ├── auth.js        # Login/logout
│           ├── products.js    # CRUD productos
│           ├── categories.js  # Categorías
│           ├── orders.js      # Pedidos
│           └── contact.js     # Formulario de contacto
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx            # Rutas principales
        ├── main.jsx
        ├── index.css
        ├── services/api.js    # Cliente HTTP centralizado
        ├── context/
        │   ├── CartContext.jsx
        │   └── AuthContext.jsx
        ├── components/
        │   ├── layout/        # Navbar, Footer
        │   ├── ui/            # Botones, badges, spinners
        │   ├── products/      # ProductCard, ProductGrid
        │   └── cart/          # CartSidebar
        └── pages/
            ├── HomePage.jsx
            ├── ProductsPage.jsx
            ├── ProductDetailPage.jsx
            ├── AboutPage.jsx
            ├── ContactPage.jsx
            └── admin/         # Dashboard, Productos, Pedidos, Login
```

---

## 📊 Módulos Implementados

### Tienda Pública
- [x] Página principal con hero, productos destacados, valores
- [x] Catálogo con filtros por categoría y búsqueda
- [x] Detalle de producto con características
- [x] Carrito de compras con persistencia en localStorage
- [x] Formulario de contacto / pedido
- [x] Botón directo a WhatsApp Business
- [x] Página "Sobre Nosotros" con Misión, Visión y FODA

### Panel Administrativo
- [x] Login seguro con JWT
- [x] Dashboard con métricas (ventas, productos, pedidos)
- [x] CRUD completo de productos
- [x] Gestión de pedidos con cambio de estado
- [x] Protección de rutas admin

### Backend API REST
- [x] `GET /api/products` – Listar con filtros y búsqueda
- [x] `GET /api/products/:id` – Detalle
- [x] `POST /api/products` – Crear (admin)
- [x] `PUT /api/products/:id` – Editar (admin)
- [x] `DELETE /api/products/:id` – Eliminar (admin)
- [x] `GET /api/categories` – Categorías
- [x] `GET /api/orders` – Pedidos (admin)
- [x] `POST /api/orders` – Crear pedido
- [x] `PUT /api/orders/:id/status` – Actualizar estado
- [x] `POST /api/auth/login` – Autenticación
- [x] `POST /api/contact` – Formulario de contacto

---

## 🎨 Identidad Visual

| Elemento | Valor |
|----------|-------|
| Color Primario | `#2D5016` (Verde bosque) |
| Color Secundario | `#5A8A60` (Salvia) |
| Acento | `#D4845A` (Terracota) |
| Fondo | `#FAF7F2` (Crema cálido) |
| Tipografía Headings | Cormorant Garamond |
| Tipografía Cuerpo | Plus Jakarta Sans |

---

## 💡 Funcionalidades Inferidas (Buenas Prácticas)

Las siguientes funcionalidades no están explícitas en el documento pero fueron agregadas siguiendo estándares de ingeniería de software:

1. **Persistencia del carrito** en `localStorage` – Mejora UX al no perder carrito al cerrar pestaña
2. **JWT con expiración** – Seguridad básica para el admin
3. **Validación de formularios** en frontend y backend
4. **Paginación** en listados de productos y pedidos
5. **Búsqueda en tiempo real** en el catálogo
6. **Estado de pedidos** (Nuevo → En proceso → Enviado → Entregado) – Workflow operacional básico
7. **CORS configurado** correctamente para producción
8. **Variables de entorno** para configuración sensible

---

## 📞 Información de la Empresa

- **Empresa:** Espacios Zen – Organización Inteligente del Hogar
- **Lema:** "Transforma tu espacio, transforma tu vida"
- **Ubicación:** Villahermosa, Tabasco, México
- **WhatsApp:** +52 993 000 0000
- **Instagram:** @espacioszen.mx
- **Facebook:** /EspaciosZenMx

---

## 👨‍💻 Datos Académicos

- **Proyecto:** Final de Emprendedores
- **Materia:** Emprendedores
- **Carrera:** Ingeniería en Sistemas Computacionales
- **División:** 27USU1970Y
- **Alumno:** Zabdiel Córdova Alejandro (222H17206)
- **Universidad:** Universidad Tecnológica de Tabasco

---

*Desarrollado como MVP profesional – Ciclo Largo 2024*

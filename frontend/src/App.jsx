import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout público
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';

// Páginas públicas
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Ruta protegida
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-zen-200 border-t-zen-600 rounded-full animate-spin" />
        <p className="font-body text-sage-600">Cargando...</p>
      </div>
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

// Layout público
function PublicLayout() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <Navbar />
      <CartSidebar />
      <main className="flex-1">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="productos" element={<ProductsPage />} />
          <Route path="productos/:id" element={<ProductDetailPage />} />
          <Route path="nosotros" element={<AboutPage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route index element={<DashboardPage />} />
                    <Route path="productos" element={<AdminProductsPage />} />
                    <Route path="pedidos" element={<AdminOrdersPage />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* Público */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

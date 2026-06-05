import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', end: true },
  { to: '/admin/productos', icon: <Package className="w-5 h-5" />, label: 'Productos' },
  { to: '/admin/pedidos', icon: <ShoppingBag className="w-5 h-5" />, label: 'Pedidos' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/admin/login');
  };

  const isActive = (to, end) => {
    if (end) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-zen-800">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zen-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-cream-100" />
          </div>
          <div>
            <p className="font-display text-base font-bold text-cream-100 leading-none">Espacios Zen</p>
            <p className="font-body text-[10px] text-sage-400 font-medium mt-0.5">Panel Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon, label, end }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={isActive(to, end) ? 'sidebar-link-active' : 'sidebar-link'}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom: user + actions */}
      <div className="border-t border-zen-800 px-3 py-4 space-y-1">
        <Link
          to="/"
          target="_blank"
          className="sidebar-link"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Ver Tienda</span>
        </Link>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>

        {/* User info */}
        <div className="mt-3 px-2 py-2 bg-zen-800/50 rounded-xl">
          <div className="w-7 h-7 bg-terra-500 rounded-full flex items-center justify-center
                          text-white text-xs font-bold mb-1">
            {user?.name?.[0] || 'A'}
          </div>
          <p className="font-body text-xs text-cream-200 font-medium truncate">{user?.name}</p>
          <p className="font-body text-[10px] text-sage-500 truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-zen-950 flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-56 bg-zen-950 z-40 lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-cream-300 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-cream-200">
            <Menu className="w-5 h-5 text-zen-700" />
          </button>
          <span className="font-display text-lg font-semibold text-zen-900">Espacios Zen</span>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

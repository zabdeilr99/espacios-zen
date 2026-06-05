import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Leaf } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/productos', label: 'Productos' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-cream-300'
          : 'bg-cream-100/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-zen-700 rounded-xl flex items-center justify-center
                            group-hover:bg-zen-600 transition-colors">
              <Leaf className="w-5 h-5 text-cream-100" />
            </div>
            <div>
              <span className="font-display text-xl font-semibold text-zen-900 leading-none block">
                Espacios Zen
              </span>
              <span className="font-body text-[10px] text-sage-500 font-medium tracking-widest uppercase leading-none">
                Organización Inteligente
              </span>
            </div>
          </Link>

          {/* Nav links - desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `font-body text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-zen-800 bg-zen-50'
                      : 'text-zen-700 hover:text-zen-900 hover:bg-cream-200'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-full hover:bg-cream-200 transition-colors group"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5 text-zen-700 group-hover:text-zen-900 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-terra-500 text-white
                                 text-[10px] font-bold rounded-full flex items-center justify-center
                                 animate-bounce">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* WhatsApp CTA - desktop */}
            <a
              href="https://wa.me/529930000000?text=Hola!%20Quiero%20información%20sobre%20sus%20productos"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-zen-700 text-white px-4 py-2
                         rounded-full text-sm font-medium hover:bg-zen-800 transition-all"
            >
              <span>WhatsApp</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-cream-200 transition-colors"
              aria-label="Menú"
            >
              {isMenuOpen
                ? <X className="w-5 h-5 text-zen-700" />
                : <Menu className="w-5 h-5 text-zen-700" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-cream-300 px-4 py-4 space-y-1 shadow-lg animate-slide-up">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block font-body text-sm font-medium px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'text-zen-800 bg-zen-50'
                    : 'text-zen-700 hover:bg-cream-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://wa.me/529930000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-zen-700 text-white px-4 py-3 rounded-xl
                       text-sm font-medium hover:bg-zen-800 transition-colors mt-2"
          >
            💬 Contáctanos por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}

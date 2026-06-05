import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zen-950 text-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-zen-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-cream-100" />
              </div>
              <div>
                <span className="font-display text-xl font-semibold text-cream-100 block leading-none">
                  Espacios Zen
                </span>
                <span className="font-body text-[10px] text-sage-400 font-medium tracking-widest uppercase">
                  Organización Inteligente del Hogar
                </span>
              </div>
            </Link>
            <p className="font-body text-sm text-sage-400 leading-relaxed max-w-sm mb-6">
              Transformamos tus espacios en ambientes ordenados, cómodos y armoniosos.
              Soluciones de organización inteligente para tu hogar en Comalcalco, Tabasco.
            </p>
            <p className="font-display text-lg italic text-terra-400">
              "Transforma tu espacio, transforma tu vida."
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body text-xs font-semibold text-sage-400 uppercase tracking-widest mb-4">
              Explorar
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/productos', label: 'Catálogo de Productos' },
                { to: '/productos?category=cat-cocina', label: 'Organizadores Cocina' },
                { to: '/productos?category=cat-recamara', label: 'Organizadores Recámara' },
                { to: '/nosotros', label: 'Sobre Nosotros' },
                { to: '/contacto', label: 'Contacto' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-body text-sm text-cream-300 hover:text-terra-300 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs font-semibold text-sage-400 uppercase tracking-widest mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-terra-400 mt-0.5 shrink-0" />
                <a
                  href="https://maps.app.goo.gl/VZbAMjXq3uKE2JFc7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-cream-300 hover:text-terra-300 transition-colors leading-relaxed"
                >
                  Benito Juárez García 1073-983<br />
                  Vicente Guerrero, Comalcalco, Tab.
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-terra-400 shrink-0" />
                <a href="tel:+529930000000" className="font-body text-sm text-cream-300 hover:text-terra-300 transition-colors">
                  +52 993 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-terra-400 shrink-0" />
                <a href="mailto:hola@espacioszen.mx" className="font-body text-sm text-cream-300 hover:text-terra-300 transition-colors">
                  hola@espacioszen.mx
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com/espacioszen.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zen-800 hover:bg-terra-500 flex items-center
                           justify-center transition-colors"
              >
                <Instagram className="w-4 h-4 text-cream-200" />
              </a>
              <a
                href="https://facebook.com/EspaciosZenMx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zen-800 hover:bg-blue-600 flex items-center
                           justify-center transition-colors"
              >
                <Facebook className="w-4 h-4 text-cream-200" />
              </a>
              <a
                href="https://wa.me/529930000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zen-800 hover:bg-green-600 flex items-center
                           justify-center transition-colors text-cream-200 text-sm font-bold"
              >
                💬
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zen-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-sage-500">
            © {new Date().getFullYear()} Espacios Zen. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-body text-xs text-sage-600">
              Hecho con 🌿 en Comalcalco, Tabasco
            </span>
            <Link
              to="/admin/login"
              className="font-body text-xs text-sage-700 hover:text-sage-400 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
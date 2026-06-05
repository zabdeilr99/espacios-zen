import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Truck, HeartHandshake, Star } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const valueProps = [
  { icon: <Sparkles className="w-6 h-6" />, title: 'Diseño Funcional', desc: 'Productos seleccionados para maximizar el orden y la estética en cada rincón de tu hogar.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Calidad Garantizada', desc: 'Materiales resistentes y duraderos. Trabajamos solo con los mejores productos del mercado.' },
  { icon: <Truck className="w-6 h-6" />, title: 'Entrega Local', desc: 'Entregas en Villahermosa y zonas cercanas. Rápido y seguro hasta tu puerta.' },
  { icon: <HeartHandshake className="w-6 h-6" />, title: 'Atención Personalizada', desc: 'Te asesoramos para encontrar la mejor solución de organización para tu espacio.' },
];

const steps = [
  { num: '01', title: 'Elige tus productos', desc: 'Explora nuestro catálogo y selecciona los organizadores perfectos para tu hogar.' },
  { num: '02', title: 'Realiza tu pedido', desc: 'Contáctanos por WhatsApp o a través de nuestro formulario. Proceso simple y rápido.' },
  { num: '03', title: 'Recibe en casa', desc: 'Entregamos en Villahermosa y áreas cercanas. ¡Transforma tu espacio hoy!' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          productsAPI.getAll({ featured: true, limit: 6 }),
          categoriesAPI.getAll(),
        ]);
        setFeatured(pRes.data.products);
        setCategories(cRes.data.categories);
      } catch (err) {
        console.error('Error cargando home:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-zen-pattern">
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="bg-hero-zen text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-sage-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-terra-500/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-terra-300" />
              <span className="font-body text-sm text-cream-200 font-medium">
                Organización Inteligente del Hogar
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Transforma tu{' '}
              <em className="not-italic text-terra-300">Espacio</em>,<br />
              Transforma tu{' '}
              <em className="not-italic text-sage-300">Vida.</em>
            </h1>

            <p className="font-body text-lg text-cream-300 leading-relaxed mb-8 max-w-xl">
              Soluciones inteligentes de organización para cada rincón de tu hogar.
              Productos funcionales, diseños modernos y precios accesibles en Villahermosa, Tabasco.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/productos" className="btn-terra flex items-center gap-2 text-base">
                Ver Catálogo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/529930000000?text=Hola!%20Quiero%20asesoría%20para%20organizar%20mi%20hogar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3
                           rounded-full font-body font-medium hover:bg-white/10 transition-all text-base"
              >
                💬 Asesoría Gratis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '50+', label: 'Productos' },
              { value: '100+', label: 'Clientes Felices' },
              { value: '6', label: 'Categorías' },
              { value: '5⭐', label: 'Calificación' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-3xl font-bold text-zen-700">{value}</p>
                <p className="font-body text-sm text-sage-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title">Por Categoría</h2>
            <p className="section-subtitle">Encuentra exactamente lo que necesitas</p>
          </div>
          <Link to="/productos" className="hidden md:flex items-center gap-1 font-body text-sm font-medium text-zen-600 hover:text-zen-800 transition-colors">
            Ver todo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(loading ? Array(6).fill(null) : categories).map((cat, i) => (
            cat ? (
              <Link
                key={cat.id}
                to={`/productos?category=${cat.id}`}
                className="group card-zen p-4 text-center hover:border-zen-300"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <p className="font-body text-sm font-semibold text-zen-800 group-hover:text-zen-600">
                  {cat.name}
                </p>
                <p className="font-body text-xs text-sage-400 mt-0.5">
                  {cat.productCount} productos
                </p>
              </Link>
            ) : (
              <div key={i} className="card-zen p-4 text-center animate-pulse bg-cream-200 h-24" />
            )
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">Los favoritos de nuestros clientes</p>
          </div>
          <Link to="/productos" className="hidden md:flex items-center gap-1 font-body text-sm font-medium text-zen-600 hover:text-zen-800">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="card-zen h-72 animate-pulse bg-cream-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/productos" className="btn-secondary inline-flex items-center gap-2">
            Ver catálogo completo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── VALUE PROPS ────────────────────────────────────────────────────── */}
      <section className="bg-zen-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-cream-100 mb-3">
              ¿Por qué elegir Espacios Zen?
            </h2>
            <p className="font-body text-sage-300 max-w-xl mx-auto">
              Nos comprometemos a ofrecerte las mejores soluciones de organización con la atención que mereces.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map(({ icon, title, desc }) => (
              <div key={title} className="bg-zen-800/50 rounded-2xl p-6 border border-zen-700 hover:border-terra-500/50 transition-colors group">
                <div className="w-12 h-12 bg-terra-500/20 rounded-xl flex items-center justify-center
                                text-terra-300 mb-4 group-hover:bg-terra-500/30 transition-colors">
                  {icon}
                </div>
                <h3 className="font-body text-base font-semibold text-cream-100 mb-2">{title}</h3>
                <p className="font-body text-sm text-sage-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="section-title">¿Cómo funciona?</h2>
          <p className="section-subtitle">Tres pasos para transformar tu hogar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ num, title, desc }, i) => (
            <div key={num} className="text-center relative">
              <div className="w-16 h-16 bg-zen-700 text-white rounded-2xl flex items-center
                              justify-center font-display text-2xl font-bold mx-auto mb-4">
                {num}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-0.5 bg-cream-400" />
              )}
              <h3 className="font-body text-base font-semibold text-zen-900 mb-2">{title}</h3>
              <p className="font-body text-sm text-sage-500 leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section className="bg-terra-500 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold mb-4">
            ¿Listo para transformar tu hogar?
          </h2>
          <p className="font-body text-terra-100 mb-8 text-lg max-w-xl mx-auto">
            Contáctanos hoy y te asesoraremos gratis para encontrar la solución perfecta.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/productos" className="bg-white text-terra-600 px-6 py-3 rounded-full font-body font-semibold hover:bg-cream-100 transition-colors">
              Explorar Productos
            </Link>
            <a
              href="https://wa.me/529930000000"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-6 py-3 rounded-full font-body font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              💬 WhatsApp Ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

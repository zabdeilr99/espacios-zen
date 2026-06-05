import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/productos/${product.id}`} className="group">
      <article className="card-zen overflow-hidden flex flex-col h-full">
        {/* Image / emoji placeholder */}
        <div className={`relative h-48 bg-gradient-to-br ${product.gradient || 'from-green-100 to-emerald-200'}
                         flex items-center justify-center overflow-hidden`}>
          <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
            {product.emoji || '📦'}
          </span>

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 font-body text-xs font-semibold px-2.5 py-1
                             bg-terra-500 text-white rounded-full">
              {product.badge}
            </span>
          )}

          {/* Low stock */}
          {product.stock <= 5 && (
            <span className="absolute top-3 right-3 font-body text-xs px-2.5 py-1
                             bg-amber-500 text-white rounded-full font-semibold">
              ¡Últimas!
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-body text-sm font-semibold text-zen-900 leading-snug mb-2
                         group-hover:text-zen-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-body text-xs font-semibold text-zen-700">
              {product.rating?.toFixed(1)}
            </span>
            <span className="font-body text-xs text-sage-400">
              ({product.reviewCount} reseñas)
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div>
              <span className="font-display text-xl font-semibold text-zen-900">
                ${product.price?.toLocaleString('es-MX')}
              </span>
              {product.originalPrice && (
                <span className="font-body text-xs text-sage-400 line-through ml-2">
                  ${product.originalPrice.toLocaleString('es-MX')}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-full bg-zen-700 text-white flex items-center justify-center
                         hover:bg-zen-600 active:scale-95 transition-all shadow-sm hover:shadow-md"
              aria-label="Agregar al carrito"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

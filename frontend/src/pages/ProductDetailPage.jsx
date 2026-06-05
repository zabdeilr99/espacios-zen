import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Check, Package, Truck } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsAPI.getById(id)
      .then(res => {
        setProduct(res.data.product);
        setRelated(res.data.related);
      })
      .catch(() => navigate('/productos', { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-zen-pattern flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-zen-200 border-t-zen-600 rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addItem(product);
    toast.success('¡Agregado al carrito! 🌿');
  };

  return (
    <div className="bg-zen-pattern min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-body text-sm text-sage-500 hover:text-zen-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Regresar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product image */}
          <div className={`rounded-3xl bg-gradient-to-br ${product.gradient || 'from-green-100 to-emerald-200'}
                           flex items-center justify-center aspect-square text-9xl shadow-inner`}>
            {product.emoji || '📦'}
          </div>

          {/* Product info */}
          <div>
            {product.badge && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-terra-100 text-terra-700
                               text-xs font-semibold font-body mb-3">
                {product.badge}
              </span>
            )}

            <h1 className="font-display text-3xl md:text-4xl font-bold text-zen-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {Array(5).fill(null).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                  />
                ))}
              </div>
              <span className="font-body text-sm font-semibold text-zen-700">{product.rating?.toFixed(1)}</span>
              <span className="font-body text-sm text-sage-400">({product.reviewCount} reseñas)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="font-display text-4xl font-bold text-zen-900">
                ${product.price?.toLocaleString('es-MX')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-body text-lg text-sage-400 line-through mb-1">
                    ${product.originalPrice.toLocaleString('es-MX')}
                  </span>
                  <span className="font-body text-sm font-bold text-terra-600 mb-1">
                    -{discount}% OFF
                  </span>
                </>
              )}
              <span className="font-body text-sm text-sage-400 mb-1">MXN</span>
            </div>

            {/* Description */}
            <p className="font-body text-sage-600 leading-relaxed mb-6 text-sm">
              {product.description}
            </p>

            {/* Features */}
            {product.features?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-body text-sm font-semibold text-zen-900 mb-3">Características:</h3>
                <ul className="space-y-2">
                  {product.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-zen-600 shrink-0" />
                      <span className="font-body text-sm text-zen-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-4 h-4 text-sage-500" />
              <span className={`font-body text-sm ${product.stock > 5 ? 'text-zen-600' : 'text-amber-600'}`}>
                {product.stock > 5 ? `${product.stock} en stock` : `¡Solo quedan ${product.stock}!`}
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="btn-terra flex items-center justify-center gap-2 flex-1 text-base py-4"
              >
                <ShoppingCart className="w-5 h-5" />
                Agregar al Carrito
              </button>
              <a
                href={`https://wa.me/529930000000?text=Hola!%20Quiero%20información%20sobre%20el%20producto:%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-zen-700 text-zen-700
                           px-6 py-4 rounded-full font-body font-medium hover:bg-zen-700 hover:text-white
                           transition-all text-base"
              >
                💬 Preguntar
              </a>
            </div>

            {/* Shipping info */}
            <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-zen-50 border border-zen-100">
              <Truck className="w-4 h-4 text-zen-600" />
              <span className="font-body text-xs text-zen-700">
                Entrega a domicilio en Villahermosa, Tabasco
              </span>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-3xl text-zen-900 mb-8">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

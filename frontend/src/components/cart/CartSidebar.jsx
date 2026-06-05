import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', customerAddress: '' });

  const handleOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setCheckingOut(true);
    try {
      await ordersAPI.create({
        ...form,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      });
      toast.success('¡Pedido realizado! Te contactaremos pronto 🌿');
      clearCart();
      setShowForm(false);
      closeCart();
    } catch (err) {
      toast.error('Error al procesar pedido. Inténtalo de nuevo.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50
                      flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-300">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-zen-700" />
            <h2 className="font-display text-xl text-zen-900">Mi Carrito</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5 text-zen-700" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-zen">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-6xl">🛒</div>
              <p className="font-body text-sage-500">Tu carrito está vacío</p>
              <Link
                to="/productos"
                onClick={closeCart}
                className="btn-primary text-sm"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-cream-50 border border-cream-200">
                  {/* Emoji placeholder */}
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${item.gradient || 'from-green-100 to-emerald-200'}
                                   flex items-center justify-center text-2xl shrink-0`}>
                    {item.emoji || '📦'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-zen-900 leading-tight truncate">
                      {item.name}
                    </p>
                    <p className="font-body text-sm font-semibold text-terra-600 mt-0.5">
                      ${(item.price * item.quantity).toLocaleString('es-MX')}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3 text-zen-700" />
                      </button>
                      <span className="font-body text-sm font-medium w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3 text-zen-700" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-sage-400 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-300 p-5">
            {!showForm ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sage-600">Subtotal</span>
                  <span className="font-display text-xl font-semibold text-zen-900">
                    ${subtotal.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-terra w-full text-center"
                >
                  Realizar Pedido
                </button>
                <a
                  href={`https://wa.me/529930000000?text=Hola!%20Me%20interesa%20hacer%20un%20pedido:%0A${items.map(i => `- ${i.name} x${i.quantity}`).join('%0A')}%0A%0ATotal: $${subtotal} MXN`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-2 font-body text-sm text-zen-600 hover:text-zen-800 transition-colors"
                >
                  💬 O pedir por WhatsApp
                </a>
              </>
            ) : (
              <form onSubmit={handleOrder} className="space-y-3">
                <h3 className="font-display text-lg text-zen-900">Datos de entrega</h3>
                <input className="input-zen" placeholder="Tu nombre completo *" required
                  value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} />
                <input className="input-zen" type="email" placeholder="Tu email *" required
                  value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})} />
                <input className="input-zen" placeholder="Tu teléfono/WhatsApp *" required
                  value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} />
                <input className="input-zen" placeholder="Dirección de entrega"
                  value={form.customerAddress} onChange={e => setForm({...form, customerAddress: e.target.value})} />
                <button type="submit" disabled={checkingOut} className="btn-terra w-full">
                  {checkingOut ? 'Procesando...' : `Confirmar Pedido · $${subtotal.toLocaleString('es-MX')}`}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="block w-full text-center text-sm text-sage-500 hover:text-sage-700 transition-colors">
                  Regresar
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}

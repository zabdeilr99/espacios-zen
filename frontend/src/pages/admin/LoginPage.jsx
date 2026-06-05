import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: 'admin@espacioszen.mx', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('¡Bienvenido al panel de Espacios Zen!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-zen flex flex-col items-center justify-center px-4 relative">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-sage-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-terra-500/10 rounded-full blur-3xl" />

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-zen-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-cream-100" />
          </div>
          <h1 className="font-display text-3xl font-bold text-zen-900">Espacios Zen</h1>
          <p className="font-body text-sm text-sage-500 mt-1">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-zen">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input-zen"
              placeholder="admin@espacioszen.mx"
              required
            />
          </div>

          <div>
            <label className="label-zen">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-zen pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Entrando...
              </span>
            ) : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-cream-100 rounded-xl">
          <p className="font-body text-xs text-sage-500 font-semibold mb-1">Credenciales de prueba:</p>
          <p className="font-body text-xs text-zen-700">📧 admin@espacioszen.mx</p>
          <p className="font-body text-xs text-zen-700">🔑 Zen2024Admin</p>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="font-body text-sm text-sage-400 hover:text-zen-600 transition-colors">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}

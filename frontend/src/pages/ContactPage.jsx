import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Ubicación',
    value: 'Benito Juárez García 1073-983, Comalcalco, Tab.',
    sub: 'Vicente Guerrero, C.P. 86350',
    link: 'https://maps.app.goo.gl/VZbAMjXq3uKE2JFc7',
  },
  { icon: <Phone className="w-5 h-5" />, label: 'Teléfono / WhatsApp', value: '+52 993 000 0000', link: 'tel:+529930000000' },
  { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'hola@espacioszen.mx', link: 'mailto:hola@espacioszen.mx' },
  { icon: <Clock className="w-5 h-5" />, label: 'Horario', value: 'Lun–Sáb: 9:00–18:00', sub: 'Respuesta en menos de 2 horas' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.send(form);
      toast.success('¡Mensaje enviado! Te contactaremos pronto 🌿');
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Error al enviar. Intenta por WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zen-pattern min-h-screen">
      {/* Header */}
      <div className="bg-zen-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-bold text-cream-100 mb-3">Contáctanos</h1>
          <p className="font-body text-sage-300 text-lg">
            Estamos aquí para ayudarte a transformar tu hogar. Escríbenos o llámanos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Info + WhatsApp */}
          <div>
            <div className="card-zen p-8 mb-6">
              <h2 className="font-display text-2xl font-bold text-zen-900 mb-6">
                Información de Contacto
              </h2>
              <div className="space-y-5">
                {contactInfo.map(({ icon, label, value, sub, link }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 bg-zen-50 rounded-xl flex items-center justify-center
                                    text-zen-600 shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="font-body text-xs text-sage-400 font-medium uppercase tracking-wide">{label}</p>
                      {link ? (
                        <a href={link} className="font-body text-sm font-semibold text-zen-900 hover:text-terra-600 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="font-body text-sm font-semibold text-zen-900">{value}</p>
                      )}
                      {sub && <p className="font-body text-xs text-sage-400 mt-0.5">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp card */}
            <div className="rounded-2xl bg-[#25D366] p-6 text-white">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-body text-lg font-bold mb-2">¿Prefieres WhatsApp?</h3>
              <p className="font-body text-sm text-green-100 mb-4 leading-relaxed">
                Respuesta inmediata. Envíanos un mensaje y te atendemos en minutos.
              </p>
              <a
                href="https://wa.me/529930000000?text=Hola!%20Quisiera%20información%20sobre%20sus%20productos%20de%20organización"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#25D366] px-5 py-2.5
                           rounded-full font-body font-semibold text-sm hover:bg-green-50 transition-colors"
              >
                Abrir WhatsApp
                <Send className="w-4 h-4" />
              </a>
            </div>

            {/* Social media */}
            <div className="card-zen p-6 mt-6">
              <h3 className="font-body text-sm font-semibold text-zen-900 mb-4">Síguenos en Redes</h3>
              <div className="flex gap-3">
                {[
                  { icon: '📷', label: 'Instagram', href: 'https://instagram.com/espacioszen.mx', color: 'hover:bg-pink-50' },
                  { icon: '📘', label: 'Facebook', href: 'https://facebook.com/EspaciosZenMx', color: 'hover:bg-blue-50' },
                  { icon: '🎵', label: 'TikTok', href: 'https://tiktok.com/@espacioszen', color: 'hover:bg-gray-50' },
                ].map(({ icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-cream-300
                                font-body text-sm text-zen-700 transition-colors ${color}`}
                  >
                    {icon} {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Map embed */}
            <div className="card-zen p-4 mt-6 overflow-hidden">
              <h3 className="font-body text-sm font-semibold text-zen-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terra-500" /> Encuéntranos aquí
              </h3>
              <iframe
                title="Ubicación Espacios Zen"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: '12px' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=18.256691,-93.220009&z=16&output=embed"
              />
              <a
                href="https://maps.app.goo.gl/VZbAMjXq3uKE2JFc7"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-terra-600 hover:text-terra-700 mt-2 block text-center"
              >
                📍 Benito Juárez García 1073-983, Vicente Guerrero, Comalcalco, Tab. → Abrir en Maps
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="card-zen p-8">
            <h2 className="font-display text-2xl font-bold text-zen-900 mb-6">
              Envíanos un Mensaje
            </h2>

            {sent && (
              <div className="mb-6 p-4 bg-zen-50 border border-zen-200 rounded-xl text-center">
                <div className="text-3xl mb-2">✅</div>
                <p className="font-body text-sm font-semibold text-zen-800">¡Mensaje enviado!</p>
                <p className="font-body text-xs text-sage-500 mt-1">Te responderemos pronto.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-zen">Nombre *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input-zen"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <label className="label-zen">Teléfono</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="input-zen"
                    placeholder="993 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="label-zen">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-zen"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="label-zen">Asunto</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="input-zen"
                >
                  <option value="">Selecciona un tema</option>
                  <option value="consulta">Consulta general</option>
                  <option value="pedido">Información de pedido</option>
                  <option value="asesoria">Asesoría de organización</option>
                  <option value="cotizacion">Cotización</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="label-zen">Mensaje *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="input-zen resize-none"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  required
                  minLength={10}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-terra w-full flex items-center justify-center gap-2 py-3.5"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Mensaje
                  </>
                )}
              </button>
                 </form>
          </div>
        </div>
      </div>
    </div>
  );
}
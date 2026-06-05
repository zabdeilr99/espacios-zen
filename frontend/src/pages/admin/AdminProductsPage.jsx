import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  AlertTriangle,
  Package,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { productsAPI, categoriesAPI } from "../../services/api";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  emoji: "📦",
  features: "",
  active: true,
};

const EMOJIS = ["📦", "🗄️", "🧺", "🛋️", "🪴", "🍽️", "📚", "🛁", "🏠", "✨", "🧹", "🪣", "💼", "🎁", "🌿"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        productsAPI.getAll({ limit: 100, includeInactive: true }),
        categoriesAPI.getAll(),
      ]);
      setProducts(pRes.data.products || []);
      setCategories(cRes.data.categories || []);
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: String(p.price || ""),
      stock: String(p.stock ?? ""),
      category: p.category || "",
      emoji: p.emoji || "📦",
      features: Array.isArray(p.features) ? p.features.join("\n") : (p.features || ""),
      active: p.active !== false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast.error("Nombre y precio son obligatorios");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10) || 0,
        features: form.features
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      };
      if (editingId) {
        await productsAPI.update(editingId, payload);
        toast.success("Producto actualizado ✓");
      } else {
        await productsAPI.create(payload);
        toast.success("Producto creado ✓");
      }
      setShowModal(false);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productsAPI.delete(id);
      toast.success("Producto eliminado");
      setConfirmDelete(null);
      await load();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const toggleActive = async (p) => {
    try {
      await productsAPI.update(p.id, { active: !p.active });
      toast.success(p.active ? "Producto desactivado" : "Producto activado");
      await load();
    } catch {
      toast.error("Error al actualizar");
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchActive = showInactive ? true : p.active !== false;
    return matchSearch && matchActive;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {products.filter((p) => p.active !== false).length} activos · {products.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
            title="Recargar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input-zen pl-9 w-full"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded"
          />
          Mostrar inactivos
        </label>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-zen-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-zen p-16 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No se encontraron productos</p>
        </div>
      ) : (
        <div className="card-zen overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Producto</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Categoría</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Precio</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Stock</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Estado</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-b border-gray-50 hover:bg-cream-50 transition-colors ${
                      p.active === false ? "opacity-50" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.emoji || "📦"}</span>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-48">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-48">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                      <span className="capitalize">{p.category || "—"}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-700">
                      ${(p.price || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500 hidden sm:table-cell">
                      <span className={p.stock <= 5 ? "text-red-500 font-semibold" : ""}>{p.stock ?? "—"}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
                          p.active !== false
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title={p.active !== false ? "Desactivar" : "Activar"}
                      >
                        {p.active !== false ? (
                          <><Eye className="w-3 h-3" /> Activo</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> Inactivo</>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-zen-600 hover:bg-zen-50 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Emoji picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ícono</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setForm({ ...form, emoji: e })}
                      className={`text-xl p-2 rounded-lg border-2 transition-all ${
                        form.emoji === e ? "border-zen-400 bg-zen-50" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  className="input-zen w-full"
                  placeholder="Organizador de Cocina Premium"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  className="input-zen w-full resize-none"
                  rows={3}
                  placeholder="Describe el producto brevemente..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (MXN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input-zen w-full"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="299.00"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    className="input-zen w-full"
                    type="number"
                    min="0"
                    placeholder="50"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  className="input-zen w-full"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Características (una por línea)
                </label>
                <textarea
                  className="input-zen w-full resize-none font-mono text-sm"
                  rows={4}
                  placeholder={"Fácil instalación\nMaterial premium\nGarantía 1 año"}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Producto activo (visible en tienda)</span>
              </label>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingId ? "Guardar Cambios" : "Crear Producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">¿Eliminar producto?</h3>
            <p className="text-gray-500 text-sm mb-6">
              <strong>"{confirmDelete.name}"</strong> será eliminado permanentemente.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

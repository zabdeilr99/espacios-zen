import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  BarChart2,
  X,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { ordersAPI } from "../../services/api";
import toast from "react-hot-toast";

const STATUS_FLOW = {
  nuevo: { next: "procesando", label: "Nuevo", color: "bg-blue-100 text-blue-700", icon: Clock },
  procesando: { next: "enviado", label: "Procesando", color: "bg-yellow-100 text-yellow-700", icon: BarChart2 },
  enviado: { next: "entregado", label: "Enviado", color: "bg-purple-100 text-purple-700", icon: Truck },
  entregado: { next: null, label: "Entregado", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelado: { next: null, label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle },
};

const ALL_STATUSES = ["todos", "nuevo", "procesando", "enviado", "entregado", "cancelado"];

function StatusBadge({ status }) {
  const cfg = STATUS_FLOW[status] || STATUS_FLOW.nuevo;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function OrderDetailModal({ order, onClose, onStatusChange }) {
  const cfg = STATUS_FLOW[order.status];
  const [updating, setUpdating] = useState(false);

  const advance = async () => {
    if (!cfg.next) return;
    setUpdating(true);
    try {
      await ordersAPI.updateStatus(order.id, cfg.next);
      toast.success(`Pedido avanzado a: ${STATUS_FLOW[cfg.next].label}`);
      onStatusChange();
      onClose();
    } catch {
      toast.error("Error al actualizar estado");
    } finally {
      setUpdating(false);
    }
  };

  const cancel = async () => {
    if (order.status === "entregado" || order.status === "cancelado") return;
    setUpdating(true);
    try {
      await ordersAPI.updateStatus(order.id, "cancelado");
      toast.success("Pedido cancelado");
      onStatusChange();
      onClose();
    } catch {
      toast.error("Error al cancelar");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Detalle del Pedido</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status & date */}
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
          </div>

          {/* Customer info */}
          <div className="card-zen p-4 space-y-2">
            <h3 className="font-semibold text-gray-700 text-sm mb-3">Datos del Cliente</h3>
            <p className="text-sm flex items-center gap-2 text-gray-600">
              <span className="w-5 h-5 flex items-center justify-center text-gray-400">👤</span>
              <strong>{order.customer?.name || "—"}</strong>
            </p>
            {order.customer?.email && (
              <p className="text-sm flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                {order.customer.email}
              </p>
            )}
            {order.customer?.phone && (
              <p className="text-sm flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                {order.customer.phone}
              </p>
            )}
            {order.customer?.address && (
              <p className="text-sm flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                {order.customer.address}
              </p>
            )}
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-gray-700 text-sm mb-3">Productos</h3>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji || "📦"}</span>
                    <div>
                      <p className="font-medium text-gray-700">{item.name}</p>
                      <p className="text-xs text-gray-400">Cant: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">
                    ${((item.price || 0) * (item.quantity || 1)).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-700">Total</span>
              <span className="font-bold text-lg text-zen-700">
                ${(order.total || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
              </span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
              <p className="text-xs text-yellow-700 font-semibold mb-1">Notas del cliente</p>
              <p className="text-sm text-yellow-800">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          {(cfg.next || (order.status !== "entregado" && order.status !== "cancelado")) && (
            <div className="flex gap-3 pt-2">
              {order.status !== "entregado" && order.status !== "cancelado" && (
                <button
                  onClick={cancel}
                  disabled={updating}
                  className="flex-1 px-4 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 font-semibold rounded-xl transition-colors text-sm"
                >
                  Cancelar pedido
                </button>
              )}
              {cfg.next && (
                <button
                  onClick={advance}
                  disabled={updating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  {updating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  Avanzar → {STATUS_FLOW[cfg.next].label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll({ limit: 200 });
      setOrders((res.data.orders || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      toast.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "todos" || o.status === filterStatus;
    const matchSearch =
      !search ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = orders.reduce(
    (acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; },
    {}
  );

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {orders.length} pedidos · {counts.nuevo || 0} nuevos
          </p>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
          title="Recargar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {ALL_STATUSES.map((s) => {
          const isActive = filterStatus === s;
          const count = s === "todos" ? orders.length : counts[s] || 0;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                isActive
                  ? "bg-zen-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "todos" ? "Todos" : STATUS_FLOW[s].label}{" "}
              <span className={`ml-1 text-xs ${isActive ? "opacity-80" : "text-gray-400"}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="input-zen pl-9 w-full"
          placeholder="Buscar por cliente o ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-zen-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-zen p-16 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No se encontraron pedidos</p>
        </div>
      ) : (
        <div className="card-zen overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Fecha</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Productos</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Total</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Estado</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-cream-50 transition-colors cursor-pointer"
                    onClick={() => setSelected(order)}
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">{order.customer?.name || "—"}</p>
                      <p className="text-xs text-gray-400 font-mono truncate max-w-32">
                        {order.id?.slice(0, 8)}…
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                      {order.items?.length || 0} producto{(order.items?.length || 0) !== 1 ? "s" : ""}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-700">
                      ${(order.total || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(order); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-zen-600 hover:bg-zen-50 transition-colors"
                        title="Ver detalle"
                      >
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={load}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowRight,
  BarChart2,
  Users,
} from "lucide-react";
import { ordersAPI, productsAPI } from "../../services/api";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card-zen p-6 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5 truncate">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const statusConfig = {
  nuevo: { label: "Nuevo", color: "bg-blue-100 text-blue-700", icon: Clock },
  procesando: { label: "Procesando", color: "bg-yellow-100 text-yellow-700", icon: BarChart2 },
  enviado: { label: "Enviado", color: "bg-purple-100 text-purple-700", icon: Truck },
  entregado: { label: "Entregado", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordRes, prodRes] = await Promise.all([
          ordersAPI.getAll({ limit: 100 }),
          productsAPI.getAll({ limit: 100 }),
        ]);
        setOrders(ordRes.data.orders || []);
        setProducts(prodRes.data.products || []);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-zen-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelado")
    .reduce((s, o) => s + (o.total || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === "nuevo" || o.status === "procesando").length;
  const activeProducts = products.filter((p) => p.active !== false).length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  // Status counts for mini chart
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-500 text-sm mt-1">
          Resumen general de Espacios Zen
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Ingresos Totales"
          value={`$${totalRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`}
          sub="Pedidos no cancelados"
          color="bg-zen-500"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Pedidos"
          value={orders.length}
          sub={`${pendingOrders} pendientes`}
          color="bg-terra-500"
        />
        <StatCard
          icon={Package}
          label="Productos Activos"
          value={activeProducts}
          sub={`${products.length} en total`}
          color="bg-indigo-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Tasa de Entrega"
          value={
            orders.length
              ? `${Math.round(((statusCounts.entregado || 0) / orders.length) * 100)}%`
              : "—"
          }
          sub={`${statusCounts.entregado || 0} entregados`}
          color="bg-emerald-500"
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2/3) */}
        <div className="lg:col-span-2 card-zen p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Pedidos Recientes</h2>
            <Link
              to="/admin/pedidos"
              className="text-zen-600 text-sm font-medium hover:text-zen-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin pedidos registrados</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Cliente</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Fecha</th>
                    <th className="text-right py-2 px-2 text-gray-400 font-medium">Total</th>
                    <th className="text-center py-2 px-2 text-gray-400 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const cfg = statusConfig[order.status] || statusConfig.nuevo;
                    return (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-cream-50">
                        <td className="py-3 px-2 font-medium text-gray-700">
                          {order.customer?.name || "—"}
                        </td>
                        <td className="py-3 px-2 text-gray-400">{formatDate(order.createdAt)}</td>
                        <td className="py-3 px-2 text-right font-semibold text-gray-700">
                          ${(order.total || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Summary (1/3) */}
        <div className="card-zen p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Estado de Pedidos</h2>
          <div className="space-y-3">
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const count = statusCounts[key] || 0;
              const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{cfg.label}</span>
                    <span className="font-semibold text-gray-700">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        key === "entregado"
                          ? "bg-green-400"
                          : key === "enviado"
                          ? "bg-purple-400"
                          : key === "procesando"
                          ? "bg-yellow-400"
                          : key === "cancelado"
                          ? "bg-red-400"
                          : "bg-blue-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <h3 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-1">
              <Users className="w-4 h-4" /> Acceso rápido
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/productos"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-cream-50 transition-colors group"
              >
                <span className="text-sm text-gray-600 group-hover:text-zen-700">Gestionar productos</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-zen-500" />
              </Link>
              <Link
                to="/admin/pedidos"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-cream-50 transition-colors group"
              >
                <span className="text-sm text-gray-600 group-hover:text-zen-700">Ver pedidos</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-zen-500" />
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-cream-50 transition-colors group"
              >
                <span className="text-sm text-gray-600 group-hover:text-zen-700">Ver tienda</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-zen-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

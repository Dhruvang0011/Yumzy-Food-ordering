import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  confirmed: {
    light: "bg-green-50  text-green-600  border-green-200",
    dark: "dark:bg-[#0d2b12] dark:text-green-400  dark:border-green-900/60",
    dot: "bg-green-500",
  },
  pending: {
    light: "bg-yellow-50 text-yellow-600 border-yellow-200",
    dark: "dark:bg-[#1f1500] dark:text-yellow-400 dark:border-yellow-900/60",
    dot: "bg-yellow-400",
  },
  cancelled: {
    light: "bg-red-50    text-red-600    border-red-200",
    dark: "dark:bg-[#2b0d0d] dark:text-red-400    dark:border-red-900/60",
    dot: "bg-red-500",
  },
  preparing: {
    light: "bg-blue-50   text-blue-600   border-blue-200",
    dark: "dark:bg-[#0a1628] dark:text-blue-400   dark:border-blue-900/60",
    dot: "bg-blue-500",
  },
  delivered: {
    light: "bg-gray-100  text-gray-600   border-gray-200",
    dark: "dark:bg-[#2a1508] dark:text-[#b09070]  dark:border-[#3d2820]",
    dot: "bg-gray-400",
  },
};

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/restaurantOwner/getOrder");
      setOrders(res.data);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId + status);
    try {
      await api.patch("/restaurantOwner/updateOrderStatus", {
        orderId,
        status,
      });
      toast.success(`Order ${status}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');`}</style>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
              style={{
                background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                boxShadow: "0 6px 20px rgba(255,107,107,0.35)",
                animation: "pulse 1.4s ease-in-out infinite",
              }}
            >
              🧾
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Loading orders…
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        .oo-root     { font-family: 'DM Sans', sans-serif; }
        .oo-playfair { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      <div className="oo-root min-h-screen transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="mb-8 fade-up">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-1">
              Owner Panel
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <h1 className="oo-playfair text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 m-0">
                Restaurant Orders
              </h1>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-600">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            </div>
          </div>

          {/* ── Empty State ── */}
          {orders.length === 0 ? (
            <div className="fade-up flex flex-col items-center justify-center py-24 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5
                bg-[#fff0ee] dark:bg-[#1a0f0c]"
              >
                🧾
              </div>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
                No orders yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-600">
                New orders will appear here once customers place them.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const status = order.status || "pending";
                const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

                return (
                  <div
                    key={order._id}
                    className="fade-up rounded-2xl overflow-hidden transition-colors duration-200
                      bg-white dark:bg-[#1a0f0c]
                      border border-[#e5e5e5] dark:border-[#3d2820]
                      shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* ── Order Header ── */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 px-5 py-4
                      border-b border-[#f0f0f0] dark:border-[#3d2820]"
                    >
                      {/* Left — ID + customer */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0
                          bg-[#fff0ee] dark:bg-[#1a0f0c] text-[#ff6b6b]"
                        >
                          {order.user?.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-[#ff6b6b] bg-[#fff0ee] dark:bg-[#1a0f0c] px-2 py-0.5 rounded-lg">
                              #{order._id.slice(-6).toUpperCase()}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize
                              ${cfg.light} ${cfg.dark}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
                              />
                              {status}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                            {order.user?.name ?? "Unknown Customer"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                            {new Date(order.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Right — total */}
                      <div className="sm:text-right flex-shrink-0">
                        <p className="oo-playfair text-xl font-black text-gray-900 dark:text-gray-100">
                          ₹{order.pricing.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* ── Order Items ── */}
                    <div className="px-5 py-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600 dark:text-gray-300">
                            {item.name}
                            <span className="ml-1.5 text-xs font-bold text-gray-400 dark:text-gray-600">
                              × {item.quantity}
                            </span>
                          </span>
                          <span className="font-semibold text-gray-700 dark:text-gray-100">
                            ₹{item.subtotal}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* ── Delivery Address + Actions ── */}
                    <div
                      className="px-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3
                      border-t border-[#f5f5f5] dark:border-[#3d2820] pt-3"
                    >
                      {/* Address */}
                      <div className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-600">
                        <span className="mt-0.5">📍</span>
                        <span className="leading-relaxed">{order.address}</span>
                      </div>

                      {/* Action buttons — only for pending */}
                      {order.status === "pending" && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => updateStatus(order._id, "confirmed")}
                            disabled={!!updatingId}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150
                              text-green-600 dark:text-green-400
                              bg-green-50 dark:bg-[#0d2b12]
                              border border-green-200 dark:border-green-900/50
                              hover:bg-green-100 dark:hover:bg-[#122e17]
                              disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingId === order._id + "confirmed"
                              ? "…"
                              : "✓ Confirm"}
                          </button>
                          <button
                            onClick={() => updateStatus(order._id, "cancelled")}
                            disabled={!!updatingId}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150
                              text-red-500 dark:text-red-400
                              bg-red-50 dark:bg-[#2b0d0d]
                              border border-red-100 dark:border-red-900/50
                              hover:bg-red-100 dark:hover:bg-[#3d1010]
                              disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingId === order._id + "cancelled"
                              ? "…"
                              : "✕ Cancel"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OwnerOrders;

import { useEffect, useState } from "react";
import api from "../utils/axios";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    emoji: "⏳",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-900/50",
  },
  confirmed: {
    label: "Confirmed",
    emoji: "✅",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
  },
  preparing: {
    label: "Preparing",
    emoji: "👨‍🍳",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-900/50",
  },
  delivered: {
    label: "Delivered",
    emoji: "🛵",
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-900/50",
  },
  cancelled: {
    label: "Cancelled",
    emoji: "❌",
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-900/50",
  },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await api.put(`/order/cancel/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error("Cancel error", err);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatus = (status) =>
    STATUS_CONFIG[status] || {
      label: status,
      emoji: "📦",
      bg: "bg-gray-50 dark:bg-[#1a0f0c]",
      text: "text-gray-600 dark:text-gray-400",
      border: "border-gray-200 dark:border-[#3d2820]",
    };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      <div
        className="min-h-screen transition-colors duration-200"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* ── Page Header ── */}
          <div className="mb-7 sm:mb-9 fade-up">
            <p
              className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1"
              style={{ color: "#ff6b6b" }}
            >
              Your History
            </p>
            <div className="flex items-center justify-between">
              <h1
                className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                My Orders
              </h1>
              {!loading && orders.length > 0 && (
                <span
                  className="text-sm font-semibold px-3 py-1 rounded-full
                  bg-[#fff0ee] dark:bg-[#1a0f0c] text-[#ff6b6b]"
                >
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </span>
              )}
            </div>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <svg
                className="animate-spin w-10 h-10 text-[#ff6b6b]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 0110 10"
                  stroke="#ff6b6b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-sm text-gray-400 dark:text-gray-400 font-semibold">
                Loading orders…
              </p>
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center fade-up">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-4
                bg-[#fff0ee] dark:bg-[#1a0f0c]"
              >
                📦
              </div>
              <h2
                className="text-lg font-black text-gray-800 dark:text-gray-100 mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                No orders yet
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-6">
                When you place an order, it'll show up here.
              </p>
              <a
                href="/user"
                className="px-6 py-3 rounded-xl text-white text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                  boxShadow: "0 6px 20px rgba(255,107,107,0.3)",
                }}
              >
                Browse Restaurants →
              </a>
            </div>
          )}

          {/* ── Orders List ── */}
          {!loading && (
            <div className="space-y-4 sm:space-y-5">
              {orders.map((order, i) => {
                const st = getStatus(order.status);
                const isPaid = order.paymentStatus === "paid";

                return (
                  <div
                    key={order._id}
                    className="fade-up rounded-2xl overflow-hidden
                      bg-white dark:bg-[#1a0f0c]
                      border border-[#f5ede9] dark:border-[#3d2820]
                      shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                      transition-colors duration-200"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* ── Card Header ── */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5
                      border-b border-[#f5ede9] dark:border-[#3d2820]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                          bg-[#fff0ee] dark:bg-[#1a0f0c]"
                        >
                          🍽️
                        </div>
                        <div>
                          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                            {order.restaurant?.name || "Restaurant"}
                          </h2>
                          <p className="text-xs text-gray-400 dark:text-gray-600 font-mono mt-0.5 truncate max-w-[180px] sm:max-w-none">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Status + Payment badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Order status */}
                        <span
                          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${st.bg} ${st.text} ${st.border}`}
                        >
                          {st.emoji} {st.label}
                        </span>
                        {/* Payment status */}
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            isPaid
                              ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50"
                              : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                          }`}
                        >
                          {isPaid ? "💳 Paid" : "❗ Unpaid"}
                        </span>
                      </div>
                    </div>

                    {/* ── Order Items ── */}
                    <div className="px-4 sm:px-5 py-4 space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between gap-3 py-2 border-b border-dashed border-[#f0e8e4] dark:border-[#3d2820] last:border-0"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                              bg-[#fff0ee] dark:bg-[#1a0f0c] text-[#ff6b6b]"
                            >
                              {item.quantity}
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 flex-shrink-0">
                            ₹{item.subtotal}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* ── Pricing ── */}
                    <div
                      className="mx-4 sm:mx-5 mb-4 sm:mb-5 rounded-xl p-4
                      bg-[#fafafa] dark:bg-[#1a0f0c]
                      border border-[#f0ebe8] dark:border-[#3d2820]"
                    >
                      <div className="space-y-1.5 text-sm">
                        {[
                          { label: "Subtotal", value: order.pricing.subtotal },
                          { label: "GST", value: order.pricing.gst },
                          {
                            label: "Delivery",
                            value: order.pricing.deliveryCharge,
                          },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">
                              {label}
                            </span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              ₹{value}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 mt-1 border-t border-dashed border-[#f0e8e4] dark:border-[#3d2820]">
                          <span className="font-bold text-gray-800 dark:text-gray-100">
                            Total
                          </span>
                          <span
                            className="text-base font-black"
                            style={{ color: "#ff6b6b" }}
                          >
                            ₹{order.pricing.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── Cancel Button ── */}
                    {order.status === "pending" && (
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex justify-end">
                        <button
                          onClick={() => handleCancel(order._id)}
                          disabled={cancellingId === order._id}
                          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all
                            disabled:opacity-60 disabled:cursor-not-allowed
                            bg-red-50 dark:bg-red-950/30
                            text-red-600 dark:text-red-400
                            border border-red-200 dark:border-red-900/50
                            hover:bg-red-100 dark:hover:bg-red-950/50"
                        >
                          {cancellingId === order._id ? (
                            <>
                              <svg
                                className="animate-spin w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeOpacity="0.3"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M12 2a10 10 0 0110 10"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Cancelling…
                            </>
                          ) : (
                            "❌ Cancel Order"
                          )}
                        </button>
                      </div>
                    )}
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

export default Orders;

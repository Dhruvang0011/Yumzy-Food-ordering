import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  delivered: {
    light: "bg-green-50  text-green-600  border-green-200",
    dark: "dark:bg-[#0d2b12] dark:text-green-400  dark:border-green-900/60",
    dot: "bg-green-500",
  },
  preparing: {
    light: "bg-yellow-50 text-yellow-600 border-yellow-200",
    dark: "dark:bg-[#1f1500] dark:text-yellow-400 dark:border-yellow-900/60",
    dot: "bg-yellow-400",
  },
  cancelled: {
    light: "bg-red-50    text-red-600    border-red-200",
    dark: "dark:bg-[#2b0d0d] dark:text-red-400    dark:border-red-900/60",
    dot: "bg-red-500",
  },
  pending: {
    light: "bg-gray-100  text-gray-600   border-gray-200",
    dark: "dark:bg-[#1a0f0c] dark:text-gray-400  dark:border-[#3d2820]",
    dot: "bg-gray-400",
  },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders", { withCredentials: true });
      setOrders(res.data.orders);
      setFilteredOrders(res.data.orders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let data = [...orders];
    if (search) {
      data = data.filter((o) =>
        o.user?.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    setFilteredOrders(data);
  }, [search, orders]);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');`}</style>
        <div
          className="min-h-screen flex items-center justify-center "
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
        .ao-root    { font-family: 'DM Sans', sans-serif; }
        .ao-playfair { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }

        /* Scrollbar — dark */
        .ao-scroll::-webkit-scrollbar { height: 5px; }
        .ao-scroll::-webkit-scrollbar-track  { background: transparent; }
        .ao-scroll::-webkit-scrollbar-thumb  { background: #3d2820; border-radius: 999px; }
      `}</style>

      <div className="ao-root min-h-screen transition-colors duration-300">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="mb-7 fade-up">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-1">
              Admin Panel
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <h1 className="ao-playfair text-2xl sm:text-3xl font-black m-0">
                Orders
              </h1>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-600">
                {filteredOrders.length} of {orders.length} orders
              </span>
            </div>
          </div>

          {/* ── Search ── */}
          <div
            className="fade-up relative mb-7 w-full sm:max-w-xs"
            style={{ animationDelay: "60ms" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400 dark:text-gray-600"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-200
                font-[inherit]
                bg-white dark:bg-[#1a0f0c]
                border border-[#e5e5e5] dark:border-[#3d2820]
                text-gray-800 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                shadow-sm dark:shadow-none
                focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20
                dark:focus:border-[#ff6b6b]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors
                  bg-gray-100 dark:bg-[#3d2820] text-gray-500 dark:text-gray-400
                  hover:bg-gray-200 dark:hover:bg-[#3d2820]"
              >
                ✕
              </button>
            )}
          </div>

          {/* ── Table ── */}
          <div
            className="fade-up ao-scroll overflow-x-auto rounded-2xl transition-colors duration-200
              bg-white dark:bg-[#1a0f0c]
              border border-[#e5e5e5] dark:border-[#3d2820]
              shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_28px_rgba(0,0,0,0.5)]"
            style={{ animationDelay: "120ms" }}
          >
            <table className="w-full min-w-[780px]">
              {/* Head */}
              <thead>
                <tr
                  className="border-b border-[#f0f0f0] dark:border-[#3d2820]
                  bg-[#fafafa] dark:bg-[#1a0f0c]"
                >
                  {[
                    "Order ID",
                    "Customer",
                    "Restaurant",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest
                        text-gray-400 dark:text-gray-600 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">🔍</span>
                        <p className="text-sm font-semibold text-gray-400 dark:text-gray-600">
                          No orders found
                        </p>
                        {search && (
                          <button
                            onClick={() => setSearch("")}
                            className="text-xs font-bold text-[#ff6b6b] hover:underline"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, i) => {
                    const status = order.status || "pending";
                    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

                    return (
                      <tr
                        key={order._id}
                        className="border-t border-[#f5f5f5] dark:border-[#3d2820] transition-colors duration-150
                          hover:bg-[#fff8f8] dark:hover:bg-[#1a0f0c]"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        {/* Order ID */}
                        <td className="px-5 py-4">
                          <span className="text-xs font-bold text-[#ff6b6b] bg-[#fff0ee] dark:bg-[#1a0f0c] px-2.5 py-1 rounded-lg">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
                              bg-[#fff0ee] dark:bg-[#1a0f0c] text-[#ff6b6b]"
                            >
                              {order.user?.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                              {order.user?.name ?? "—"}
                            </span>
                          </div>
                        </td>

                        {/* Restaurant */}
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {order.restaurant?.resName ?? "—"}
                        </td>

                        {/* Items */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            {order.items?.map((item) => (
                              <span
                                key={item._id}
                                className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
                              >
                                {item.name}
                                <span className="ml-1 font-bold text-gray-700 dark:text-gray-300">
                                  × {item.quantity}
                                </span>
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                            ₹{order.pricing?.totalAmount}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize
                            ${cfg.light} ${cfg.dark}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
                            />
                            {status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-xs text-gray-400 dark:text-gray-600 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;

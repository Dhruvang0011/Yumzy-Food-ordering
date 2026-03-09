import { useEffect, useState } from "react";
import api from "../utils/axios";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaList } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a0f0c] border border-[#e5e5e5] dark:border-[#3d2820] rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 mb-1">
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.dataKey}
          className="text-sm font-black"
          style={{ color: p.color }}
        >
          {p.name}: {p.dataKey === "revenue" ? "₹" : ""}
          {p.value}
        </p>
      ))}
    </div>
  );
};

const OwnerDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState({
    todayOrders: 0,
    totalOrders: 0,
    revenueToday: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [todayChart, setTodayChart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const restaurantRes = await api.get("/restaurantOwner/my-restaurant");
      setRestaurant(restaurantRes.data);
      const statsRes = await api.get("/restaurantOwner/stats");
      setStats(statsRes.data);
      setChartData(statsRes.data.last7Days);
      setTodayChart([
        {
          name: "Today",
          orders: statsRes.data.todayOrders,
          revenue: statsRes.data.revenueToday,
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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
              📊
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Loading dashboard…
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ── No restaurant ── */
  if (!restaurant) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');`}</style>
        <div
          className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-[#1a0f0c] px-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-5">🍽️</div>
            <h1
              className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Welcome to Yumzy 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-7 leading-relaxed">
              You haven't created your restaurant yet. Create your restaurant to
              start receiving orders.
            </p>
            <Link
              to="/owner/restaurant"
              className="inline-block px-7 py-3 rounded-xl text-sm font-bold text-white transition-all
                bg-gradient-to-br from-[#ff6b6b] to-[#ff4757]
                shadow-[0_4px_16px_rgba(255,107,107,0.35)]
                hover:shadow-[0_8px_24px_rgba(255,107,107,0.45)] hover:-translate-y-0.5"
            >
              Create Restaurant →
            </Link>
          </div>
        </div>
      </>
    );
  }

  const statCards = [
    {
      icon: <FaShoppingBag />,
      label: "Today's Orders",
      value: stats.todayOrders,
      lightColor: "bg-[#fff0ee] text-[#ff6b6b]",
      darkColor: "dark:bg-[#1a0f0c] dark:text-[#ff8e7a]",
      glow: "rgba(255,107,107,0.22)",
    },
    {
      icon: <FaList />,
      label: "Total Orders",
      value: stats.totalOrders,
      lightColor: "bg-blue-50 text-blue-600",
      darkColor: "dark:bg-[#0a1628] dark:text-blue-400",
      glow: "rgba(59,130,246,0.22)",
    },
    {
      icon: <FaIndianRupeeSign />,
      label: "Revenue Today",
      value: `₹${stats.revenueToday}`,
      lightColor: "bg-green-50 text-green-600",
      darkColor: "dark:bg-[#0d2b12] dark:text-green-400",
      glow: "rgba(34,197,94,0.22)",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        .od-root     { font-family: 'DM Sans', sans-serif; }
        .od-playfair { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }

        .dark .recharts-cartesian-grid line { stroke: #3d2820; }
        .dark .recharts-text { fill: #6b7280 !important; }
      `}</style>

      <div className="od-root min-h-screen transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="mb-8 fade-up">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-1">
              Owner Panel
            </p>
            <h1 className="od-playfair text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 m-0">
              {restaurant.resName}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
              Here's how your restaurant is performing today.
            </p>
          </div>

          {/* ── Pending Approval Banner ── */}
          {!restaurant.isApproved && (
            <div
              className="fade-up flex items-center gap-3 px-4 py-3.5 rounded-xl mb-7 text-sm font-semibold
                border border-yellow-200 dark:border-yellow-900/60
                text-yellow-700 dark:text-yellow-400"
              style={{ animationDelay: "40ms" }}
            >
              <span className="text-lg">⚠️</span>
              Your restaurant is waiting for admin approval.
            </div>
          )}

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-7">
            {statCards.map((card, i) => (
              <div
                key={card.label}
                className="fade-up flex items-center gap-4 p-5 sm:p-6 rounded-2xl transition-all duration-200
                  bg-white dark:bg-[#1a0f0c]
                  border border-[#e5e5e5] dark:border-[#3d2820]
                  shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]
                  hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.55)]
                  hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${card.lightColor} ${card.darkColor}`}
                  style={{ boxShadow: `0 4px 16px ${card.glow}` }}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-600 mb-1">
                    {card.label}
                  </p>
                  <p className="od-playfair text-3xl font-black text-gray-900 dark:text-gray-100">
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Today's Performance */}
            <div
              className="fade-up rounded-2xl p-5 sm:p-6 transition-colors duration-200
                bg-white dark:bg-[#1a0f0c]
                border border-[#e5e5e5] dark:border-[#3d2820]
                shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_28px_rgba(0,0,0,0.5)]"
              style={{ animationDelay: "240ms" }}
            >
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-0.5">
                  Today
                </p>
                <h2 className="od-playfair text-lg font-black text-gray-900 dark:text-gray-100 m-0">
                  Performance
                </h2>
              </div>
              <div className="h-px bg-[#f0f0f0] dark:bg-[#3d2820] mb-5" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={todayChart}
                  margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e5e5" />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11,
                      fontFamily: "'DM Sans', sans-serif",
                      fill: "#9a7060",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fontFamily: "'DM Sans', sans-serif",
                      fill: "#9a7060",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="orders"
                    fill="#ff6b6b"
                    name="Orders"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#22c55e"
                    name="Revenue ₹"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Last 7 Days */}
            <div
              className="fade-up rounded-2xl p-5 sm:p-6 transition-colors duration-200
                bg-white dark:bg-[#1a0f0c]
                border border-[#e5e5e5] dark:border-[#3d2820]
                shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_28px_rgba(0,0,0,0.5)]"
              style={{ animationDelay: "310ms" }}
            >
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-0.5">
                  Analytics
                </p>
                <h2 className="od-playfair text-lg font-black text-gray-900 dark:text-gray-100 m-0">
                  Orders — Last 7 Days
                </h2>
              </div>
              <div className="h-px bg-[#f0f0f0] dark:bg-[#3d2820] mb-5" />
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e5e5" />
                  <XAxis
                    dataKey="day"
                    tick={{
                      fontSize: 11,
                      fontFamily: "'DM Sans', sans-serif",
                      fill: "#9a7060",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fontFamily: "'DM Sans', sans-serif",
                      fill: "#9a7060",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#ff6b6b"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#ff6b6b", strokeWidth: 0 }}
                    activeDot={{
                      r: 6,
                      fill: "#ff4757",
                      stroke: "rgba(255,107,107,0.25)",
                      strokeWidth: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;

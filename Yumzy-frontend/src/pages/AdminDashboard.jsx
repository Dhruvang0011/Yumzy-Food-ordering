import { useEffect, useState } from "react";
import { FaStore, FaClock, FaUsers, FaShoppingCart } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import api from "../utils/axios";

/* ── Custom Recharts Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a0f0c] border border-[#e5e5e5] dark:border-[#3d2820] rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-base font-black text-[#ff6b6b]">
        {payload[0].value} orders
      </p>
    </div>
  );
};

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats", { withCredentials: true });
        setStatsData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ── Loading state ── */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        `}</style>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
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

  const stats = [
    {
      title: "Total Restaurants",
      value: statsData?.totalRestaurants ?? 0,
      icon: <FaStore />,
      lightColor: "bg-blue-50 text-blue-600",
      darkColor: "dark:bg-[#0a1628] dark:text-blue-400",
      glow: "rgba(59,130,246,0.25)",
    },
    {
      title: "Pending Approvals",
      value: statsData?.pendingRestaurants ?? 0,
      icon: <FaClock />,
      lightColor: "bg-yellow-50 text-yellow-600",
      darkColor: "dark:bg-[#1f1500] dark:text-yellow-400",
      glow: "rgba(234,179,8,0.25)",
    },
    {
      title: "Total Users",
      value: statsData?.totalUsers ?? 0,
      icon: <FaUsers />,
      lightColor: "bg-green-50 text-green-600",
      darkColor: "dark:bg-[#0d2b12] dark:text-green-400",
      glow: "rgba(34,197,94,0.25)",
    },
    {
      title: "Total Orders",
      value: statsData?.totalOrders ?? 0,
      icon: <FaShoppingCart />,
      lightColor: "bg-pink-50 text-pink-600",
      darkColor: "dark:bg-[#2b0d10] dark:text-[#ff8e7a]",
      glow: "rgba(255,107,107,0.25)",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        .ad-root { font-family: 'DM Sans', sans-serif; }
        .ad-playfair { font-family: 'Playfair Display', Georgia, serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }

        /* Recharts overrides for dark mode */
        .dark .recharts-cartesian-grid line { stroke: #3d2820; }
        .dark .recharts-text { fill: #6b7280 !important; }
        .dark .recharts-tooltip-cursor { stroke: #3d2820; }
      `}</style>

      <div className="ad-root min-h-screen transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 sm:mb-10 fade-up">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-1">
                Admin Panel
              </p>
              <h1 className="ad-playfair text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 m-0">
                Dashboard
              </h1>
            </div>
            <div
              className="flex items-center gap-2 text-xs font-semibold
              text-gray-400 dark:text-gray-600
              bg-white dark:bg-[#1a0f0c]
              border border-[#e5e5e5] dark:border-[#3d2820]
              px-3 py-2 rounded-full
              shadow-sm dark:shadow-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
              Auto-refreshes every 30s
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
            {stats.map((card, i) => (
              <div
                key={i}
                className={[
                  "fade-up p-5 sm:p-6 rounded-2xl transition-all duration-300",
                  "bg-white dark:bg-[#1a0f0c]",
                  "border border-[#e5e5e5] dark:border-[#3d2820]",
                  "shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]",
                  "hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.55)]",
                  "hover:-translate-y-0.5",
                ].join(" ")}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-600 mb-2">
                      {card.title}
                    </p>
                    <h2 className="ad-playfair text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100">
                      {card.value.toLocaleString()}
                    </h2>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${card.lightColor} ${card.darkColor}`}
                    style={{ boxShadow: `0 4px 16px ${card.glow}` }}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Chart ── */}
          <div
            className="fade-up rounded-2xl p-5 sm:p-7 transition-colors duration-200
              bg-white dark:bg-[#1a0f0c]
              border border-[#e5e5e5] dark:border-[#3d2820]
              shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_28px_rgba(0,0,0,0.5)]"
            style={{ animationDelay: "300ms" }}
          >
            {/* Chart header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-0.5">
                  Analytics
                </p>
                <h2 className="ad-playfair text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100 m-0">
                  Orders Overview
                </h2>
              </div>

              <span
                className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold
                px-3 py-1.5 rounded-full
                bg-[#fff5f5] dark:bg-[#1a0f0c]
                text-[#ff6b6b] dark:text-[#ff8e7a]
                border border-[#ffd5d5] dark:border-[#3d2820]"
              >
                📅 Last 7 Days
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#f0f0f0] dark:bg-[#3d2820] mb-6" />

            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={statsData?.last7Days}
                margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#e5e5e5"
                  className="dark:[stroke:#3d2820]"
                />
                <XAxis
                  dataKey="_id"
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
                  dataKey="count"
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
    </>
  );
};

export default AdminDashboard;

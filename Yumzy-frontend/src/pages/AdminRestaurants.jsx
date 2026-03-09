import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import AdminRestaurantCard from "../components/AdminRestaurantCard";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [blockFilter, setBlockFilter] = useState("all");

  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/admin/restaurants", {
        withCredentials: true,
      });
      setRestaurants(res.data);
      setFilteredRestaurants(res.data);
    } catch {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    let data = [...restaurants];
    if (search)
      data = data.filter((r) =>
        r.resName.toLowerCase().includes(search.toLowerCase()),
      );
    if (statusFilter !== "all")
      data = data.filter((r) =>
        statusFilter === "approved" ? r.isApproved : !r.isApproved,
      );
    if (blockFilter !== "all")
      data = data.filter((r) =>
        blockFilter === "blocked" ? r.isBlocked : !r.isBlocked,
      );
    setFilteredRestaurants(data);
  }, [search, statusFilter, blockFilter, restaurants]);

  const approveRestaurant = async (id) => {
    try {
      await api.patch(
        `/admin/restaurants/approve`,
        { id },
        { withCredentials: true },
      );
      toast.success("Restaurant Approved");
      fetchRestaurants();
    } catch {
      toast.error("Approval failed");
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(
        `/admin/restaurants/`,
        { id },
        { withCredentials: true },
      );
      toast.success("Restaurant Deleted");
      fetchRestaurants();
    } catch {
      toast.error("Delete failed");
    }
  };

  const blockRestaurant = async (id) => {
    try {
      await api.patch(
        `/admin/restaurants/block`,
        { id },
        { withCredentials: true },
      );
      toast.success("Restaurant Blocked");
      fetchRestaurants();
    } catch {
      toast.error("Block failed");
    }
  };

  const unblockRestaurant = async (id) => {
    try {
      await api.patch(
        `/admin/restaurants/unblock`,
        { id },
        { withCredentials: true },
      );
      toast.success("Restaurant Unblocked");
      fetchRestaurants();
    } catch {
      toast.error("Unblock failed");
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
              🍽️
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Loading restaurants…
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ── Select shared classes ── */
  const selectCls = `
    h-11 px-4 rounded-xl text-sm font-semibold outline-none transition-all duration-200 cursor-pointer
    font-[inherit]
    bg-white dark:bg-[#1a0f0c]
    border border-[#e5e5e5] dark:border-[#3d2820]
    text-gray-600 dark:text-gray-300
    focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20
    dark:focus:border-[#ff6b6b]
  `;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        .ar-root     { font-family: 'DM Sans', sans-serif; }
        .ar-playfair { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }

        /* Native select option colors in dark */
        .ar-select option {
          background: #1a0f0c;
          color: #d1d5db;
        }
      `}</style>

      <div className="ar-root min-h-screen transition-colors duration-300">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="mb-7 fade-up">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-1">
              Admin Panel
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <h1 className="ar-playfair text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 m-0">
                Restaurants
              </h1>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-600">
                {filteredRestaurants.length} of {restaurants.length} restaurants
              </span>
            </div>
          </div>

          {/* ── Search + Filters Bar ── */}
          <div
            className="fade-up flex flex-wrap items-center gap-3 p-4 mb-8 rounded-2xl transition-colors duration-200
              bg-white dark:bg-[#1a0f0c]
              border border-[#e5e5e5] dark:border-[#3d2820]
              shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
            style={{ animationDelay: "60ms" }}
          >
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
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
                placeholder="Search restaurants…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-9 rounded-xl text-sm outline-none transition-all duration-200
                  font-[inherit]
                  bg-[#fafafa] dark:bg-[#1e1410]
                  border border-[#e5e5e5] dark:border-[#3d2820]
                  text-gray-800 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-600
                  focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20
                  dark:focus:border-[#ff6b6b]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-[10px] font-bold
                    flex items-center justify-center transition-colors
                    bg-gray-100 dark:bg-[#3d2820] text-gray-500 dark:text-gray-400
                    hover:bg-gray-200 dark:hover:bg-[#4d2a18]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-7 w-px bg-[#e5e5e5] dark:bg-[#3d2820]" />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`ar-select ${selectCls}`}
            >
              <option value="all">All Status</option>
              <option value="approved">✅ Approved</option>
              <option value="pending">⏳ Pending</option>
            </select>

            {/* Block Filter */}
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className={`ar-select ${selectCls}`}
            >
              <option value="all">All Access</option>
              <option value="blocked">🔒 Blocked</option>
              <option value="unblocked">🔓 Unblocked</option>
            </select>

            {/* Active filter chips */}
            {(search || statusFilter !== "all" || blockFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setBlockFilter("all");
                }}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-colors
                  text-[#ff6b6b] bg-[#fff0ee] dark:bg-[#1a0f0c]
                  hover:bg-[#ffddd9] dark:hover:bg-[#3d1510]
                  border border-[#ffd5d5] dark:border-[#3d2820]"
              >
                ✕ Clear all
              </button>
            )}
          </div>

          {/* ── Empty state ── */}
          {filteredRestaurants.length === 0 ? (
            <div className="fade-up flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5
                bg-[#fff0ee] dark:bg-[#1a0f0c]"
              >
                🍽️
              </div>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
                No restaurants found
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-600 mb-5">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setBlockFilter("all");
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all
                  bg-gradient-to-br from-[#ff6b6b] to-[#ff4757]
                  hover:shadow-[0_6px_20px_rgba(255,107,107,0.4)] hover:-translate-y-0.5"
              >
                Show all restaurants
              </button>
            </div>
          ) : (
            /* ── Restaurant Cards Grid ── */
            <div
              className="fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              style={{ animationDelay: "120ms" }}
            >
              {filteredRestaurants.map((r, i) => (
                <div
                  key={r._id}
                  className="fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <AdminRestaurantCard
                    restaurant={r}
                    approveRestaurant={approveRestaurant}
                    blockRestaurant={blockRestaurant}
                    unblockRestaurant={unblockRestaurant}
                    deleteRestaurant={deleteRestaurant}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRestaurants;

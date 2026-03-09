import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

const AdminOwners = () => {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const fetchOwners = async () => {
    try {
      const res = await api.get("/admin/owners", { withCredentials: true });
      setOwners(res.data);
      setFilteredOwners(res.data);
    } catch {
      toast.error("Failed to load owners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    let data = [...owners];
    if (search)
      data = data.filter((o) =>
        o.name.toLowerCase().includes(search.toLowerCase()),
      );
    setFilteredOwners(data);
  }, [search, owners]);

  const createOwner = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/admin/create-owner", formData, {
        withCredentials: true,
      });
      toast.success("Owner created successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });
      fetchOwners();
    } catch {
      toast.error("Failed to create owner");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteOwner = async (id) => {
    if (!window.confirm("Delete this owner?")) return;
    try {
      await api.delete(`/admin/owners/delete`, {
        data: { id },
        withCredentials: true,
      });
      toast.success("Owner deleted");
      fetchOwners();
    } catch {
      toast.error("Delete failed");
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
              👤
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Loading owners…
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ── Shared input classes ── */
  const inputCls = `
    w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
    font-[inherit]
    bg-[#fafafa] dark:bg-[#1a0f0c]
    border border-[#e5e5e5] dark:border-[#3d2820]
    text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-600
    focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20
    dark:focus:border-[#ff6b6b]
  `;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        .ao-root     { font-family: 'DM Sans', sans-serif; }
        .ao-playfair { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      <div className="ao-root min-h-screen transition-colors duration-300">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="mb-8 fade-up">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-1">
              Admin Panel
            </p>
            <h1 className="ao-playfair text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 m-0">
              Restaurant Owners
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage all restaurant owners on the platform. Create new owners
              and monitor their restaurants.
            </p>
          </div>

          {/* ── Create Owner Card ── */}
          <div
            className="fade-up rounded-2xl p-5 sm:p-6 mb-8 transition-colors duration-200
              bg-white dark:bg-[#1a0f0c]
              border border-[#e5e5e5] dark:border-[#3d2820]
              shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
            style={{ animationDelay: "60ms" }}
          >
            {/* Card header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                  boxShadow: "0 4px 14px rgba(255,107,107,0.3)",
                }}
              >
                ➕
              </div>
              <div>
                <h2 className="ao-playfair text-base sm:text-lg font-black text-gray-800 dark:text-gray-100 m-0">
                  Add New Restaurant Owner
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                  Create a new owner account who can manage a restaurant.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#f0f0f0] dark:bg-[#3d2820] mb-5" />

            {/* Form — no <form> tag, using button onClick */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Owner Name"
                required
                className={inputCls}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className={inputCls}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                required
                className={inputCls}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone Number"
                className={inputCls}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address"
                className={inputCls}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <button
                onClick={createOwner}
                disabled={submitting}
                className="h-[46px] rounded-xl text-sm font-bold text-white transition-all duration-200
                  bg-gradient-to-br from-[#ff6b6b] to-[#ff4757]
                  shadow-[0_4px_14px_rgba(255,107,107,0.3)]
                  hover:shadow-[0_6px_20px_rgba(255,107,107,0.4)] hover:-translate-y-0.5
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? "Creating…" : "Create Owner →"}
              </button>
            </div>
          </div>

          {/* ── Owners List Header + Search ── */}
          <div className="fade-up mb-5" style={{ animationDelay: "120ms" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="ao-playfair text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100 m-0">
                  Owners List
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                  {filteredOwners.length} of {owners.length} owners
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
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
                  placeholder="Search owner by name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-9 rounded-xl text-sm outline-none transition-all duration-200
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-[10px] font-bold
                      flex items-center justify-center transition-colors
                      bg-gray-100 dark:bg-[#3d2820] text-gray-500 dark:text-gray-400
                      hover:bg-gray-200 dark:hover:bg-[#3d2820]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Empty State ── */}
          {filteredOwners.length === 0 ? (
            <div className="fade-up flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5
                bg-[#fff0ee] dark:bg-[#1a0f0c]"
              >
                👤
              </div>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
                No owners found
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-600 mb-5">
                Try a different search term
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all
                    bg-gradient-to-br from-[#ff6b6b] to-[#ff4757]
                    hover:shadow-[0_6px_20px_rgba(255,107,107,0.4)] hover:-translate-y-0.5"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            /* ── Owner Cards Grid ── */
            <div
              className="fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
              style={{ animationDelay: "160ms" }}
            >
              {filteredOwners.map((o, i) => (
                <div
                  key={o._id}
                  className="fade-up flex flex-col rounded-2xl p-5 transition-all duration-200
                    bg-white dark:bg-[#1a0f0c]
                    border border-[#e5e5e5] dark:border-[#3d2820]
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                    hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.55)]
                    hover:-translate-y-0.5"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  {/* Owner header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-base font-black flex-shrink-0
                      bg-[#fff0ee] dark:bg-[#1a0f0c] text-[#ff6b6b]"
                    >
                      {o.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate m-0">
                        {o.name}
                      </h2>
                      <p className="text-xs text-gray-400 dark:text-gray-600 truncate mt-0.5">
                        {o.email}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#f0f0f0] dark:bg-[#3d2820] mb-3" />

                  {/* Info */}
                  <div className="flex flex-col gap-1.5 text-sm flex-1">
                    {o.phone && (
                      <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <span className="text-base">📞</span>
                        <span className="text-xs">{o.phone}</span>
                      </p>
                    )}
                    {o.address && (
                      <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <span className="text-base">📍</span>
                        <span className="text-xs truncate">{o.address}</span>
                      </p>
                    )}
                  </div>

                  {/* Restaurant badge */}
                  <div className="mt-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl
                      bg-[#fafafa] dark:bg-[#1a0f0c]
                      border border-[#e5e5e5] dark:border-[#3d2820]
                      text-gray-600 dark:text-gray-300"
                    >
                      🍽️
                      <span className="truncate max-w-[140px]">
                        {o.restaurant
                          ? o.restaurant.resName
                          : "No restaurant yet"}
                      </span>
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteOwner(o._id)}
                    className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-150
                      text-red-500 dark:text-red-400
                      bg-red-50 dark:bg-[#2b0d0d]
                      border border-red-100 dark:border-red-900/50
                      hover:bg-red-100 dark:hover:bg-[#3d1010]
                      hover:shadow-[0_2px_10px_rgba(239,68,68,0.15)]"
                  >
                    🗑️ Delete Owner
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOwners;

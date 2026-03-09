import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

const PERMISSIONS = [
  { icon: "🍽️", label: "Manage Restaurants" },
  { icon: "👤", label: "Manage Owners" },
  { icon: "🧾", label: "Manage Orders" },
  { icon: "👥", label: "Manage Users" },
];

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmin = async () => {
    try {
      const res = await api.get("/users/profile", { withCredentials: true });
      setAdmin(res.data.data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
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
              👤
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Loading profile…
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
        .ap-root     { font-family: 'DM Sans', sans-serif; }
        .ap-playfair { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      <div className="ap-root min-h-screen transition-colors duration-300">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="mb-8 fade-up">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-1">
              Admin Panel
            </p>
            <h1 className="ap-playfair text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 m-0">
              Admin Profile
            </h1>
          </div>

          {/* ── Profile Card ── */}
          <div
            className="fade-up flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 sm:p-6 mb-5 rounded-2xl
              transition-colors duration-200
              bg-white dark:bg-[#1a0f0c]
              border border-[#e5e5e5] dark:border-[#3d2820]
              shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
            style={{ animationDelay: "60ms" }}
          >
            {/* Avatar */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black flex-shrink-0
                bg-[#fff0ee] dark:bg-[#1a0f0c] text-[#ff6b6b]"
              style={{ boxShadow: "0 4px 16px rgba(255,107,107,0.2)" }}
            >
              {admin.name?.[0]?.toUpperCase() ?? "A"}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="ap-playfair text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 m-0">
                {admin.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {admin.email}
              </p>
              <span
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold px-2.5 py-1 rounded-full capitalize
                bg-[#fff0ee] dark:bg-[#1a0f0c]
                text-[#ff6b6b]
                border border-[#ffd5d5] dark:border-[#3d2820]"
              >
                ⚡ {admin.role}
              </span>
            </div>

            {/* Joined badge */}
            <div className="flex-shrink-0 text-center sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">
                Member since
              </p>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {new Date(admin.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* ── Bottom grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Account Information */}
            <div
              className="fade-up rounded-2xl p-5 sm:p-6 transition-colors duration-200
                bg-white dark:bg-[#1a0f0c]
                border border-[#e5e5e5] dark:border-[#3d2820]
                shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
              style={{ animationDelay: "120ms" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0
                  bg-[#fff0ee] dark:bg-[#1a0f0c]"
                >
                  🪪
                </div>
                <h2 className="ap-playfair text-base sm:text-lg font-black text-gray-800 dark:text-gray-100 m-0">
                  Account Information
                </h2>
              </div>

              <div className="h-px bg-[#f0f0f0] dark:bg-[#3d2820] mb-4" />

              <div className="space-y-3">
                {[
                  { label: "Name", value: admin.name },
                  { label: "Email", value: admin.email },
                  ...(admin.phone
                    ? [{ label: "Phone", value: admin.phone }]
                    : []),
                  ...(admin.address
                    ? [{ label: "Address", value: admin.address }]
                    : []),
                  { label: "Role", value: admin.role, capitalize: true },
                ].map(({ label, value, capitalize }) => (
                  <div key={label} className="flex items-start gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600 w-16 flex-shrink-0 pt-0.5">
                      {label}
                    </span>
                    <span
                      className={`text-sm font-semibold text-gray-700 dark:text-gray-300 break-all ${capitalize ? "capitalize" : ""}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Permissions */}
            <div
              className="fade-up rounded-2xl p-5 sm:p-6 transition-colors duration-200
                bg-white dark:bg-[#1a0f0c]
                border border-[#e5e5e5] dark:border-[#3d2820]
                shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
              style={{ animationDelay: "180ms" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0
                  bg-[#fff0ee] dark:bg-[#1a0f0c]"
                >
                  🔑
                </div>
                <h2 className="ap-playfair text-base sm:text-lg font-black text-gray-800 dark:text-gray-100 m-0">
                  Admin Permissions
                </h2>
              </div>

              <div className="h-px bg-[#f0f0f0] dark:bg-[#3d2820] mb-4" />

              <div className="space-y-2.5">
                {PERMISSIONS.map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                      bg-[#fafafa] dark:bg-[#1e1410]
                      border border-[#e5e5e5] dark:border-[#3d2820]"
                  >
                    <span className="text-base">{icon}</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                    <span
                      className="ml-auto flex items-center gap-1 text-[10px] font-bold
                      text-green-600 dark:text-green-400"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />
                      Enabled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;

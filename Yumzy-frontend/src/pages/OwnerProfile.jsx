import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const OwnerProfile = () => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/restaurantOwner/getprofile");
      setUser(res.data.user);
      setRestaurant(res.data.restaurant);
      setForm({
        name: res.data.user.name || "",
        phone: res.data.user.phone || "",
      });
    } catch {
      console.log("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/restaurantOwner/updateOwner", form);
      setUser(res.data);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
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
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-400">
            Loading Profile…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }

        /* Light inputs */
        .op-input {
          width: 100%; background: #fafafa;
          border: 1.5px solid #f0ebe8; border-radius: 14px;
          padding: 12px 16px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #1a1a1a;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none; box-sizing: border-box;
        }
        .op-input:focus {
          border-color: #ff6b6b; background: #fff;
          box-shadow: 0 0 0 4px rgba(255,107,107,0.12);
        }
        .op-input::placeholder { color: #c0b8b5; }
        .op-input:disabled { background: #f5f0ee; color: #a09090; cursor: not-allowed; }

        /* Dark inputs */
        .dark .op-input { background: #1a0f0c; border-color: #3d2820; color: #f3f4f6; }
        .dark .op-input:focus { background: #251810; border-color: #ff6b6b; box-shadow: 0 0 0 4px rgba(255,107,107,0.1); }
        .dark .op-input::placeholder { color: #6b5a54; }
        .dark .op-input:disabled { background: #1a0f0c; color: #6b7280; }
      `}</style>

      <div
        className="min-h-screen transition-colors duration-200"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* ── Page Header ── */}
          <div className="mb-8 fade-up">
            <p
              className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1"
              style={{ color: "#ff6b6b" }}
            >
              Account
            </p>
            <h1
              className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Owner Profile
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
            {/* ── Account Info Card ── */}
            <div
              className="fade-up rounded-2xl p-5 sm:p-7
              bg-white dark:bg-[#1a0f0c]
              border border-[#f5ede9] dark:border-[#3d2820]
              shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
              transition-colors duration-200"
              style={{ animationDelay: "60ms" }}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                  }}
                >
                  👤
                </div>
                <div>
                  <h2
                    className="text-base sm:text-lg font-black text-gray-900 dark:text-gray-100"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Account Information
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-400">
                    Update your personal details
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider mb-1.5 block
                    text-gray-500 dark:text-gray-400"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="op-input"
                      style={{ paddingLeft: "40px" }}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider mb-1.5 block
                    text-gray-500 dark:text-gray-400"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none"
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.06-1.06a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765..."
                      className="op-input"
                      style={{ paddingLeft: "40px" }}
                    />
                  </div>
                </div>

                {/* Email (disabled) */}
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider mb-1.5 block
                    text-gray-500 dark:text-gray-400"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="op-input"
                      style={{ paddingLeft: "44px" }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 ml-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all mt-2
                    disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #ff6b6b, #ff4757)",
                    boxShadow: "0 6px 20px rgba(255,107,107,0.35)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (!saving)
                      e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="3"
                        />
                        <path
                          d="M12 2a10 10 0 0110 10"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Saving…
                    </span>
                  ) : (
                    "Update Profile →"
                  )}
                </button>
              </form>
            </div>

            {/* ── Restaurant Info Card ── */}
            <div
              className="fade-up rounded-2xl p-5 sm:p-7
              bg-white dark:bg-[#1a0f0c]
              border border-[#f5ede9] dark:border-[#3d2820]
              shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
              transition-colors duration-200"
              style={{ animationDelay: "120ms" }}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#f7971e,#ffd200)",
                  }}
                >
                  🏪
                </div>
                <div>
                  <h2
                    className="text-base sm:text-lg font-black text-gray-900 dark:text-gray-100"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Restaurant Information
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-400">
                    Your restaurant details
                  </p>
                </div>
              </div>

              {restaurant ? (
                <>
                  {/* Restaurant image */}
                  {restaurant.img && (
                    <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-5">
                      <img
                        src={restaurant.img}
                        alt={restaurant.resName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/400x160/ffede8/ff6b6b?text=🍽️";
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
                        }}
                      />
                      {restaurant.promoted && (
                        <span
                          className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: "#ffd200", color: "#1a1a1a" }}
                        >
                          ⚡ Promoted
                        </span>
                      )}
                    </div>
                  )}

                  {/* Info rows */}
                  <div className="space-y-3">
                    {[
                      { icon: "🍽️", label: "Name", value: restaurant.resName },
                      {
                        icon: "🥘",
                        label: "Cuisines",
                        value: restaurant.cuisines,
                      },
                      {
                        icon: "🕐",
                        label: "Delivery Time",
                        value: restaurant.time,
                      },
                      {
                        icon: "💰",
                        label: "Cost For Two",
                        value: restaurant.costForTwo,
                      },
                    ].map(({ icon, label, value }) => (
                      <div
                        key={label}
                        className="flex items-start gap-3 p-3 rounded-xl
                          bg-[#fafafa] dark:bg-[#1a0f0c]
                          border border-[#f0ebe8] dark:border-[#3d2820]"
                      >
                        <span className="text-base mt-0.5 flex-shrink-0">
                          {icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400">
                            {label}
                          </p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate mt-0.5">
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Status */}
                    <div
                      className="flex items-center gap-3 p-3 rounded-xl
                      bg-[#fafafa] dark:bg-[#1a0f0c]
                      border border-[#f0ebe8] dark:border-[#3d2820]"
                    >
                      <span className="text-base flex-shrink-0">
                        {restaurant.isApproved ? "✅" : "⏳"}
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400">
                          Status
                        </p>
                        <span
                          className={`text-sm font-bold mt-0.5 block ${
                            restaurant.isApproved
                              ? "text-green-600 dark:text-green-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {restaurant.isApproved
                            ? "Approved"
                            : "Pending Approval"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/owner/restaurant"
                    className="flex items-center justify-center gap-2 w-full mt-5 py-3 rounded-xl text-sm font-bold transition-all
                      border-2 border-[#f0ebe8] dark:border-[#3d2820]
                      text-gray-700 dark:text-gray-300
                      hover:border-[#ff6b6b] hover:text-[#ff6b6b] dark:hover:border-[#ff6b6b] dark:hover:text-[#ff6b6b]"
                  >
                    ✏️ Edit Restaurant
                  </Link>
                </>
              ) : (
                /* No restaurant yet */
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4
                    bg-[#fff0ee] dark:bg-[#1a0f0c]"
                  >
                    🏪
                  </div>
                  <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">
                    No restaurant yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mb-5">
                    Create your restaurant to start receiving orders.
                  </p>
                  <Link
                    to="/owner/restaurant"
                    className="px-6 py-3 rounded-xl text-white text-sm font-bold transition-all"
                    style={{
                      background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                      boxShadow: "0 6px 20px rgba(255,107,107,0.3)",
                    }}
                  >
                    Create Restaurant →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerProfile;

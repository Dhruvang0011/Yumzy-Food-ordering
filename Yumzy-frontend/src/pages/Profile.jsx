import { useState, useEffect } from "react";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/users/profile");
        setFormData({
          name: res?.data?.data?.name || "",
          phone: res?.data?.data?.phone || "",
          address: res?.data?.data?.address || "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put("/users/update", formData);
      toast.success(res?.data?.message || "Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }

        .up-input {
          width: 100%; background: #fafafa;
          border: 1.5px solid #f0ebe8; border-radius: 14px;
          padding: 13px 16px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #1a1a1a;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none; box-sizing: border-box;
        }
        .up-input:focus {
          border-color: #ff6b6b; background: #fff;
          box-shadow: 0 0 0 4px rgba(255,107,107,0.12);
        }
        .up-input::placeholder { color: #c0b8b5; }

        .dark .up-input { background: #1a0f0c; border-color: #3d2820; color: #f3f4f6; }
        .dark .up-input:focus { background: #251810; border-color: #ff6b6b; box-shadow: 0 0 0 4px rgba(255,107,107,0.1); }
        .dark .up-input::placeholder { color: #6b5a54; }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-10 sm:py-14"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="slide-up w-full" style={{ maxWidth: "440px" }}>
          {/* Card */}
          <div
            className="rounded-3xl p-6 sm:p-8
            bg-white dark:bg-[#1a0f0c]
            border border-[#fde8e8] dark:border-[#3d2820]
            shadow-[0_20px_60px_rgba(255,107,107,0.1),0_4px_16px_rgba(0,0,0,0.06)]
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_4px_16px_rgba(255,107,107,0.06)]
            transition-colors duration-200"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 sm:mb-7">
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
                  className="text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Update Profile
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-400">
                  Keep your details up to date
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
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none
                      text-gray-400 dark:text-gray-600"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="up-input"
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
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none
                      text-gray-400 dark:text-gray-600"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.06-1.06a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765..."
                    className="up-input"
                    style={{ paddingLeft: "40px" }}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-wider mb-1.5 block
                  text-gray-500 dark:text-gray-400"
                >
                  Delivery Address
                </label>
                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="absolute left-4 top-4 w-4 h-4 pointer-events-none
                      text-gray-400 dark:text-gray-600"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Flat no, Building, Area, City…"
                    rows={3}
                    className="up-input"
                    style={{
                      paddingLeft: "44px",
                      paddingTop: "13px",
                      resize: "none",
                    }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 dark:bg-[#1a0f0c] my-1" />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide
                  transition-all disabled:opacity-60 disabled:cursor-not-allowed
                  hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #ff6b6b, #ff4757)",
                  boxShadow: "0 6px 20px rgba(255,107,107,0.35)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {loading ? (
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
                    Updating…
                  </span>
                ) : (
                  "Save Changes →"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs mt-5 text-gray-400 dark:text-gray-600">
            Your info is safe with us 🔒
          </p>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;

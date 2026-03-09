import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { setUser } from "../store/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/users/login", formData);
      const user = res.data.user;
      dispatch(setUser({ user, role: user.role }));
      if (user.role === "user") navigate("/user");
      else if (user.role === "restaurantOwner") navigate("/owner");
      else if (user.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
        .slide-up { animation: slideUp 0.55s cubic-bezier(.22,.68,0,1.2) both; }
        .shake    { animation: shake 0.4s ease; }

        .input-field {
          width: 100%; background: #fafafa;
          border: 1.5px solid #f0ebe8; border-radius: 14px;
          padding: 13px 16px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #1a1a1a;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none; box-sizing: border-box;
        }
        .input-field:focus {
          border-color: #ff6b6b; background: #fff;
          box-shadow: 0 0 0 4px rgba(255,107,107,0.12);
        }
        .input-field::placeholder { color: #c0b8b5; }

        /* Dark inputs */
        .dark .input-field { background: #1e1410; border-color: #3d2820; color: #f0ebe8; }
        .dark .input-field:focus { background: #251810; border-color: #ff6b6b; box-shadow: 0 0 0 4px rgba(255,107,107,0.1); }
        .dark .input-field::placeholder { color: #6b5a54; }

        .btn-primary {
          width: 100%; background: linear-gradient(135deg, #ff6b6b, #ff4757);
          color: white; font-weight: 700; font-size: 15px;
          padding: 15px; border-radius: 14px; border: none; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 6px 20px rgba(255,107,107,0.35);
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.3px;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(255,107,107,0.4); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Hide native browser password reveal button */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input[type="password"]::-webkit-contacts-auto-fill-button,
        input[type="password"]::-webkit-credentials-auto-fill-button { display: none !important; }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="slide-up w-full" style={{ maxWidth: "400px" }}>
          {/* Card */}
          <div
            className="rounded-3xl p-6 sm:p-8
            bg-white dark:bg-[#1a0f0c]
            border border-[#fde8e8] dark:border-[#3d2820]
            shadow-[0_20px_60px_rgba(255,107,107,0.12),0_4px_16px_rgba(0,0,0,0.06)]
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_4px_16px_rgba(255,107,107,0.06)]
            transition-colors duration-200"
          >
            <div className="mb-6 sm:mb-7 text-center">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Welcome back 👋
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Sign in to continue ordering
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
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
                    name="email"
                    placeholder="you@example.com"
                    className="input-field"
                    style={{ paddingLeft: "44px" }}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="input-field"
                    style={{ paddingLeft: "44px", paddingRight: "44px" }}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPass ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="w-4 h-4"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="w-4 h-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="shake flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl
                  bg-red-50 dark:bg-red-950/40
                  border border-red-200 dark:border-red-900/60
                  text-red-600 dark:text-red-400"
                >
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
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
                    Signing in…
                  </span>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100 dark:bg-[#3d2820]" />
              <span className="text-xs text-gray-400 dark:text-gray-600 font-medium whitespace-nowrap">
                New to Yumzy?
              </span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-[#3d2820]" />
            </div>

            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all
                border-2 border-gray-100 dark:border-[#3d2820]
                text-gray-700 dark:text-gray-300
                hover:border-[#ff6b6b] hover:text-[#ff6b6b] dark:hover:border-[#ff6b6b] dark:hover:text-[#ff6b6b]"
            >
              Create an account 🚀
            </Link>
          </div>

          <p className="text-center text-xs mt-5 text-gray-400 dark:text-gray-600">
            By continuing, you agree to our{" "}
            <span className="text-[#ff6b6b] cursor-pointer hover:underline">
              Terms
            </span>{" "}
            &{" "}
            <span className="text-[#ff6b6b] cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;

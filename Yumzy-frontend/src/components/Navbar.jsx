import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import api from "../utils/axios";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("yumzy-theme") === "dark",
  );
  const dropdownRef = useRef(null);
  const mobileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("yumzy-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("yumzy-theme", "light");
    }
  }, [dark]);

  const getHomePath = () => {
    if (!isAuthenticated) return "/";
    if (role === "admin") return "/admin/dashboard";
    if (role === "restaurantOwner") return "/owner";
    return "/";
  };

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log("Logout error", err);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpenProfile(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nb = {
    // Black glass in dark mode: near-black with low opacity so the bg shows through
    bg: dark ? "rgba(8, 6, 5, 0.55)" : "rgba(255,255,255,0.92)",

    // Subtle coral-tinted white border in light, thin bright line in dark (glass edge)
    border: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(255,220,210,0.5)",

    // Deep shadow + faint coral glow on scroll in dark
    shadow: scrolled
      ? dark
        ? "0 8px 32px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset, 0 0 0 1px rgba(255,107,107,0.08)"
        : "0 8px 32px rgba(255,107,107,0.12), 0 2px 8px rgba(0,0,0,0.06)"
      : dark
        ? "0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset"
        : "0 4px 20px rgba(0,0,0,0.06)",

    linkColor: dark ? "#e5deda" : "#4b5563",

    // Dropdown: dark glass panel
    dropBg: dark ? "rgba(12, 9, 7, 0.85)" : "#ffffff",
    dropBorder: dark ? "rgba(255,255,255,0.08)" : "#fde8e8",
    dropShadow: dark
      ? "0 20px 60px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset"
      : "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(255,107,107,0.08)",

    divider: dark ? "rgba(255,255,255,0.06)" : "#f5ede9",
    cartBg: dark ? "rgba(255,107,107,0.18)" : "#fff0ee",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@900&display=swap');
        .navbar-root { font-family: 'DM Sans', sans-serif; }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .drop-in { animation: dropIn 0.2s cubic-bezier(.22,.68,0,1.2) both; }

        .nav-link-item {
          position: relative;
          font-size: 15px;
          font-weight: 600;
          transition: color 0.18s;
          text-decoration: none;
          padding-bottom: 2px;
          white-space: nowrap;
        }
        .nav-link-item:hover { color: #ff6b6b !important; }
        .nav-link-item.active { color: #ff6b6b !important; }
        .nav-link-item.active::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 2px; border-radius: 9999px;
          background: #ff6b6b;
        }

        .profile-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #ff6b6b, #ff8e53);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 800; color: white;
          box-shadow: 0 3px 10px rgba(255,107,107,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
          font-family: 'DM Sans', sans-serif; flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .profile-btn { width: 44px; height: 44px; font-size: 16px; }
        }
        .profile-btn:hover { transform: scale(1.08); box-shadow: 0 5px 16px rgba(255,107,107,0.4); }

        .theme-toggle {
          width: 40px; height: 40px; border-radius: 50%;
          border: none; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          transition: transform 0.2s, background 0.25s;
        }
        @media (min-width: 640px) {
          .theme-toggle { width: 44px; height: 44px; font-size: 18px; }
        }
        .theme-toggle:hover { transform: rotate(20deg) scale(1.1); }

        .cart-btn {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; transition: transform 0.15s;
          text-decoration: none;
        }
        @media (min-width: 640px) {
          .cart-btn { width: 44px; height: 44px; border-radius: 14px; font-size: 18px; }
        }
      `}</style>

      <div className="navbar-root sticky top-4 z-50" ref={mobileRef}>
        <div className="max-w-[1260px] mx-auto px-2 sm:px-3">
          <div
            className="flex items-center justify-between rounded-2xl transition-all duration-300"
            style={{
              background: nb.bg,
              backdropFilter: dark ? "blur(32px) saturate(180%)" : "blur(20px)",
              WebkitBackdropFilter: dark
                ? "blur(32px) saturate(180%)"
                : "blur(20px)",
              border: `1.5px solid ${nb.border}`,
              boxShadow: nb.shadow,
              // ↓ Taller padding — shrinks slightly on scroll
              padding: scrolled ? "14px 18px" : "18px 18px",
            }}
          >
            {/* ── Logo ── */}
            <Link to={getHomePath()} className="flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dmabeivkl/image/upload/w_800,fl_lossy,f_auto/v1599564390/main-image/uyhji8rlbiqjmphel3k2.png"
                alt="Yumzy Logo"
                className="object-contain transition-all duration-300"
                style={{
                  // ↓ Bigger logo to fill the taller bar
                  width: scrolled ? "100px" : "120px",
                  filter: dark ? "brightness(0) invert(1)" : "none",
                }}
              />
            </Link>

            {/* ── Center Nav Links ── */}
            <nav className="hidden md:flex items-center gap-8">
              {(!isAuthenticated || role === "user") && (
                <>
                  <NavLink
                    to="/user"
                    className={({ isActive }) =>
                      `nav-link-item${isActive ? " active" : ""}`
                    }
                    style={{ color: nb.linkColor }}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `nav-link-item${isActive ? " active" : ""}`
                    }
                    style={{ color: nb.linkColor }}
                  >
                    Contact Us
                  </NavLink>
                </>
              )}

              {isAuthenticated && role === "restaurantOwner" && (
                <>
                  {[
                    { to: "/owner", label: "Dashboard" },
                    { to: "/owner/restaurant", label: "My Restaurant" },
                    { to: "/owner/orders", label: "Orders" },
                    { to: "/owner/profile", label: "Profile" },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === "/owner"}
                      className={({ isActive }) =>
                        `nav-link-item${isActive ? " active" : ""}`
                      }
                      style={{ color: nb.linkColor }}
                    >
                      {label}
                    </NavLink>
                  ))}
                </>
              )}

              {isAuthenticated && role === "admin" && (
                <>
                  {[
                    { to: "/admin/dashboard", label: "Dashboard" },
                    { to: "/admin/restaurants", label: "Restaurants" },
                    { to: "/admin/owners", label: "Owners" },
                    { to: "/admin/orders", label: "Orders" },
                    { to: "/admin/users", label: "Users" },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        `nav-link-item${isActive ? " active" : ""}`
                      }
                      style={{ color: nb.linkColor }}
                    >
                      {label}
                    </NavLink>
                  ))}
                </>
              )}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Hamburger — mobile only */}
              <button
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl transition-all"
                style={{
                  background: dark ? "rgba(255,107,107,0.12)" : "#fff0ee",
                }}
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <span
                  style={{
                    display: "block",
                    width: 18,
                    height: 2,
                    borderRadius: 9999,
                    background: "#ff6b6b",
                    marginBottom: 4,
                    transition: "transform 0.2s",
                    transform: mobileOpen
                      ? "rotate(45deg) translate(0,6px)"
                      : "none",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: 18,
                    height: 2,
                    borderRadius: 9999,
                    background: "#ff6b6b",
                    transition: "opacity 0.2s",
                    opacity: mobileOpen ? 0 : 1,
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: 18,
                    height: 2,
                    borderRadius: 9999,
                    background: "#ff6b6b",
                    marginTop: 4,
                    transition: "transform 0.2s",
                    transform: mobileOpen
                      ? "rotate(-45deg) translate(0,-6px)"
                      : "none",
                  }}
                />
              </button>
              {/* Cart — user only */}
              {isAuthenticated && role === "user" && (
                <Link
                  to="/cart"
                  className="cart-btn"
                  style={{ background: nb.cartBg }}
                  title="Cart"
                >
                  🛒
                </Link>
              )}

              {/* Dark / Light Toggle */}
              <button
                onClick={() => setDark((d) => !d)}
                className="theme-toggle"
                title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                style={{
                  background: dark
                    ? "linear-gradient(135deg,#2d1f1a,#3d2820)"
                    : "linear-gradient(135deg,#fff7f0,#ffe4d6)",
                  boxShadow: dark
                    ? "0 2px 8px rgba(0,0,0,0.4)"
                    : "0 2px 8px rgba(255,107,107,0.15)",
                }}
              >
                {dark ? "🌙" : "☀️"}
              </button>

              {/* Login — guest */}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="text-sm font-bold px-3 py-2 sm:px-6 sm:py-3 rounded-xl transition-all hidden sm:inline-flex"
                  style={{
                    background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(255,107,107,0.3)",
                  }}
                >
                  Login
                </Link>
              )}

              {/* Profile dropdown */}
              {isAuthenticated && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="profile-btn"
                    onClick={() => setOpenProfile((o) => !o)}
                    title="Account"
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </button>

                  {openProfile && (
                    <div
                      className="drop-in absolute right-0 mt-3 w-52 rounded-2xl py-2 px-2 z-50"
                      style={{
                        background: nb.dropBg,
                        backdropFilter: "blur(32px) saturate(180%)",
                        WebkitBackdropFilter: "blur(32px) saturate(180%)",
                        border: `1.5px solid ${nb.dropBorder}`,
                        boxShadow: nb.dropShadow,
                      }}
                    >
                      {user?.name && (
                        <div
                          className="px-3 pb-2 mb-1"
                          style={{ borderBottom: `1px solid ${nb.divider}` }}
                        >
                          <p
                            className="text-xs font-bold truncate"
                            style={{ color: dark ? "#f5f0ee" : "#1f2937" }}
                          >
                            {user.name}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: dark ? "#9ca3af" : "#6b7280" }}
                          >
                            {user.email}
                          </p>
                        </div>
                      )}

                      {role === "user" && (
                        <>
                          <DropItem
                            dark={dark}
                            onClick={() => {
                              setOpenProfile(false);
                              navigate("/profile");
                            }}
                          >
                            👤 &nbsp;Update Profile
                          </DropItem>
                          <DropItem
                            dark={dark}
                            onClick={() => {
                              setOpenProfile(false);
                              navigate("/orders");
                            }}
                          >
                            📦 &nbsp;My Orders
                          </DropItem>
                        </>
                      )}

                      {role === "restaurantOwner" && (
                        <>
                          <DropItem
                            dark={dark}
                            onClick={() => {
                              setOpenProfile(false);
                              navigate("/owner");
                            }}
                          >
                            🏪 &nbsp;Dashboard
                          </DropItem>
                          <DropItem
                            dark={dark}
                            onClick={() => {
                              setOpenProfile(false);
                              navigate("/owner/orders");
                            }}
                          >
                            📦 &nbsp;Orders
                          </DropItem>
                        </>
                      )}

                      {role === "admin" && (
                        <DropItem
                          dark={dark}
                          onClick={() => {
                            setOpenProfile(false);
                            navigate("/admin/profile");
                          }}
                        >
                          🛡️ &nbsp;Admin Profile
                        </DropItem>
                      )}

                      <div
                        className="mt-1 pt-1"
                        style={{ borderTop: `1px solid ${nb.divider}` }}
                      >
                        <DropItem
                          dark={dark}
                          danger
                          onClick={() => {
                            setOpenProfile(false);
                            handleLogout();
                          }}
                        >
                          🚪 &nbsp;Logout
                        </DropItem>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile Drawer (inside mobileRef so outside-click works) ── */}
        {mobileOpen && (
          <div
            className="md:hidden navbar-root drop-in"
            style={{
              position: "absolute",
              top: scrolled ? "calc(100% - 8px)" : "calc(100% - 8px)",
              left: "0",
              right: "0",
              zIndex: 49,
              borderRadius: "16px",
              padding: "12px 16px",
              background: nb.dropBg,
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              border: `1.5px solid ${nb.dropBorder}`,
              boxShadow: nb.dropShadow,
              marginTop: "8px",
            }}
          >
            {/* User / guest nav */}
            {(!isAuthenticated || role === "user") && (
              <>
                <MobileNavLink
                  to="/user"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  🏠 &nbsp;Home
                </MobileNavLink>
                <MobileNavLink
                  to="/contact"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  📬 &nbsp;Contact Us
                </MobileNavLink>
              </>
            )}

            {/* Owner nav */}
            {isAuthenticated && role === "restaurantOwner" && (
              <>
                <MobileNavLink
                  to="/owner"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  📊 &nbsp;Dashboard
                </MobileNavLink>
                <MobileNavLink
                  to="/owner/restaurant"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  🍽️ &nbsp;My Restaurant
                </MobileNavLink>
                <MobileNavLink
                  to="/owner/orders"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  📦 &nbsp;Orders
                </MobileNavLink>
                <MobileNavLink
                  to="/owner/profile"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  👤 &nbsp;Profile
                </MobileNavLink>
              </>
            )}

            {/* Admin nav */}
            {isAuthenticated && role === "admin" && (
              <>
                <MobileNavLink
                  to="/admin/dashboard"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  📊 &nbsp;Dashboard
                </MobileNavLink>
                <MobileNavLink
                  to="/admin/restaurants"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  🍴 &nbsp;Restaurants
                </MobileNavLink>
                <MobileNavLink
                  to="/admin/owners"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  🏪 &nbsp;Owners
                </MobileNavLink>
                <MobileNavLink
                  to="/admin/orders"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  📦 &nbsp;Orders
                </MobileNavLink>
                <MobileNavLink
                  to="/admin/users"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  👥 &nbsp;Users
                </MobileNavLink>
              </>
            )}

            {/* Divider + logout if authenticated */}
            {isAuthenticated && (
              <div
                style={{
                  borderTop: `1px solid ${nb.divider}`,
                  marginTop: 6,
                  paddingTop: 6,
                }}
              >
                <DropItem
                  dark={dark}
                  danger
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                >
                  🚪 &nbsp;Logout
                </DropItem>
              </div>
            )}

            {/* Login if guest */}
            {!isAuthenticated && (
              <div
                style={{
                  borderTop: `1px solid ${nb.divider}`,
                  marginTop: 6,
                  paddingTop: 6,
                }}
              >
                <MobileNavLink
                  to="/login"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                >
                  🔑 &nbsp;Login
                </MobileNavLink>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const MobileNavLink = ({ to, dark, onClick, children }) => (
  <NavLink
    to={to}
    onClick={onClick}
    style={({ isActive }) => ({
      display: "flex",
      alignItems: "center",
      padding: "9px 12px",
      fontSize: "14px",
      fontWeight: 500,
      borderRadius: 10,
      textDecoration: "none",
      color: isActive ? "#ff6b6b" : dark ? "#d1ccc9" : "#374151",
      background: isActive
        ? dark
          ? "rgba(255,107,107,0.12)"
          : "#fff5f2"
        : "transparent",
      marginBottom: 2,
      transition: "background 0.15s, color 0.15s",
    })}
  >
    {children}
  </NavLink>
);

const DropItem = ({ children, onClick, dark, danger }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      textAlign: "left",
      padding: "9px 12px",
      fontSize: "13px",
      fontWeight: 500,
      color: danger ? "#dc2626" : dark ? "#d1ccc9" : "#374151",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      borderRadius: "10px",
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.15s, color 0.15s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = danger
        ? "#fef2f2"
        : dark
          ? "rgba(255,107,107,0.12)"
          : "#fff5f2";
      if (!danger) e.currentTarget.style.color = "#ff6b6b";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = danger
        ? "#dc2626"
        : dark
          ? "#d1ccc9"
          : "#374151";
    }}
  >
    {children}
  </button>
);

export default Navbar;

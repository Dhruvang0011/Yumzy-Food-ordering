import { useEffect, useState } from "react";
import api from "../utils/axios";
import RestaurantCard from "../components/RestaurantCard";

const CATEGORIES = [
  { label: "All", emoji: "🍽️" },
  { label: "Burgers", emoji: "🍔" },
  { label: "Pizza", emoji: "🍕" },
  { label: "Biryani", emoji: "🍛" },
  { label: "Chinese", emoji: "🥡" },
  { label: "South Indian", emoji: "🫓" },
  { label: "Desserts", emoji: "🍰" },
  { label: "Healthy", emoji: "🥗" },
  { label: "Rolls", emoji: "🌯" },
];

const SkeletonCard = () => (
  <div
    style={{
      background: "var(--card-bg)",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "var(--card-shadow)",
      animation: "pulse 1.5s ease-in-out infinite",
    }}
  >
    <div style={{ height: "176px", background: "var(--skeleton-block)" }} />
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          height: "14px",
          background: "var(--skeleton-block)",
          borderRadius: "999px",
          width: "75%",
        }}
      />
      <div
        style={{
          height: "12px",
          background: "var(--skeleton-block)",
          borderRadius: "999px",
          width: "50%",
        }}
      />
      <div
        style={{
          height: "12px",
          background: "var(--skeleton-block)",
          borderRadius: "999px",
          width: "35%",
        }}
      />
    </div>
  </div>
);

const UserDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Auto-detects dark mode from whatever class your Navbar toggles
  useEffect(() => {
    const check = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.body.classList.contains("dark-mode") ||
          document.body.classList.contains("dark"),
      );
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Error fetching restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter((r) => {
    const matchSearch =
      !searchText ||
      r.resName?.toLowerCase().includes(searchText.toLowerCase()) ||
      r.cuisines?.toLowerCase().includes(searchText.toLowerCase());
    const matchCat =
      activeCategory === "All" ||
      r.cuisines?.toLowerCase().includes(activeCategory.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

        /* ══════════════════════════════════════════
           LIGHT MODE — matches Contact Us light look
           ══════════════════════════════════════════ */
        .dashboard-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          position: relative;

          /* Warm peachy-pink food-pattern background */
          background-size: 220px 220px;

          /* Light tokens — dark text on light bg */
          --text-primary:    #1a0d08;
          --text-secondary:  #5a3a2e;
          --text-muted:      #9a7060;
          --card-bg:         rgba(255, 255, 255, 0.80);
          --card-shadow:     0 4px 20px rgba(160, 60, 20, 0.10);
          --pill-bg:         rgba(255, 255, 255, 0.72);
          --pill-border:     rgba(160, 60, 20, 0.20);
          --pill-text:       #5a3a2e;
          --search-bg:       rgba(255, 255, 255, 0.78);
          --search-border:   rgba(160, 60, 20, 0.22);
          --badge-bg:        rgba(255, 255, 255, 0.72);
          --badge-border:    rgba(160, 60, 20, 0.15);
          --skeleton-block:  rgba(160, 60, 20, 0.08);
          --accent:          #e84545;
          --accent-dark:     #c73030;
          --stats-dot:       #22c55e;
          --overlay:         rgba(253, 218, 200, 0.25);

          color: var(--text-primary);
          transition: background-color 0.3s, color 0.3s;
        }

        /* ══════════════════════════════════════════
           DARK MODE — matches Contact Us dark look
           ══════════════════════════════════════════ */
        .dashboard-root.dark-theme {

          /* Dark tokens — matched to Signup.jsx dark palette */
          --text-primary:    #f3f4f6;
          --text-secondary:  #9ca3af;
          --text-muted:      #6b7280;
          --card-bg:         rgba(26, 15, 12, 0.88);
          --card-shadow:     0 4px 24px rgba(0,0,0,0.50);
          --pill-bg:         rgba(26, 15, 12, 0.72);
          --pill-border:     #3d2820;
          --pill-text:       #9ca3af;
          --search-bg:       rgba(26, 15, 12, 0.78);
          --search-border:   #3d2820;
          --badge-bg:        rgba(26, 15, 12, 0.72);
          --badge-border:    #3d2820;
          --skeleton-block:  rgba(255,255,255,0.06);
          --accent:          #ff6b6b;
          --accent-dark:     #ff4757;
          --stats-dot:       #4ade80;
          --overlay:         rgba(16, 6, 2, 0.52);

          color: var(--text-primary);
        }

        .dashboard-inner {
          position: relative;
          z-index: 1;
        }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .fade-up { animation: fadeUp 0.42s ease both; }

        /* ── Search ── */
        .d-search-input {
          width: 100%;
          background: var(--search-bg);
          border: 1.5px solid var(--search-border);
          border-radius: 14px;
          padding: 13px 16px 13px 44px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.07);
          backdrop-filter: blur(10px);
        }
        .d-search-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(232,69,69,0.12);
        }
        .d-search-input::placeholder { color: var(--text-muted); }

        /* ── Category pills ── */
        .cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          border: 1.5px solid var(--pill-border);
          background: var(--pill-bg);
          color: var(--pill-text);
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
          backdrop-filter: blur(8px);
        }
        .cat-pill:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .cat-pill.active {
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 14px rgba(232,69,69,0.32);
        }

        /* ── Section badge ── */
        .section-badge {
          font-size: 12px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 999px;
          color: var(--text-muted);
          background: var(--badge-bg);
          border: 1px solid var(--badge-border);
          backdrop-filter: blur(8px);
        }

        /* ── Scrollbar hide ── */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }

        /* ── Responsive grid ── */
        .restaurant-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 1024px) {
          .restaurant-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1280px) {
          .restaurant-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 580px) {
          .restaurant-grid  { grid-template-columns: 1fr; }
          .hero-headline    { font-size: 1.9rem !important; }
        }
      `}</style>

      <div className={`dashboard-root${isDark ? " dark-theme" : ""}`}>
        <div className="dashboard-inner">
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "clamp(16px, 4vw, 48px) clamp(14px, 4vw, 48px)",
            }}
          >
            {/* ── Header ── */}
            <div className="fade-up" style={{ marginBottom: "28px" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--accent)",
                  marginBottom: "8px",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                }}
              >
                🔥 Hot deals waiting for you
              </p>
              <h1
                className="hero-headline"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.9rem, 5vw, 3.2rem)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                What are you craving
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), #ff8e53)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  today?
                </span>
              </h1>
            </div>

            {/* ── Search ── */}
            <div
              className="fade-up"
              style={{
                position: "relative",
                maxWidth: "580px",
                marginBottom: "18px",
                animationDelay: "60ms",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "15px",
                  height: "15px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search restaurants or cuisines…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="d-search-input"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "var(--pill-border)",
                    color: "var(--text-secondary)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "10px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* ── Category Pills ── */}
            <div
              className="fade-up no-scrollbar"
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "6px",
                marginBottom: "24px",
                animationDelay: "100ms",
              }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`cat-pill ${activeCategory === cat.label ? "active" : ""}`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* ── Stats row ── */}
            {!loading && restaurants.length > 0 && (
              <div
                className="fade-up"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "16px",
                  animationDelay: "130ms",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "7px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--stats-dot)",
                    }}
                  />
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    <strong style={{ color: "var(--text-primary)" }}>
                      {filtered.length}
                    </strong>{" "}
                    restaurants open
                  </span>
                </div>
                {activeCategory !== "All" && (
                  <button
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchText("");
                    }}
                    style={{
                      fontSize: "12px",
                      color: "var(--accent)",
                      fontWeight: 700,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Clear filters ✕
                  </button>
                )}
                {searchText && (
                  <button
                    onClick={() => setSearchText("")}
                    style={{
                      fontSize: "12px",
                      color: "var(--accent)",
                      fontWeight: 700,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Clear search ✕
                  </button>
                )}
              </div>
            )}

            {/* ── Section Label ── */}
            <div
              className="fade-up"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "18px",
                animationDelay: "150ms",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 900,
                  margin: 0,
                  color: "var(--text-primary)",
                }}
              >
                {activeCategory === "All"
                  ? "All Restaurants"
                  : `${activeCategory} 🍽️`}
              </h2>
              <span className="section-badge">
                {loading ? "Loading…" : `${filtered.length} found`}
              </span>
            </div>

            {/* ── Grid ── */}
            {loading ? (
              <div className="restaurant-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="fade-up"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "80px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "96px",
                    height: "96px",
                    borderRadius: "50%",
                    background: "rgba(232,69,69,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "46px",
                    marginBottom: "20px",
                  }}
                >
                  😔
                </div>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    margin: "0 0 6px",
                    color: "var(--text-primary)",
                  }}
                >
                  No restaurants found
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    margin: "0 0 20px",
                    color: "var(--text-muted)",
                  }}
                >
                  Try a different search or browse all categories
                </p>
                <button
                  onClick={() => {
                    setSearchText("");
                    setActiveCategory("All");
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "14px",
                    padding: "10px 24px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(232,69,69,0.32)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Show all restaurants
                </button>
              </div>
            ) : (
              <div className="restaurant-grid">
                {filtered.map((restaurant, i) => (
                  <div
                    key={restaurant._id}
                    className="fade-up"
                    style={{ animationDelay: `${i * 35}ms` }}
                  >
                    <RestaurantCard restaurant={restaurant} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

import { useEffect, useState, useRef } from "react";
import api from "../utils/axios";
import RestaurantCard from "../components/RestaurantCard";
import { useNavigate } from "react-router-dom";

// ─── Poster slides ────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    tag: "🔥 Limited Time",
    headline: "50% OFF Your First Order",
    sub: "Use code YUMZY50 at checkout. Valid today only!",
    cta: "Order Now",
    bg: "from-[#ff6b6b] to-[#ff8e53]",
    emoji: "🍔",
  },
  {
    id: 2,
    tag: "⚡ New in Town",
    headline: "Fresh Restaurants, Hot Deals",
    sub: "Discover newly joined restaurants in your area.",
    cta: "Explore",
    bg: "from-[#f7971e] to-[#ffd200]",
    emoji: "🌮",
  },
  {
    id: 3,
    tag: "🥗 Eat Healthy",
    headline: "Salads & Bowls Under ₹200",
    sub: "Because eating right shouldn't break the bank.",
    cta: "Browse Healthy",
    bg: "from-[#56ab2f] to-[#a8e063]",
    emoji: "🥗",
  },
];

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

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#1e1410] rounded-2xl overflow-hidden shadow-sm animate-pulse border border-transparent dark:border-[#2d1f18]">
    <div className="h-44 bg-gray-100 dark:bg-[#2d1f18]" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 dark:bg-[#2d1f18] rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 dark:bg-[#2d1f18] rounded-full w-1/2" />
      <div className="h-3 bg-gray-100 dark:bg-[#2d1f18] rounded-full w-1/3 mt-2" />
    </div>
  </div>
);

// ─── Hero Poster Carousel ─────────────────────────────────────────────────────
const HeroPoster = () => {
  const [current, setCurrent] = useState(0);
  const Navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % SLIDES.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${slide.bg} transition-all duration-700 mx-4 md:mx-14 mt-6`}
      style={{ minHeight: 220 }}
    >
      {/* Big bg emoji */}
      <div
        className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] opacity-20 select-none pointer-events-none"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))" }}
      >
        {slide.emoji}
      </div>

      {/* Floating emojis */}
      {["🍟", "✨", "🌶️"].map((e, i) => (
        <span
          key={i}
          className="absolute text-3xl opacity-30 animate-bounce select-none pointer-events-none"
          style={{
            top: `${20 + i * 25}%`,
            right: `${18 + i * 8}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: "2s",
          }}
        >
          {e}
        </span>
      ))}

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10 max-w-lg">
        <span className="inline-block text-white/90 text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
          {slide.tag}
        </span>
        <h2
          className="text-white font-black text-3xl md:text-4xl leading-tight mb-3"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            textShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          {slide.headline}
        </h2>
        <p className="text-white/85 text-sm md:text-base mb-6 leading-relaxed">
          {slide.sub}
        </p>
        <button
          onClick={() => Navigate("/user")}
          className="bg-white text-gray-800 font-bold px-6 py-3 rounded-xl text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {slide.cta} →
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 right-6 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "bg-white w-5 h-2" : "bg-white/50 w-2 h-2"}`}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Main Home Page ───────────────────────────────────────────────────────────
const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const restaurantRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Error fetching restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = restaurants.filter((r) => {
    const matchSearch =
      !searchQuery ||
      r.resName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisines?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      activeCategory === "All" ||
      r.cuisines?.toLowerCase().includes(activeCategory.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    <div
      className="min-h-screen pt-3  transition-colors duration-300 mx-1"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>

      {/* ── Hero Poster ── */}
      <HeroPoster />

      {/* ── Search bar ── */}
      <div className="px-4 md:px-14 mt-6">
        <div className="relative max-w-xl mx-auto">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants or cuisines…"
            className="
              w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl
              bg-white dark:bg-[#1e1410]
              border border-gray-200 dark:border-[#3d2820]
              text-gray-800 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]/30 focus:border-[#ff6b6b]
              transition-colors duration-200
            "
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors text-lg leading-none"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Category Pills ── */}
      <div className="px-4 md:px-14 mt-5 overflow-x-auto pb-1">
        <div className="flex gap-2 w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.label
                  ? "bg-[#ff6b6b] text-white shadow-md shadow-red-200 dark:shadow-red-900/40"
                  : "bg-white dark:bg-[#1e1410] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2d1f18] border border-gray-200 dark:border-[#3d2820]"
              }`}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Restaurants Section ── */}
      <div ref={restaurantRef} className="px-4 md:px-14 mt-8 pb-16">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2
              className="text-2xl font-black text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {activeCategory === "All"
                ? "All Restaurants"
                : `${activeCategory} Places`}
            </h2>
            {!loading && (
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">
                {filtered.length} {filtered.length === 1 ? "place" : "places"}{" "}
                found
              </p>
            )}
          </div>

          {/* Sort button */}
          <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1e1410] rounded-xl px-3 py-2 shadow-sm border border-gray-100 dark:border-[#3d2820]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Sort
          </div>
        </div>

        {/* ── Loading skeletons ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg">
              No restaurants found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try a different search or category
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4 px-5 py-2.5 bg-[#ff6b6b] text-white rounded-xl text-sm font-semibold hover:bg-red-500 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* ── Restaurant Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((res, i) => (
              <div
                key={res._id}
                className="fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <RestaurantCard restaurant={res} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

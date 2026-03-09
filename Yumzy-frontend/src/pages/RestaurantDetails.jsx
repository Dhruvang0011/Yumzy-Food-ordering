import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState({});
  const [filter, setFilter] = useState("all");
  const [openSection, setOpenSection] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resInfo = await api.get(`/restaurants/${id}`);
        setRestaurant(resInfo.data);

        const res = await api.get(`/dishes/${id}`);
        const grouped = res.data.reduce((acc, dish) => {
          if (!acc[dish.sectionName]) acc[dish.sectionName] = [];
          acc[dish.sectionName].push(dish);
          return acc;
        }, {});
        setDishes(grouped);
        // Open first section by default
        if (res.data.length > 0) {
          setOpenSection(Object.keys(grouped)[0]);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, [id]);

  const toggleSection = (section) =>
    setOpenSection((prev) => (prev === section ? null : section));

  const filterDishes = (dishList) =>
    dishList.filter((dish) => {
      if (filter === "all") return true;
      return dish.type === filter;
    });

  const handleAddToCart = async (dish) => {
    setAddingId(dish._id);
    try {
      await api.post("/cart/add", { dishId: dish._id });
      setAddedId(dish._id);
      toast.success(`${dish.name} added to cart!`, { icon: "🛒" });
      setTimeout(() => setAddedId(null), 1800);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add item";
      toast.error(msg, {
        duration: 4000,
        style: {
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: "14px",
        },
      });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        .rd-root { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.45s ease both; }
        .slide-down { animation: slideDown 0.25s ease both; }

        /* Add button */
        .add-btn {
          flex-shrink: 0;
          padding: 7px 18px;
          border-radius: 999px;
          font-size: 13px; font-weight: 700;
          cursor: pointer; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.18s, color 0.18s, transform 0.12s;
          border: 1.5px solid #22c55e; color: #16a34a; background: transparent;
        }
        .add-btn:hover { background: #f0fdf4; transform: scale(1.04); }
        .add-btn.added { background: #22c55e; color: white; border-color: #22c55e; }
        .add-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .dark .add-btn { border-color: #4ade80; color: #4ade80; }
        .dark .add-btn:hover { background: #052e16; }
        .dark .add-btn.added { background: #16a34a; color: white; border-color: #16a34a; }

        /* Chevron */
        .rd-chevron { transition: transform 0.22s ease; font-size: 11px; color: #ff6b6b; }
        .rd-chevron.open { transform: rotate(180deg); }

        /* Section hover */
        .rd-section-hdr { transition: background 0.15s; }
        .rd-section-hdr:hover { background: rgba(255,107,107,0.04); }
        .dark .rd-section-hdr:hover { background: rgba(255,107,107,0.08); }
      `}</style>

      <div className="rd-root min-h-screen transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {/* ── Restaurant Header ── */}
          {restaurant && (
            <div
              className="fade-up flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl
              bg-white dark:bg-[#1a0f0c]
              border border-[#e5e5e5] dark:border-[#3d2820]
              shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.5)]
              transition-colors duration-200"
            >
              {/* Image */}
              <img
                src={restaurant.img}
                alt={restaurant.resName}
                className="w-full sm:w-36 md:w-40 h-48 sm:h-28 md:h-32 object-cover rounded-xl flex-shrink-0"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/160x120/ffede8/ff6b6b?text=🍽️";
                }}
              />

              {/* Info */}
              <div className="flex flex-col justify-center gap-1.5">
                <h1
                  className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 m-0"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {restaurant.resName}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span
                    className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full
                    bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400
                    border border-green-200 dark:border-green-900/50"
                  >
                    ⭐ {restaurant.rating}
                  </span>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full
                    bg-gray-100 dark:bg-[#1a0f0c] text-gray-600 dark:text-gray-400"
                  >
                    🕐 {restaurant.time}
                  </span>
                  {restaurant.promoted && (
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "#ffd200", color: "#1a1a1a" }}
                    >
                      ⚡ Promoted
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">
                  {restaurant.cuisines}
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 m-0">
                  {restaurant.costForTwo} for two
                </p>
              </div>
            </div>
          )}

          {/* ── Filter Buttons ── */}
          <div
            className="flex gap-2 sm:gap-3 mb-5 sm:mb-6 flex-wrap fade-up"
            style={{ animationDelay: "60ms" }}
          >
            {[
              { key: "all", label: "🍽️ All" },
              { key: "veg", label: "🥦 Veg" },
              { key: "non-veg", label: "🍗 Non-Veg" },
            ].map(({ key, label }) => {
              const isActive = filter === key;
              const activeClass =
                key === "all"
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent"
                  : key === "veg"
                    ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60";

              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all
                    ${
                      isActive
                        ? activeClass
                        : "bg-white dark:bg-[#1a0f0c] text-gray-600 dark:text-gray-400 border-[#e5e5e5] dark:border-[#3d2820] hover:border-[#ff6b6b] hover:text-[#ff6b6b]"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Accordion Menu ── */}
          <div className="space-y-3">
            {Object.keys(dishes).map((section, si) => {
              const filteredDishes = filterDishes(dishes[section]);
              if (filteredDishes.length === 0) return null;
              const isOpen = openSection === section;

              return (
                <div
                  key={section}
                  className="fade-up rounded-2xl overflow-hidden
                    bg-white dark:bg-[#1a0f0c]
                    border border-[#e5e5e5] dark:border-[#3d2820]
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)]
                    transition-colors duration-200"
                  style={{ animationDelay: `${si * 60}ms` }}
                >
                  {/* Section header */}
                  <div
                    className="rd-section-hdr flex items-center justify-between px-4 sm:px-5 py-4 cursor-pointer"
                    onClick={() => toggleSection(section)}
                  >
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 m-0">
                        {section}
                      </h2>
                      <span className="text-xs font-medium text-gray-400 dark:text-gray-600">
                        ({filteredDishes.length})
                      </span>
                    </div>
                    <span className={`rd-chevron ${isOpen ? "open" : ""}`}>
                      ▼
                    </span>
                  </div>

                  {/* Dishes */}
                  {isOpen && (
                    <div
                      className="slide-down px-3 sm:px-4 pb-4 flex flex-col gap-3
                      border-t border-[#f0f0f0] dark:border-[#3d2820]"
                    >
                      {filteredDishes.map((dish) => (
                        <div
                          key={dish._id}
                          className="flex items-center sm:items-center gap-3 sm:gap-4 p-3 rounded-xl mt-3
                            bg-[#f9f9f9] dark:bg-[#1a0f0c]
                            border border-[#e5e5e5] dark:border-[#3d2820]
                            transition-colors duration-200"
                        >
                          {/* Image */}
                          <img
                            src={dish.img}
                            alt={dish.name}
                            className="w-16 h-16 sm:w-[72px] sm:h-[72px] object-cover rounded-xl flex-shrink-0"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/72x72/ffede8/ff6b6b?text=🍽️";
                            }}
                          />

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            {/* Veg / Non-veg indicator */}
                            <div className="flex items-center gap-1.5 mb-1">
                              <div
                                className="w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center flex-shrink-0"
                                style={{
                                  borderColor:
                                    dish.type === "veg" ? "#22c55e" : "#ef4444",
                                }}
                              >
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{
                                    background:
                                      dish.type === "veg"
                                        ? "#22c55e"
                                        : "#ef4444",
                                  }}
                                />
                              </div>
                              <span
                                className={`text-xs font-semibold ${
                                  dish.type === "veg"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-500 dark:text-red-400"
                                }`}
                              >
                                {dish.type === "veg" ? "Veg" : "Non-Veg"}
                              </span>
                            </div>

                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate m-0">
                              {dish.name}
                            </p>
                            <p
                              className="text-sm font-semibold mt-0.5 m-0"
                              style={{ color: "#ff6b6b" }}
                            >
                              ₹{dish.price}
                            </p>
                          </div>

                          {/* Add button */}
                          <button
                            className={`add-btn ${addedId === dish._id ? "added" : ""}`}
                            onClick={() => handleAddToCart(dish)}
                            disabled={addingId === dish._id}
                          >
                            {addedId === dish._id
                              ? "✓ Added"
                              : addingId === dish._id
                                ? "…"
                                : "Add +"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {Object.keys(dishes).length > 0 &&
            Object.keys(dishes).every(
              (s) => filterDishes(dishes[s]).length === 0,
            ) && (
              <div className="flex flex-col items-center justify-center py-16 text-center fade-up">
                <div className="text-5xl mb-4">
                  {filter === "veg" ? "🥦" : "🍗"}
                </div>
                <p className="font-bold text-gray-700 dark:text-gray-300">
                  No {filter} dishes found
                </p>
                <button
                  onClick={() => setFilter("all")}
                  className="mt-3 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                  }}
                >
                  Show All
                </button>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default RestaurantDetails;

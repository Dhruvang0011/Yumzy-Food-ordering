import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant, preview = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!preview) navigate(`/restaurant/${restaurant._id}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .res-card { font-family: 'DM Sans', sans-serif; }
        .res-card-img { transition: transform 0.45s cubic-bezier(.25,.8,.25,1); }
        .res-card:hover .res-card-img { transform: scale(1.07); }
        .res-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }

        /* Light hover */
        .res-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(255,107,107,0.14), 0 6px 16px rgba(0,0,0,0.07);
        }
        /* Dark hover — deeper shadow, faint coral glow */
        .dark .res-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.55), 0 6px 20px rgba(255,107,107,0.1);
        }
      `}</style>

      <div
        onClick={handleClick}
        className={`
          res-card w-full rounded-2xl overflow-hidden
          bg-white dark:bg-[#1e1410]
          border border-[#f5ede9] dark:border-[#3d2820]
          shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
          transition-colors duration-200
          ${!preview ? "cursor-pointer" : ""}
        `}
      >
        {/* ── Image ── */}
        <div className="relative overflow-hidden h-36 sm:h-40 md:h-44 lg:h-[176px]">
          <img
            src={
              restaurant.img ||
              "https://placehold.co/400x200/ffede8/ff6b6b?text=Yumzy"
            }
            alt={restaurant.resName || "Restaurant"}
            className="res-card-img w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x200/ffede8/ff6b6b?text=Yumzy";
            }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 58%)",
            }}
          />

          {/* Promoted badge */}
          {restaurant.promoted && (
            <div
              className="absolute top-2.5 left-2.5 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: "#ffd200",
                color: "#1a1a1a",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              ⚡ Promoted
            </div>
          )}

          {/* Rating pill — bottom left */}
          <div
            className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.95)",
              color: "#1a1a1a",
              backdropFilter: "blur(4px)",
            }}
          >
            <span style={{ color: "#22c55e" }}>★</span>
            {restaurant.rating || "4.0"}
          </div>

          {/* Time pill — bottom right */}
          <div
            className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.95)",
              color: "#6b7280",
              backdropFilter: "blur(4px)",
            }}
          >
            🕐 {restaurant.time || "30 mins"}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-3 sm:p-4">
          {/* Name */}
          <h2 className="font-bold text-sm sm:text-base truncate text-gray-900 dark:text-gray-100">
            {restaurant.resName || "Restaurant Name"}
          </h2>

          {/* Cuisines */}
          <p className="text-xs sm:text-sm truncate mt-0.5 text-gray-400 dark:text-gray-500">
            {restaurant.cuisines || "Biryani, North Indian"}
          </p>

          {/* Divider + footer row */}
          <div className="mt-3 pt-3 border-t border-dashed border-[#f0e8e4] dark:border-[#3d2820]">
            <div className="flex items-center justify-between gap-2">
              {/* Cost */}
              <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 truncate">
                {restaurant.costForTwo || "₹300 for two"}
              </span>

              {/* CTA — hidden on very small screens, visible sm+ */}
              {!preview && (
                <span
                  className="hidden xs:inline-flex sm:inline-flex text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0
                    bg-gradient-to-br from-[#fff0ee] to-[#ffe4e1] text-[#ff6b6b]
                    dark:from-[#3d1a15] dark:to-[#2d1210] dark:text-[#ff8e7a]"
                >
                  Order Now →
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantCard;

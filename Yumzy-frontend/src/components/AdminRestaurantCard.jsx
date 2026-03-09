const AdminRestaurantCard = ({
  restaurant,
  approveRestaurant,
  blockRestaurant,
  unblockRestaurant,
  deleteRestaurant,
}) => {
  return (
    <div
      className={[
        "flex flex-col rounded-2xl overflow-hidden transition-all duration-200",
        "bg-white dark:bg-[#1a0f0c]",
        "border border-[#e5e5e5] dark:border-[#3d2820]",
        "shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
        "hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.55)]",
        "hover:-translate-y-0.5",
        restaurant.isBlocked ? "opacity-60" : "",
      ].join(" ")}
    >
      {/* ── Image ── */}
      <div className="relative">
        <img
          src={restaurant.img}
          alt={restaurant.resName}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x160/ffede8/ff6b6b?text=🍽️";
          }}
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Status badges */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span
            className={[
              "px-2 py-1 rounded-full text-[10px] font-bold shadow-sm",
              restaurant.isApproved
                ? "bg-green-500 text-white"
                : "bg-yellow-400 text-[#1a1a1a]",
            ].join(" ")}
          >
            {restaurant.isApproved ? "✓ Approved" : "⏳ Pending"}
          </span>

          {restaurant.isBlocked && (
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-sm">
              🔒 Blocked
            </span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Name + cuisine */}
        <h2
          className="font-black text-base text-gray-900 dark:text-gray-100 truncate m-0"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {restaurant.resName}
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-600 truncate mt-0.5">
          {restaurant.cuisines}
        </p>

        {/* Rating + time row */}
        <div className="flex items-center justify-between mt-2.5">
          <span
            className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
            bg-green-50 dark:bg-[#0d2b12] text-green-700 dark:text-green-400
            border border-green-200 dark:border-green-900/50"
          >
            ⭐ {restaurant.rating}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            🕐 {restaurant.time}
          </span>
          <span className="text-xs font-semibold text-[#ff6b6b]">
            {restaurant.costForTwo}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#f0f0f0] dark:bg-[#3d2820] my-3" />

        {/* Owner info */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0
            bg-[#fff0ee] dark:bg-[#1a0f0c] text-[#ff6b6b]"
          >
            {restaurant.owner?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
              {restaurant.owner?.name ?? "—"}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 truncate">
              {restaurant.owner?.email ?? "—"}
            </p>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex gap-2 mt-4">
          {!restaurant.isApproved && (
            <button
              onClick={() => approveRestaurant(restaurant._id)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150
                text-green-600 dark:text-green-400
                bg-green-50 dark:bg-[#0d2b12]
                border border-green-200 dark:border-green-900/50
                hover:bg-green-100 dark:hover:bg-[#122e17]"
            >
              ✓ Approve
            </button>
          )}

          {restaurant.isBlocked ? (
            <button
              onClick={() => unblockRestaurant(restaurant._id)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150
                text-blue-600 dark:text-blue-400
                bg-blue-50 dark:bg-[#0a1628]
                border border-blue-200 dark:border-blue-900/50
                hover:bg-blue-100 dark:hover:bg-[#0d1f3d]"
            >
              🔓 Unblock
            </button>
          ) : (
            <button
              onClick={() => blockRestaurant(restaurant._id)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150
                text-orange-600 dark:text-orange-400
                bg-orange-50 dark:bg-[#1f1000]
                border border-orange-200 dark:border-orange-900/50
                hover:bg-orange-100 dark:hover:bg-[#2b1500]"
            >
              🔒 Block
            </button>
          )}

          <button
            onClick={() => deleteRestaurant(restaurant._id)}
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150
              text-red-500 dark:text-red-400
              bg-red-50 dark:bg-[#2b0d0d]
              border border-red-100 dark:border-red-900/50
              hover:bg-red-100 dark:hover:bg-[#3d1010]"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRestaurantCard;

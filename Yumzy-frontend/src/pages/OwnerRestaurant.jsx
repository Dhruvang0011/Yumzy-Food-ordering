import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import RestaurantCard from "../components/RestaurantCard";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Store: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Menu: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  ),
  Plus: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className="w-4 h-4"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Edit: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  ),
  Close: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className="w-4 h-4"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Veg: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#22c55e" />
      <circle cx="12" cy="12" r="4" fill="#22c55e" />
    </svg>
  ),
  NonVeg: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#ef4444" />
      <polygon points="12,7 17,17 7,17" fill="#ef4444" />
    </svg>
  ),
  Tag: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-3 h-3"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
};

// ─── Shared input class ───────────────────────────────────────────────────────
const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
  font-[inherit]
  bg-[#fafafa] dark:bg-[#1e1410]
  border border-[#e5e5e5] dark:border-[#3d2820]
  text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-600
  focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20
  dark:focus:border-[#ff6b6b]
`;

// ─── Tab Button ───────────────────────────────────────────────────────────────
const TabBtn = ({ active, onClick, icon: IconComp, label, count }) => (
  <button
    onClick={onClick}
    className={[
      "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-150",
      active
        ? "bg-[#ff6b6b] text-white shadow-md shadow-red-200/50 dark:shadow-red-900/30"
        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#271510]",
    ].join(" ")}
  >
    <IconComp />
    {label}
    {count != null && (
      <span
        className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
          active
            ? "bg-white/25 text-white"
            : "bg-gray-200 dark:bg-[#3d2820] text-gray-500 dark:text-gray-400"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// ─── Empty Menu State ─────────────────────────────────────────────────────────
const EmptyMenu = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mb-4
      bg-[#fff0ee] dark:bg-[#1a0f0c]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff6b6b"
        strokeWidth={1.5}
        className="w-10 h-10"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    </div>
    <p className="text-gray-600 dark:text-gray-300 font-semibold mb-1">
      No dishes yet
    </p>
    <p className="text-gray-400 dark:text-gray-600 text-sm mb-5">
      Start building your menu to attract customers
    </p>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all
        bg-gradient-to-br from-[#ff6b6b] to-[#ff4757]
        shadow-[0_4px_14px_rgba(255,107,107,0.3)]
        hover:shadow-[0_6px_20px_rgba(255,107,107,0.4)] hover:-translate-y-0.5"
    >
      <Icon.Plus /> Add First Dish
    </button>
  </div>
);

// ─── Dish Card ────────────────────────────────────────────────────────────────
const DishCard = ({ item, onEdit, onDelete }) => (
  <div
    className="group flex gap-3 p-3 rounded-xl transition-all duration-200
    bg-white dark:bg-[#1a0f0c]
    border border-[#e5e5e5] dark:border-[#3d2820]
    hover:border-[#ffd5d5] dark:hover:border-[#3d2820]
    hover:shadow-sm dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
  >
    {item.img ? (
      <img
        src={item.img}
        alt={item.name}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100 dark:bg-[#1e1410]"
        onError={(e) => {
          e.target.src = "https://placehold.co/64x64/ffede8/ff6b6b?text=🍽️";
        }}
      />
    ) : (
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0
        bg-[#fff0ee] dark:bg-[#1a0f0c]"
      >
        <span className="text-2xl">🍽️</span>
      </div>
    )}

    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {item.type === "veg" ? <Icon.Veg /> : <Icon.NonVeg />}
          <p className="font-bold text-gray-800 dark:text-gray-100 truncate text-sm">
            {item.name}
          </p>
        </div>
        <p className="text-[#ff6b6b] font-black text-sm flex-shrink-0">
          ₹{item.price}
        </p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div>
          {item.sectionName && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
              bg-[#fff0ee] dark:bg-[#1a0f0c]
              text-[#ff6b6b]
              border border-[#ffd5d5] dark:border-[#3d2820]"
            >
              <Icon.Tag /> {item.sectionName}
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg transition-colors
              text-gray-400 hover:text-blue-500
              hover:bg-blue-50 dark:hover:bg-[#0a1628]"
            title="Edit"
          >
            <Icon.Edit />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="p-1.5 rounded-lg transition-colors
              text-gray-400 hover:text-red-500
              hover:bg-red-50 dark:hover:bg-[#2b0d0d]"
            title="Delete"
          >
            <Icon.Trash />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Dish Modal ───────────────────────────────────────────────────────────────
const modalInputCls = `
  w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200
  font-[inherit]
  bg-[#fafafa] dark:bg-[#1e1410]
  border border-[#e5e5e5] dark:border-[#3d2820]
  text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-600
  focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20
  dark:focus:border-[#ff6b6b]
`;

const DishModal = ({ isOpen, onClose, onSave, editItem }) => {
  const blank = { name: "", price: "", sectionName: "", img: "", type: "veg" };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(editItem ? { ...blank, ...editItem } : blank);
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Dish name is required");
    if (!form.price) return toast.error("Price is required");
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden
        bg-white dark:bg-[#1a0f0c]
        border border-[#e5e5e5] dark:border-[#3d2820]
        shadow-[0_24px_64px_rgba(0,0,0,0.2)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
        style={{ animation: "modalIn 0.28s cubic-bezier(.22,.68,0,1.2) both" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4
          border-b border-[#f0f0f0] dark:border-[#3d2820]"
        >
          <h3
            className="text-base font-black text-gray-800 dark:text-gray-100"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {editItem ? "Edit Dish" : "Add New Dish"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors
              text-gray-400 dark:text-gray-600
              hover:bg-gray-100 dark:hover:bg-[#3d2820]
              hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Icon.Close />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Type toggle */}
          <div>
            <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 block">
              Type
            </label>
            <div className="flex gap-2">
              {["veg", "non-veg"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: v }))}
                  className={[
                    "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-150",
                    form.type === v
                      ? v === "veg"
                        ? "border-green-400 bg-green-50 dark:bg-[#0d2b12] text-green-700 dark:text-green-400"
                        : "border-red-400 bg-red-50 dark:bg-[#2b0d0d] text-red-600 dark:text-red-400"
                      : "border-[#e5e5e5] dark:border-[#3d2820] text-gray-400 dark:text-gray-600 hover:border-gray-300 dark:hover:border-[#4d2a18]",
                  ].join(" ")}
                >
                  {v === "veg" ? <Icon.Veg /> : <Icon.NonVeg />}
                  {v === "veg" ? "Veg" : "Non-Veg"}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
              Dish Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Classic Zinger Burger"
              className={modalInputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Price */}
            <div>
              <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
                Price (₹) *
              </label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="199"
                type="number"
                min="0"
                className={modalInputCls}
              />
            </div>

            {/* Section */}
            <div>
              <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
                Section
              </label>
              <input
                name="sectionName"
                value={form.sectionName}
                onChange={handleChange}
                placeholder="e.g. Burgers"
                className={modalInputCls}
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
              Image URL
            </label>
            <input
              name="img"
              value={form.img}
              onChange={handleChange}
              placeholder="https://..."
              className={modalInputCls}
            />
            {form.img && (
              <img
                src={form.img}
                alt="preview"
                className="mt-2 w-full h-28 object-cover rounded-xl border border-[#e5e5e5] dark:border-[#3d2820]"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                onLoad={(e) => {
                  e.target.style.display = "block";
                }}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-4
          border-t border-[#f0f0f0] dark:border-[#3d2820]
          bg-[#fafafa] dark:bg-[#1e1410]"
        >
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
              border border-[#e5e5e5] dark:border-[#3d2820]
              text-gray-600 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-[#3d2820]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all
              bg-gradient-to-br from-[#ff6b6b] to-[#ff4757]
              shadow-[0_4px_14px_rgba(255,107,107,0.3)]
              hover:shadow-[0_6px_20px_rgba(255,107,107,0.4)]
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : editItem ? "Update Dish" : "Add Dish"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const OwnerRestaurant = () => {
  const [tab, setTab] = useState("restaurant");
  const [form, setForm] = useState({
    resName: "",
    cuisines: "",
    rating: "",
    time: "",
    img: "",
    costForTwo: "",
    promoted: false,
  });
  const [restaurantId, setRestaurantId] = useState(null);
  const [resLoading, setResLoading] = useState(true);
  const [dishes, setDishes] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRestaurant = async () => {
    try {
      const res = await api.get("/restaurantOwner/my-restaurant");
      if (res.data) {
        setForm({
          resName: res.data.resName || "",
          cuisines: res.data.cuisines || "",
          rating: res.data.rating || "",
          time: res.data.time || "",
          img: res.data.img || "",
          costForTwo: res.data.costForTwo || "",
          promoted: res.data.promoted || false,
        });
        setRestaurantId(res.data._id);
      }
    } catch {
      console.log("No restaurant yet");
    } finally {
      setResLoading(false);
    }
  };

  const fetchDishes = async () => {
    if (!restaurantId) return;
    setMenuLoading(true);
    try {
      const res = await api.get(`/dishes/${restaurantId}`);
      setDishes(res.data || []);
    } catch {
      toast.error("Failed to load dishes");
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);
  useEffect(() => {
    if (tab === "menu") fetchDishes();
  }, [tab, restaurantId]);

  const handleResChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleResSubmit = async () => {
    try {
      if (restaurantId) {
        await api.patch(
          "/restaurantOwner/update",
          { id: restaurantId, ...form },
          { withCredentials: true },
        );
        toast.success("Restaurant updated!");
      } else {
        const res = await api.post("/restaurantOwner/create", form);
        setRestaurantId(res.data._id);
        toast.success("Restaurant created!");
      }
      fetchRestaurant();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving restaurant");
    }
  };

  const handleSaveDish = async (itemForm) => {
    try {
      if (itemForm._id) {
        await api.patch("/restaurantOwner/update-dish", {
          id: itemForm._id,
          name: itemForm.name,
          price: itemForm.price,
          sectionName: itemForm.sectionName,
          type: itemForm.type,
          img: itemForm.img,
        });
        toast.success("Dish updated!");
      } else {
        await api.post("/restaurantOwner/add-dish", {
          restaurant: restaurantId,
          name: itemForm.name,
          price: itemForm.price,
          sectionName: itemForm.sectionName,
          type: itemForm.type,
          img: itemForm.img,
        });
        toast.success("Dish added!");
      }
      setModalOpen(false);
      setEditItem(null);
      fetchDishes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving dish");
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm("Delete this dish?")) return;
    try {
      await api.delete("/restaurantOwner/delete-dish", { data: { id } });
      toast.success("Dish deleted");
      setDishes((prev) => prev.filter((d) => d._id !== id));
    } catch {
      toast.error("Failed to delete dish");
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const filtered = dishes.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.sectionName?.toLowerCase().includes(search.toLowerCase()),
  );
  const grouped = filtered.reduce((acc, item) => {
    const sec = item.sectionName || "Other";
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(item);
    return acc;
  }, {});

  const vegCount = dishes.filter((d) => d.type === "veg").length;
  const nonVegCount = dishes.filter((d) => d.type === "non-veg").length;

  /* ── Loading ── */
  if (resLoading) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');`}</style>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-[#ff6b6b] border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-400">
              Loading your restaurant…
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
        .or-root     { font-family: 'DM Sans', sans-serif; }
        .or-playfair { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      <div className="or-root min-h-screen transition-colors duration-300 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="mb-7 fade-up">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-1">
              Owner Panel
            </p>
            <h1 className="or-playfair text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 m-0">
              {restaurantId ? (
                <>
                  <span className="text-[#ff6b6b]">
                    {form.resName || "Your Restaurant"}
                  </span>
                  <span className="text-gray-300 dark:text-[#3d2820] mx-2">
                    ·
                  </span>
                  <span className="text-gray-400 dark:text-gray-600 text-lg font-semibold">
                    Owner Dashboard
                  </span>
                </>
              ) : (
                "Create Your Restaurant"
              )}
            </h1>
            {restaurantId && (
              <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                Manage your restaurant details and menu from one place.
              </p>
            )}
          </div>

          {/* ── Tabs ── */}
          <div
            className="fade-up flex gap-2 mb-8 p-1 w-fit rounded-2xl
              bg-gray-100 dark:bg-[#1a0f0c]
              border border-transparent dark:border-[#3d2820]"
            style={{ animationDelay: "60ms" }}
          >
            <TabBtn
              active={tab === "restaurant"}
              onClick={() => setTab("restaurant")}
              icon={Icon.Store}
              label="Restaurant"
            />
            <TabBtn
              active={tab === "menu"}
              onClick={() => setTab("menu")}
              icon={Icon.Menu}
              label="Menu"
              count={dishes.length || undefined}
            />
          </div>

          {/* ════ RESTAURANT TAB ════ */}
          {tab === "restaurant" && (
            <div
              className="fade-up grid lg:grid-cols-5 gap-6 sm:gap-8"
              style={{ animationDelay: "100ms" }}
            >
              {/* Form card */}
              <div
                className="lg:col-span-3 rounded-2xl p-5 sm:p-6 transition-colors duration-200
                bg-white dark:bg-[#1a0f0c]
                border border-[#e5e5e5] dark:border-[#3d2820]
                shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
              >
                <h2 className="or-playfair text-lg font-black text-gray-800 dark:text-gray-100 mb-5">
                  {restaurantId ? "Update Details" : "Restaurant Details"}
                </h2>
                <div className="h-px bg-[#f0f0f0] dark:bg-[#3d2820] mb-5" />

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Restaurant Name */}
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
                        Restaurant Name
                      </label>
                      <input
                        name="resName"
                        value={form.resName}
                        onChange={handleResChange}
                        placeholder="e.g. The Spice Garden"
                        className={inputCls}
                      />
                    </div>

                    {/* Cuisines */}
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
                        Cuisines
                      </label>
                      <input
                        name="cuisines"
                        value={form.cuisines}
                        onChange={handleResChange}
                        placeholder="Biryani, North Indian, Chinese"
                        className={inputCls}
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
                        Rating
                      </label>
                      <input
                        name="rating"
                        value={form.rating}
                        onChange={handleResChange}
                        placeholder="4.5"
                        className={inputCls}
                      />
                    </div>

                    {/* Delivery Time */}
                    <div>
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
                        Delivery Time
                      </label>
                      <input
                        name="time"
                        value={form.time}
                        onChange={handleResChange}
                        placeholder="25 mins"
                        className={inputCls}
                      />
                    </div>

                    {/* Image URL */}
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
                        Image URL
                      </label>
                      <input
                        name="img"
                        value={form.img}
                        onChange={handleResChange}
                        placeholder="https://..."
                        className={inputCls}
                      />
                    </div>

                    {/* Cost for Two */}
                    <div>
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1 block">
                        Cost for Two
                      </label>
                      <input
                        name="costForTwo"
                        value={form.costForTwo}
                        onChange={handleResChange}
                        placeholder="₹400"
                        className={inputCls}
                      />
                    </div>

                    {/* Promoted toggle */}
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <div
                          onClick={() =>
                            setForm((f) => ({ ...f, promoted: !f.promoted }))
                          }
                          className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200
                            ${form.promoted ? "bg-[#ff6b6b]" : "bg-gray-200 dark:bg-[#3d2820]"}`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
                            ${form.promoted ? "left-6" : "left-1"}`}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Promoted
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleResSubmit}
                    className="w-full py-3.5 rounded-xl font-bold text-white transition-all mt-2
                      bg-gradient-to-br from-[#ff6b6b] to-[#ff4757]
                      shadow-[0_4px_16px_rgba(255,107,107,0.35)]
                      hover:shadow-[0_8px_24px_rgba(255,107,107,0.45)] hover:-translate-y-0.5
                      active:scale-[0.98]"
                  >
                    {restaurantId ? "Save Changes" : "Create Restaurant"}
                  </button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="lg:col-span-2 flex flex-col items-center">
                <div className="sticky top-6 w-full">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-3 text-center">
                    Live Preview
                  </p>
                  <div className="flex justify-center">
                    <RestaurantCard restaurant={form} preview={true} />
                  </div>
                  {!restaurantId && (
                    <div
                      className="mt-4 p-3 rounded-xl text-center
                      bg-yellow-50 dark:bg-[#1f1500]
                      border border-yellow-200 dark:border-yellow-900/60"
                    >
                      <p className="text-yellow-700 dark:text-yellow-400 text-xs font-semibold">
                        💡 Create your restaurant first, then you can add dishes
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════ MENU TAB ════ */}
          {tab === "menu" && (
            <div className="fade-up" style={{ animationDelay: "100ms" }}>
              {!restaurantId ? (
                <div
                  className="rounded-2xl p-8 text-center
                  bg-yellow-50 dark:bg-[#1f1500]
                  border border-yellow-200 dark:border-yellow-900/60"
                >
                  <p className="text-yellow-700 dark:text-yellow-400 font-bold mb-1">
                    No restaurant found
                  </p>
                  <p className="text-yellow-600 dark:text-yellow-500/70 text-sm mb-4">
                    Please create your restaurant first before adding dishes.
                  </p>
                  <button
                    onClick={() => setTab("restaurant")}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all
                      bg-gradient-to-br from-[#ff6b6b] to-[#ff4757]
                      hover:shadow-[0_6px_20px_rgba(255,107,107,0.4)] hover:-translate-y-0.5"
                  >
                    Go to Restaurant →
                  </button>
                </div>
              ) : (
                <>
                  {/* Toolbar */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 relative">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search dishes or sections…"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200
                          font-[inherit]
                          bg-white dark:bg-[#1a0f0c]
                          border border-[#e5e5e5] dark:border-[#3d2820]
                          text-gray-800 dark:text-gray-100
                          placeholder:text-gray-400 dark:placeholder:text-gray-600
                          focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20
                          shadow-sm dark:shadow-none"
                      />
                    </div>
                    <button
                      onClick={openAdd}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white whitespace-nowrap transition-all
                        bg-gradient-to-br from-[#ff6b6b] to-[#ff4757]
                        shadow-[0_4px_14px_rgba(255,107,107,0.3)]
                        hover:shadow-[0_6px_20px_rgba(255,107,107,0.4)] hover:-translate-y-0.5"
                    >
                      <Icon.Plus /> Add Dish
                    </button>
                  </div>

                  {/* Stats */}
                  {dishes.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        {
                          label: "Total Dishes",
                          value: dishes.length,
                          color: "text-gray-800 dark:text-gray-100",
                        },
                        {
                          label: "Veg",
                          value: vegCount,
                          color: "text-green-600 dark:text-green-400",
                        },
                        {
                          label: "Non-Veg",
                          value: nonVegCount,
                          color: "text-red-500 dark:text-red-400",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl p-4 text-center transition-colors duration-200
                            bg-white dark:bg-[#1a0f0c]
                            border border-[#e5e5e5] dark:border-[#3d2820]
                            shadow-sm dark:shadow-none"
                        >
                          <p className={`text-2xl font-black ${stat.color}`}>
                            {stat.value}
                          </p>
                          <p className="text-gray-400 dark:text-gray-600 text-xs mt-0.5">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dish List */}
                  {menuLoading ? (
                    <div className="flex justify-center py-16">
                      <div className="w-8 h-8 rounded-full border-4 border-[#ff6b6b] border-t-transparent animate-spin" />
                    </div>
                  ) : dishes.length === 0 ? (
                    <div
                      className="rounded-2xl transition-colors duration-200
                      bg-white dark:bg-[#1a0f0c]
                      border border-[#e5e5e5] dark:border-[#3d2820]"
                    >
                      <EmptyMenu onAdd={openAdd} />
                    </div>
                  ) : Object.keys(grouped).length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400 dark:text-gray-600">
                        No results for "{search}"
                      </p>
                      <button
                        onClick={() => setSearch("")}
                        className="mt-2 text-xs font-bold text-[#ff6b6b] hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(grouped).map(([section, items]) => (
                        <div key={section}>
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {section}
                            </h3>
                            <span
                              className="text-xs text-gray-400 dark:text-gray-600
                              bg-gray-100 dark:bg-[#1e1410]
                              border border-[#e5e5e5] dark:border-[#3d2820]
                              px-2 py-0.5 rounded-full"
                            >
                              {items.length}
                            </span>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {items.map((item) => (
                              <DishCard
                                key={item._id}
                                item={item}
                                onEdit={openEdit}
                                onDelete={handleDeleteDish}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Dish Modal */}
          <DishModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditItem(null);
            }}
            onSave={handleSaveDish}
            editItem={editItem}
          />
        </div>
      </div>
    </>
  );
};

export default OwnerRestaurant;

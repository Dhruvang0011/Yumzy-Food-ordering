import { useEffect, useState } from "react";
import api from "../utils/axios";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState("");
  const [clearing, setClearing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  useEffect(() => {
    if (!cart?.items?.length) setShowPricing(false);
  }, [cart]);

  const handleUpdate = async (dishId, action) => {
    setUpdatingId(dishId + action);
    try {
      const res = await api.patch("/cart/update", { dishId, action });
      setCart(res.data);
      fetchCart();
    } catch (err) {
      console.error("Update error", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    setClearing(true);
    try {
      await api.delete("/cart/clear");
      fetchCart();
    } catch (err) {
      console.error("Clear error", err);
    } finally {
      setClearing(false);
    }
  };

  const handlePayment = async () => {
    try {
      if (!address.trim()) {
        alert("Please enter delivery address");
        return;
      }
      const orderRes = await api.post("/order/create", { address });
      const dbOrder = orderRes.data.order;
      const razorRes = await api.post("/order/payment/create", {
        orderId: dbOrder._id,
      });
      const razorOrder = razorRes.data.razorpayOrder;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        name: "Yumzy",
        description: "Food Order Payment",
        order_id: razorOrder.id,
        handler: async (response) => {
          await api.post("/order/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: dbOrder._id,
          });
          window.location.href = "/orders";
        },
        modal: {
          ondismiss: async () => {
            try {
              await api.delete(`/order/${dbOrder._id}`);
            } catch (e) {
              console.error(e);
            }
            setShowAddressModal(false);
            window.location.reload();
          },
        },
        theme: { color: "#ff6b6b" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error", err);
    }
  };

  const isEmpty = !cart?.items?.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fade-up  { animation: fadeUp 0.45s ease both; }
        .modal-in { animation: modalIn 0.3s cubic-bezier(.22,.68,0,1.2) both; }

        .qty-btn {
          width: 32px; height: 32px; border-radius: 50%; border: none;
          cursor: pointer; font-size: 18px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.12s, opacity 0.12s; line-height: 1;
        }
        .qty-btn:hover:not(:disabled) { transform: scale(1.12); }
        .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .qty-dec { background: #fff0ee; color: #ff6b6b; }
        .qty-inc { background: linear-gradient(135deg, #ff6b6b, #ff4757); color: white;
          box-shadow: 0 3px 10px rgba(255,107,107,0.3); }

        /* Dark qty dec */
        .dark .qty-dec { background: #3d1a15; color: #ff8e7a; }

        /* Address modal input */
        .cart-input {
          width: 100%; background: #fafafa;
          border: 1.5px solid #f0ebe8; border-radius: 14px;
          padding: 13px 16px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #1a1a1a;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none;
          box-sizing: border-box; resize: none;
        }
        .cart-input:focus { border-color: #ff6b6b; background: #fff; box-shadow: 0 0 0 4px rgba(255,107,107,0.1); }
        .cart-input::placeholder { color: #c0b8b5; }
        .dark .cart-input { background: #1e1410; border-color: #3d2820; color: #f0ebe8; }
        .dark .cart-input:focus { background: #251810; border-color: #ff6b6b; }
        .dark .cart-input::placeholder { color: #6b5a54; }

        .pay-btn {
          width: 100%; padding: 14px 16px;
          background: linear-gradient(135deg, #ff6b6b, #ff4757);
          color: white; font-weight: 700; font-size: 15px;
          border-radius: 14px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 6px 20px rgba(255,107,107,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .pay-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(255,107,107,0.4); }
        .pay-btn:active { transform: translateY(0); }
      `}</style>

      <div
        className="min-h-screen transition-colors duration-200"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="mb-6 sm:mb-8 fade-up">
            <p
              className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1"
              style={{ color: "#ff6b6b" }}
            >
              Your Order
            </p>
            <div className="flex items-center justify-between gap-4">
              <h1
                className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                My Cart{" "}
                {!isEmpty && (
                  <span className="text-base sm:text-lg font-bold text-gray-400 dark:text-gray-600 ml-1">
                    ({cart.items.length}{" "}
                    {cart.items.length === 1 ? "item" : "items"})
                  </span>
                )}
              </h1>
              {!isEmpty && (
                <button
                  onClick={handleClearCart}
                  disabled={clearing}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-colors flex-shrink-0
                    text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100
                    dark:text-red-400 dark:bg-red-950/40 dark:hover:bg-red-950/70"
                >
                  {clearing ? "Clearing…" : "🗑️ Clear Cart"}
                </button>
              )}
            </div>
          </div>

          {/* ── Empty State ── */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center fade-up">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-5xl sm:text-6xl mb-5
                bg-[#fff0ee] dark:bg-[#3d1a15]"
              >
                🛒
              </div>
              <h2
                className="text-lg sm:text-xl font-black text-gray-800 dark:text-gray-200 mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Your cart is empty
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                Looks like you haven't added anything yet!
              </p>
              <a
                href="/user"
                className="px-6 py-3 rounded-xl text-white text-sm font-bold transition-all"
                style={{
                  background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                  boxShadow: "0 6px 20px rgba(255,107,107,0.3)",
                }}
              >
                Browse Restaurants →
              </a>
            </div>
          )}

          {/* ── Cart Layout ── */}
          {!isEmpty && (
            <div className="grid lg:grid-cols-3 gap-5 sm:gap-6 items-start">
              {/* ── Items list ── */}
              <div className="lg:col-span-2 space-y-3">
                {cart.items.map((item, i) => (
                  <div
                    key={item.dish._id}
                    className="fade-up flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl
                      bg-white dark:bg-[#1e1410]
                      border border-[#f5ede9] dark:border-[#3d2820]
                      shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]
                      transition-colors duration-200"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.dish.img}
                        alt={item.dish.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/80x80/ffede8/ff6b6b?text=🍽️";
                        }}
                      />
                      {/* Veg/non-veg dot */}
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#1e1410]"
                        style={{
                          background:
                            item.dish.type === "veg" ? "#22c55e" : "#ef4444",
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">
                        {item.dish.name}
                      </p>
                      <p
                        className="font-bold text-sm mt-0.5"
                        style={{ color: "#ff6b6b" }}
                      >
                        ₹{item.dish.price}
                      </p>
                      <p className="text-xs mt-0.5 text-gray-400 dark:text-gray-600">
                        Subtotal: ₹{item.dish.price * item.quantity}
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <button
                        className="qty-btn qty-dec"
                        onClick={() => handleUpdate(item.dish._id, "dec")}
                        disabled={updatingId === item.dish._id + "dec"}
                      >
                        −
                      </button>
                      <span className="font-black text-gray-800 dark:text-gray-100 w-5 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn qty-inc"
                        onClick={() => handleUpdate(item.dish._id, "inc")}
                        disabled={updatingId === item.dish._id + "inc"}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Order Summary ── */}
              <div
                className="fade-up rounded-2xl p-5 sm:p-6 lg:sticky lg:top-6
                bg-white dark:bg-[#1a0f0c]
                border border-[#fde8e8] dark:border-[#3d2820]
                shadow-[0_8px_32px_rgba(255,107,107,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                transition-colors duration-200"
                style={{ animationDelay: "100ms" }}
              >
                <h2
                  className="font-black text-gray-900 dark:text-gray-100 text-base sm:text-lg mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Order Summary
                </h2>

                {/* Toggle pricing */}
                <button
                  onClick={() => setShowPricing(!showPricing)}
                  className="w-full flex items-center justify-between text-sm font-semibold mb-3 transition-colors
                    text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <span>Price Breakdown</span>
                  <span className="text-lg">{showPricing ? "▲" : "▼"}</span>
                </button>

                {showPricing && cart?.pricing && (
                  <div className="space-y-2 mb-4 text-sm">
                    {[
                      { label: "Subtotal", value: cart.pricing.subtotal },
                      { label: "GST", value: cart.pricing.gst },
                      { label: "Delivery", value: cart.pricing.deliveryCharge },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          {row.label}
                        </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          ₹{row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grand total */}
                <div className="border-t border-dashed border-gray-200 dark:border-[#3d2820] pt-4 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                      Grand Total
                    </span>
                    <span
                      className="text-lg sm:text-xl font-black"
                      style={{ color: "#ff6b6b" }}
                    >
                      ₹{cart?.pricing?.grandTotal || "—"}
                    </span>
                  </div>
                </div>

                {/* Delivery note */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-5
                  bg-green-50 dark:bg-green-950/30"
                >
                  <span className="text-green-500 text-lg">🛵</span>
                  <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                    Estimated delivery: 25–35 mins
                  </p>
                </div>

                <button
                  className="pay-btn"
                  onClick={() => setShowAddressModal(true)}
                >
                  Proceed to Pay →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Address Modal ── */}
        {showAddressModal && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              className="modal-in w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 relative
              bg-white dark:bg-[#1a0f0c]
              border-0 sm:border sm:border-[#fde8e8] dark:sm:border-[#3d2820]"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}
            >
              {/* Close */}
              <button
                onClick={() => setShowAddressModal(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors
                  bg-gray-100 dark:bg-[#3d2820] text-gray-500 dark:text-gray-400
                  hover:bg-gray-200 dark:hover:bg-[#4d3020]"
              >
                ✕
              </button>

              {/* Icon */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-5"
                style={{
                  background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                  boxShadow: "0 6px 20px rgba(255,107,107,0.3)",
                }}
              >
                📍
              </div>

              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Delivery Details
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-5 sm:mb-6">
                Where should we deliver your order?
              </p>

              <div className="mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block text-gray-500 dark:text-gray-400">
                  Delivery Address
                </label>
                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="absolute left-4 top-4 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat no, Building, Area, City…"
                    rows={3}
                    className="cart-input"
                    style={{ paddingLeft: "44px", paddingTop: "14px" }}
                  />
                </div>
              </div>

              {/* Quick tags */}
              <div className="flex gap-2 mt-3 mb-5 sm:mb-6 flex-wrap">
                {[
                  ["🏠", "Home"],
                  ["💼", "Work"],
                  ["📌", "Other"],
                ].map(([icon, tag]) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setAddress((a) => (a ? a : `${tag} — `))}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
                      border-[#f0ebe8] dark:border-[#3d2820]
                      text-gray-600 dark:text-gray-400
                      bg-[#fafafa] dark:bg-[#1e1410]
                      hover:border-[#ff6b6b] hover:text-[#ff6b6b] dark:hover:border-[#ff6b6b] dark:hover:text-[#ff8e7a]"
                  >
                    {icon} {tag}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors border-2
                    border-[#f0ebe8] dark:border-[#3d2820]
                    text-gray-600 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-[#2d1a14]"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="pay-btn"
                  style={{ flex: 1, padding: "12px" }}
                >
                  Confirm & Pay 🎉
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;

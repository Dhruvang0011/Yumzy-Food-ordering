import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }

        /* Light inputs */
        .contact-input {
          width: 100%; background: #fafafa;
          border: 1.5px solid #f0ebe8; border-radius: 14px;
          padding: 13px 16px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #1a1a1a;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none; box-sizing: border-box; resize: none;
        }
        .contact-input:focus {
          border-color: #ff6b6b; background: #fff;
          box-shadow: 0 0 0 4px rgba(255,107,107,0.1);
        }
        .contact-input::placeholder { color: #c0b8b5; }

        /* Dark inputs */
        .dark .contact-input { background: #1e1410; border-color: #3d2820; color: #f0ebe8; }
        .dark .contact-input:focus { background: #251810; border-color: #ff6b6b; box-shadow: 0 0 0 4px rgba(255,107,107,0.1); }
        .dark .contact-input::placeholder { color: #6b5a54; }

        /* Info cards */
        .info-card {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 16px; border-radius: 16px;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .info-card:hover { transform: translateY(-2px); }
      `}</style>

      <div
        className="min-h-screen bg-transparent transition-colors duration-200"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* ── Header ── */}
          <div className="text-center mb-10 sm:mb-12 fade-up">
            <span
              className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full
              bg-[#fff0ee] dark:bg-[#3d1a15] text-[#ff6b6b]"
            >
              Get In Touch
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              We'd love to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                hear from you
              </span>
            </h1>
            <p className="text-gray-400 dark:text-gray-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Whether you have feedback, a partnership idea, or just want to say
              hello — our team is happy to chat!
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 items-start">
            {/* ── Left: Info ── */}
            <div
              className="lg:col-span-2 space-y-4 fade-up"
              style={{ animationDelay: "80ms" }}
            >
              {/* Brand card */}
              <div
                className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
                }}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 bg-white" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10 bg-white" />
                <div className="text-3xl sm:text-4xl mb-3 relative">🍽️</div>
                <h2
                  className="text-lg sm:text-xl font-black mb-2 relative"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  About Yumzy
                </h2>
                <p className="text-white/80 text-sm leading-relaxed relative">
                  We connect food lovers with the best restaurants around them.
                  From quick bites to fine dining — we've got every craving
                  covered.
                </p>
              </div>

              {/* Contact info cards */}
              {[
                {
                  icon: "📧",
                  label: "Email Us",
                  value: "yumzy@foodapp.com",
                  sub: "We reply within 24 hours",
                },
                {
                  icon: "📞",
                  label: "Call Us",
                  value: "+91 98765 43210",
                  sub: "Mon–Sat, 9am to 6pm",
                },
                {
                  icon: "📍",
                  label: "Office",
                  value: "Mumbai, India",
                  sub: "Headquarters",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="info-card
                    bg-white dark:bg-[#1e1410]
                    border border-[#f5ede9] dark:border-[#3d2820]
                    shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]
                    hover:shadow-[0_8px_24px_rgba(255,107,107,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                >
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0
                    bg-[#fff0ee] dark:bg-[#3d1a15]"
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5 text-gray-400 dark:text-gray-500">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {item.value}
                    </p>
                    <p className="text-xs mt-0.5 text-gray-400 dark:text-gray-600">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right: Form ── */}
            <div
              className="lg:col-span-3 rounded-3xl p-6 sm:p-8 fade-up
              bg-white dark:bg-[#1a0f0c]
              border border-[#fde8e8] dark:border-[#3d2820]
              shadow-[0_20px_60px_rgba(255,107,107,0.1),0_4px_16px_rgba(0,0,0,0.05)]
              dark:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_4px_16px_rgba(255,107,107,0.05)]
              transition-colors duration-200"
              style={{ animationDelay: "140ms" }}
            >
              <h3
                className="text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100 mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Send a Message ✉️
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-5 sm:mb-6">
                Fill out the form and we'll get back to you shortly.
              </p>

              {/* Success toast */}
              {sent && (
                <div
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl mb-5
                  bg-green-50 dark:bg-green-950/40
                  text-green-700 dark:text-green-400
                  border border-green-200 dark:border-green-900/50"
                >
                  ✅ Message sent! We'll be in touch soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name + Email grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block text-gray-500 dark:text-gray-400">
                      Your Name
                    </label>
                    <div className="relative">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none"
                      >
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ayush"
                        className="contact-input"
                        style={{ paddingLeft: "40px" }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block text-gray-500 dark:text-gray-400">
                      Email Address
                    </label>
                    <div className="relative">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="contact-input"
                        style={{ paddingLeft: "40px" }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block text-gray-500 dark:text-gray-400">
                    Your Message
                  </label>
                  <div className="relative">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="absolute left-3.5 top-4 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help…"
                      rows={5}
                      className="contact-input"
                      style={{ paddingLeft: "40px", paddingTop: "14px" }}
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 rounded-xl text-white font-bold text-sm tracking-wide transition-all
                    hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #ff6b6b, #ff4757)",
                    boxShadow: "0 6px 20px rgba(255,107,107,0.35)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

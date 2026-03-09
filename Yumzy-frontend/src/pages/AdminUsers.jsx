import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", { withCredentials: true });
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let data = [...users];
    if (search)
      data = data.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()),
      );
    setFilteredUsers(data);
  }, [search, users]);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`, { withCredentials: true });
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');`}</style>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
              style={{
                background: "linear-gradient(135deg,#ff6b6b,#ff4757)",
                boxShadow: "0 6px 20px rgba(255,107,107,0.35)",
                animation: "pulse 1.4s ease-in-out infinite",
              }}
            >
              👥
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Loading users…
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
        .au-root     { font-family: 'DM Sans', sans-serif; }
        .au-playfair { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }

        .au-scroll::-webkit-scrollbar { height: 5px; }
        .au-scroll::-webkit-scrollbar-track { background: transparent; }
        .au-scroll::-webkit-scrollbar-thumb { background: #3d2820; border-radius: 999px; }
      `}</style>

      <div className="au-root min-h-screen transition-colors duration-300 ">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* ── Header ── */}
          <div className="mb-7 fade-up">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b6b] mb-1">
              Admin Panel
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <h1 className="au-playfair text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 m-0">
                Users
              </h1>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-600">
                {filteredUsers.length} of {users.length} users
              </span>
            </div>
          </div>

          {/* ── Search ── */}
          <div
            className="fade-up relative mb-7 w-full sm:max-w-xs"
            style={{ animationDelay: "60ms" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400 dark:text-gray-600"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl outline-none transition-all duration-200
                font-[inherit]
                bg-white dark:bg-[#1a0f0c]
                border border-[#e5e5e5] dark:border-[#3d2820]
                text-gray-800 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                shadow-sm dark:shadow-none
                focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20
                dark:focus:border-[#ff6b6b]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-[10px] font-bold
                  flex items-center justify-center transition-colors
                  bg-gray-100 dark:bg-[#3d2820] text-gray-500 dark:text-gray-400
                  hover:bg-gray-200 dark:hover:bg-[#4d2a18]"
              >
                ✕
              </button>
            )}
          </div>

          {/* ── Table ── */}
          <div
            className="fade-up au-scroll overflow-x-auto rounded-2xl transition-colors duration-200
              bg-white dark:bg-[#1a0f0c]
              border border-[#e5e5e5] dark:border-[#3d2820]
              shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_28px_rgba(0,0,0,0.5)]"
            style={{ animationDelay: "120ms" }}
          >
            <table className="w-full min-w-[680px]">
              {/* Head */}
              <thead>
                <tr
                  className="border-b border-[#f0f0f0] dark:border-[#3d2820]
                  bg-[#fafafa] dark:bg-[#1e1410]"
                >
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Address",
                    "Joined",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest
                        text-gray-400 dark:text-gray-600 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">🔍</span>
                        <p className="text-sm font-semibold text-gray-400 dark:text-gray-600">
                          No users found
                        </p>
                        {search && (
                          <button
                            onClick={() => setSearch("")}
                            className="text-xs font-bold text-[#ff6b6b] hover:underline"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, i) => (
                    <tr
                      key={user._id}
                      className="border-t border-[#f5f5f5] dark:border-[#3d2820] transition-colors duration-150
                        hover:bg-[#fff8f8] dark:hover:bg-[#271510]"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
                            bg-[#fff0ee] dark:bg-[#1a0f0c] text-[#ff6b6b]"
                          >
                            {user.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {user.phone || (
                          <span className="text-gray-300 dark:text-gray-700">
                            —
                          </span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-[180px]">
                        <span className="truncate block">
                          {user.address || (
                            <span className="text-gray-300 dark:text-gray-700">
                              —
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-xs text-gray-400 dark:text-gray-600 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => deleteUser(user._id)}
                          disabled={deletingId === user._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150
                            text-red-500 dark:text-red-400
                            bg-red-50 dark:bg-[#2b0d0d]
                            border border-red-100 dark:border-red-900/50
                            hover:bg-red-100 dark:hover:bg-[#3d1010]
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === user._id ? "…" : "🗑️ Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;

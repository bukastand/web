"use client";

import { useEffect, useState, useCallback } from "react";

interface UserWithProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);
  const [confirmNewRole, setConfirmNewRole] = useState<"admin" | "user" | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/users");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal memuat data user");
        return;
      }

      setUsers(data.users || []);
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengubah role");
        return;
      }

      setMessage(
        newRole === "admin"
          ? "User berhasil dijadikan admin!"
          : "Admin berhasil diturunkan menjadi user."
      );
      loadUsers();
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setConfirmUserId(null);
      setConfirmNewRole(null);
    }
  };

  const requestConfirm = (userId: string, newRole: "admin" | "user") => {
    setConfirmUserId(userId);
    setConfirmNewRole(newRole);
  };

  const cancelConfirm = () => {
    setConfirmUserId(null);
    setConfirmNewRole(null);
  };

  if (loading) {
    return (
      <div className="text-gray-400 text-center py-12">Memuat data user...</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Manajemen User
          </h1>
          <p className="text-gray-400">
            Kelola pengguna dan hak akses (admin / user)
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {message}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmUserId && confirmNewRole && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-2">Konfirmasi</h3>
            <p className="text-gray-300 text-sm mb-6">
              {confirmNewRole === "admin"
                ? "Yakin ingin menjadikan user ini sebagai admin? User akan memiliki akses penuh ke dashboard admin."
                : "Yakin ingin menurunkan admin ini menjadi user biasa? User akan kehilangan akses ke dashboard admin."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleRoleChange(confirmUserId, confirmNewRole)
                }
                className="flex-1 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors"
              >
                Ya, Lanjutkan
              </button>
              <button
                onClick={cancelConfirm}
                className="flex-1 py-3 bg-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-400">
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Nama</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Terdaftar</th>
                <th className="text-right p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 text-white hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#22c55e]">
                          {(user.email?.charAt(0) || "?").toUpperCase()}
                        </span>
                      </div>
                      <span className="truncate max-w-[200px]">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">
                    {user.full_name || "—"}
                  </td>
                  <td className="p-4">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#22c55e]/15 text-[#22c55e] text-xs font-medium border border-[#22c55e]/25">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-medium border border-white/10">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        User
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400 text-xs">
                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-right">
                    {user.role === "admin" ? (
                      <button
                        onClick={() => requestConfirm(user.id, "user")}
                        disabled={user.email === "admin@pagodastudio.com"}
                        title={
                          user.email === "admin@pagodastudio.com"
                            ? "Tidak bisa menurunkan admin utama"
                            : "Turunkan menjadi user"
                        }
                        className="px-3 py-1.5 text-xs bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Turunkan
                      </button>
                    ) : (
                      <button
                        onClick={() => requestConfirm(user.id, "admin")}
                        className="px-3 py-1.5 text-xs bg-[#22c55e]/10 text-[#22c55e] rounded-lg hover:bg-[#22c55e]/20 transition-colors"
                      >
                        Jadikan Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-500"
                  >
                    Belum ada user
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{users.length}</p>
          <p className="text-xs text-gray-500">Total User</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-2xl font-bold text-[#22c55e]">
            {users.filter((u) => u.role === "admin").length}
          </p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-300">
            {users.filter((u) => u.role === "user").length}
          </p>
          <p className="text-xs text-gray-500">User Biasa</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-400">
            {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </p>
          <p className="text-xs text-gray-500">Hari Ini</p>
        </div>
      </div>
    </div>
  );
}

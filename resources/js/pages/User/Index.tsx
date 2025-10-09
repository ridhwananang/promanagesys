import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  created_at: string;
};

type Props = {
  users: User[];
  roles: string[];
};

export default function Index({ users, roles }: Props) {
  const { auth } = (usePage().props as unknown) as {
    auth: { user: { id: number; name: string; role: string } };
  };

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((user) => roleFilter === "all" || user.role === roleFilter);

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const roleLabels: Record<string, string> = {
    project_manager: "Project Manager",
    backend: "Backend",
    frontend: "Frontend",
    fullstack: "Fullstack",
    uiux: "UI/UX Designer",
    marketing: "Marketing",
  };

  const roleColors: Record<string, string> = {
    project_manager: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    backend: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    frontend: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    fullstack: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    uiux: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
    marketing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  };

  const openDeleteModal = (id: number) => {
    setDeleteTargetId(id);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setModalOpen(false);
    setDeleting(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    setDeleting(true);

    router.delete(route("users.destroy", deleteTargetId), {
      onFinish: () => closeDeleteModal(),
      onError: () => setDeleting(false),
    });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Developers
          </h1>

          {auth.user.role === "project_manager" && (
            <Link href={route("users.create")}>
              <Button className="px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition">
                + Add User
              </Button>
            </Link>
          )}
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 w-full sm:w-1/2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role] || role}
              </option>
            ))}
          </select>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Edit & Delete visible only for project_manager */}
              {auth.user.role === "project_manager" && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <Link
                    href={route("users.edit", user.id)}
                    className="p-1.5 rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/40 transition"
                    aria-label={`Edit ${user.name}`}
                  >
                    <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => openDeleteModal(user.id)}
                    className="p-1.5 rounded-full hover:bg-red-100/50 dark:hover:bg-red-900/40 transition"
                    aria-label={`Hapus ${user.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              )}

              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={`/storage/${user.avatar}`}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mb-3 object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-20 h-20 rounded-full mb-3 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xl font-bold border-2 border-gray-200 dark:border-gray-600">
                  {user.name.charAt(0)}
                </div>
              )}

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>

              <span
                className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                  roleColors[user.role] ||
                  "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {roleLabels[user.role] || user.role}
              </span>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Created at: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        <DeleteModal
          isOpen={modalOpen}
          title="Hapus User"
          message="Yakin mau menghapus user ini? Data ini akan hilang permanen."
          confirmLabel="Ya, hapus"
          cancelLabel="Batal"
          loading={deleting}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppLayout>
  );
}

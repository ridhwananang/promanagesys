import React, { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import AddMember from "./Member/AddMember";
import { toast } from "react-hot-toast";
import { Calendar, Users, ListTodo, ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";

type Project = {
  id: number;
  name: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  sprints?: {
    id: number;
    name: string;
    description?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    tasks: { id: number; title: string }[];
  }[];
  project_members?: { user: { name: string; email: string; avatar?: string }; role_in_project?: string }[];
  created_by?: { name: string };
};


type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  created_at: string;
};

type Props = {
  project: Project;
  users: User[];
};

// Helper format tanggal
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function Show({ project, users }: Props) {
  const { data, setData, patch, processing } = useForm({
    status: project.status,
  });

  // ✅ Pastikan status selalu sinkron walaupun diubah bolak-balik
  useEffect(() => {
    setData("status", project.status);
  }, [project.status]);

  const statusOptions = [
    { value: "planning", label: "Planning", color: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
    { value: "in_progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
    { value: "completed", label: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { value: "on_hold", label: "On Hold", color: "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-300" },
  ];

const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newStatus = e.target.value;
  setData("status", newStatus);

  router.put(
    route("projects.update", project.id),
    { status: newStatus },
    {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => toast.success("Status project berhasil diperbarui!"),
      onError: () => toast.error("Gagal memperbarui status."),
    }
  );
};

  const currentStatus = statusOptions.find((s) => s.value === data.status);

  return (
    <AppLayout>
      <Head title={`Project: ${project.name}`} />

      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            {project.name}
          </h1>
          <Link
            href={route("projects.index")}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>

        {/* Project Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6 transition-all">
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            {project.description || "No description provided."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Dropdown */}
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Status:</span>
              <select
                value={data.status}
                onChange={handleStatusChange}
                disabled={processing}
                className={`px-3 py-1 text-xs rounded-full font-medium cursor-pointer transition-colors ${currentStatus?.color}`}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Calendar size={16} className="text-blue-500" />
              <span className="font-semibold">Start:</span>
              <span>{formatDate(project.start_date)}</span>
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Calendar size={16} className="text-purple-500" />
              <span className="font-semibold">End:</span>
              <span>{formatDate(project.end_date)}</span>
            </div>

            {/* Creator Info */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Users size={16} className="text-green-500" />
            <span className="font-semibold">Created By:</span>
            <span>{project.created_by?.name ?? "Unknown"}</span>
          </div>

          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 transition-all">
          <div className="flex items-center gap-2">
            <Users className="text-blue-500" size={20} />
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Members</h2>
          </div>

          {project.project_members && project.project_members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.project_members.map((pm, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-sm flex flex-col items-center text-center hover:shadow-md transition"
                >
                  {pm.user.avatar ? (
                    <img
                      src={`/storage/${pm.user.avatar}`}
                      alt={pm.user.name}
                      className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full mb-2 flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-lg font-bold border-2 border-gray-200 dark:border-gray-600">
                      {pm.user.name.charAt(0)}
                    </div>
                  )}

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{pm.user.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{pm.user.email}</p>

                  {/* Role Badge */}
                  <span
                    className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                      pm.role_in_project === "project_manager"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        : pm.role_in_project === "backend"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : pm.role_in_project === "frontend"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                        : pm.role_in_project === "fullstack"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                        : pm.role_in_project === "uiux"
                        ? "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300"
                        : pm.role_in_project === "sales_marketing"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {pm.role_in_project}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No members yet.</p>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <AddMember projectId={project.id} users={users} />
          </div>
        </div>

        {/* Sprints Section */}
{/* Sprints Section */}
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 transition-all">
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-2">
      <ListTodo className="text-purple-500" size={20} />
      <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
        Sprints
      </h2>
    </div>
    <Link
      href={route("projects.sprints.create", project.id)}
      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
    >
      + Add Sprint
    </Link>
  </div>

  {project.sprints && project.sprints.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {project.sprints.map((sprint) => {
        const formatDate = (dateStr?: string) => {
          if (!dateStr) return "—";
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        };

        return (
          <div
            key={sprint.id}
            className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {sprint.name}
              </h3>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  sprint.status === "completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                    : sprint.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {(sprint.status ?? "unknown").replace("_", " ")}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
              {sprint.description || "No description provided."}
            </p>

            {/* Dates */}
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                <strong>Start:</strong> {formatDate(sprint.start_date)} •{" "}
                <strong>End:</strong> {formatDate(sprint.end_date)}
              </span>
            </div>

            {/* Tasks */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto border border-gray-100 dark:border-gray-600">
              {sprint.tasks && sprint.tasks.length > 0 ? (
                <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {sprint.tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No tasks yet.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <Link
                href={route("projects.sprints.edit", [project.id, sprint.id])}
                className="text-sm px-3 py-1.5 rounded-md border border-indigo-500 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition"
              >
                Edit
              </Link>
              <Link
                href={route("projects.sprints.show", [project.id, sprint.id])}
                className="text-sm px-3 py-1.5 rounded-md border border-gray-400 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                View
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No sprints yet. Start by creating one 👇</p>
      <Link
        href={route("projects.sprints.create", project.id)}
        className="mt-4 inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
      >
        + Create Sprint
      </Link>
    </div>
  )}
</div>


      </div>
    </AppLayout>
  );
}

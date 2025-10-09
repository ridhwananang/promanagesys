import React from "react";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ListTodo, ArrowLeft } from "lucide-react";

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
}

interface Sprint {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: "planned" | "in_progress" | "completed";
  tasks?: Task[];
}

export default function Show({ project, sprint }: { project: Project; sprint: Sprint }) {
  const formatDate = (date?: string) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusColor =
    sprint.status === "completed"
      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
      : sprint.status === "in_progress"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100"
      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

  return (
    <AppLayout>
      <Head title={`Sprint: ${sprint.name}`} />

      <div className="max-w-5xl mx-auto mt-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href={route("projects.sprints.index", project.id)}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {sprint.name}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href={route("projects.sprints.edit", [project.id, sprint.id])}
              className="px-3 py-2 rounded-md border border-indigo-500 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Sprint Details */}
        <Card className="shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-xl">{sprint.name}</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                {sprint.status.replace("_", " ")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {sprint.description || "No description provided."}
            </p>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>
                  <strong>Start:</strong> {formatDate(sprint.start_date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>
                  <strong>End:</strong> {formatDate(sprint.end_date)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
{/* Tasks List */}
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-2">
      <ListTodo className="text-indigo-500" size={20} />
      <h2 className="font-semibold text-lg">Tasks in this Sprint</h2>
    </div>
    <Link
      href={route("projects.sprints.tasks.create", [project.id, sprint.id])}
      className="px-3 py-2 rounded-md border border-indigo-500 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition"
    >
      + Add Task
    </Link>
  </div>

  {sprint.tasks && sprint.tasks.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sprint.tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow p-4 flex flex-col justify-between"
        >
          {/* Card Header */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {task.title}
            </h3>
            <span className="text-xs text-gray-500 capitalize">
              Status: {task.status.replace("_", " ")}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-between gap-2">
            {/* Edit */}
            <Link
              href={route("projects.sprints.tasks.edit", [
                project.id,
                sprint.id,
                task.id,
              ])}
              className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition flex items-center justify-center"
            >
              Edit
            </Link>

            {/* Delete */}
            <button
              type="button"
              className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("openModalDelete", {
                    detail: {
                      action: route("projects.sprints.tasks.destroy", [
                        project.id,
                        sprint.id,
                        task.id,
                      ]),
                      title: task.title,
                    },
                  })
                )
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 dark:text-gray-400 italic">
      No tasks yet. Tasks will appear here when added.
    </p>
  )}
</div>


      </div>
    </AppLayout>
  );
}

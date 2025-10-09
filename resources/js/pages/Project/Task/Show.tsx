import React from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { ArrowLeft, ListTodo } from "lucide-react";

export default function Show({ project, task }: { project: any; task: any }) {
  return (
    <AppLayout
      
    >
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <ListTodo size={22} /> {task.title}
          </h2>
          <Link
             href={route("projects.tasks.index", [project.id])}
            className="flex items-center text-indigo-500 hover:underline"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </Link>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-3">
          {task.description || "No description provided."}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <p>
            <span className="font-semibold">Status:</span> {task.status}
          </p>
          <p>
            <span className="font-semibold">Sprint:</span>{" "}
            {task.sprint ? task.sprint.name : "—"}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

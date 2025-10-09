import React from "react";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: number;
  name: string;
}

interface Sprint {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: "planned" | "in_progress" | "completed";
}

export default function Index({ project, sprints }: { project: Project; sprints: Sprint[] }) {
  // Helper to format date nicely
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper for status color
  const getStatusColor = (status: Sprint["status"]) => {
    switch (status) {
      case "planned":
        return "bg-gray-100 text-gray-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AppLayout>
      <Head title={`Sprints - ${project.name}`} />

      <div className="max-w-5xl mx-auto mt-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Sprints for <span className="text-indigo-600">{project.name}</span>
          </h1>
          <Link href={route("projects.sprints.create", project.id)}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              + New Sprint
            </Button>
          </Link>
        </div>

        {/* Sprint Cards */}
        {sprints.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-gray-50">
            <p className="text-gray-500 text-lg">
              No sprints yet. Create one to get started 🚀
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {sprints.map((sprint) => (
              <Card
                key={sprint.id}
                className="shadow-md border border-gray-100 hover:shadow-lg transition duration-200"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      {sprint.name}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                        sprint.status
                      )}`}
                    >
                      {sprint.status.replace("_", " ")}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {sprint.description || "No description provided."}
                  </p>

                  {/* Dates */}
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>
                      <span className="font-medium text-gray-700">Start:</span>{" "}
                      {formatDate(sprint.start_date)}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">End:</span>{" "}
                      {formatDate(sprint.end_date)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <Link
                      href={route("projects.sprints.edit", [project.id, sprint.id])}
                    >
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link
                      href={route("projects.sprints.destroy", [project.id, sprint.id])}
                      method="delete"
                      as="button"
                    >
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

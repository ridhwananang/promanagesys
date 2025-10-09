import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface Project {
  id: number;
  name: string;
}

interface SprintForm {
  project_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function Create({ project }: { project: Project }) {
  const { data, setData, post, processing, errors, reset } = useForm<SprintForm>({
    project_id: project.id,
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "planned",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

post(route('projects.sprints.store', project.id), {
  onSuccess: () => {
    toast.success("Sprint created successfully 🎉");
    reset();
  },
  onError: () => {
    toast.error("Failed to create sprint ❌");
  },
});

  };

  return (
    <AppLayout>
      <Head title={`Create Sprint - ${project.name}`} />

      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Create Sprint for <span className="text-indigo-600">{project.name}</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sprint Name */}
          <div>
            <Label htmlFor="name" className="font-medium">
              Sprint Name
            </Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Enter sprint name"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Describe sprint goals..."
              rows={4}
              className="mt-1"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="start_date" className="font-medium">
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="mt-1"
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end_date" className="font-medium">
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                value={data.end_date}
                onChange={(e) => setData("end_date", e.target.value)}
                className="mt-1"
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" className="font-medium">
              Status
            </Label>
            <select
              id="status"
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={data.status}
              onChange={(e) => setData("status", e.target.value)}
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={processing}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {processing ? "Saving..." : "Create Sprint"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

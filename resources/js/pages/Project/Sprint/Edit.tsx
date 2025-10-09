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

interface Sprint {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: "planned" | "in_progress" | "completed";
}

export default function Edit({ project, sprint }: { project: Project; sprint: Sprint }) {
  const { data, setData, put, processing, errors } = useForm({
    name: sprint.name || "",
    description: sprint.description || "",
    start_date: sprint.start_date || "",
    end_date: sprint.end_date || "",
    status: sprint.status || "planned",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   put(
  route("projects.sprints.update", { project: project.id, sprint: sprint.id }),
  {
    onSuccess: () => toast.success("✅ Sprint updated successfully"),
    onError: () => toast.error("❌ Failed to update sprint"),
  }
);

  };

  return (
    <AppLayout>
      <Head title={`Edit Sprint: ${sprint.name}`} />

      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Edit Sprint</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Sprint Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setData("name", e.target.value)
              }
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setData("description", e.target.value)
              }
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={data.start_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData("start_date", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={data.end_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData("end_date", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="w-full border rounded-md p-2"
              value={data.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setData("status", e.target.value as Sprint["status"])
              }
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing ? "Saving..." : "Update Sprint"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

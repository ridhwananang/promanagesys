import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Briefcase, CheckCircle, Users } from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout>
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <div className="grid md:grid-cols-3 gap-4">
        <div className="relative bg-white dark:bg-neutral-800 p-4 rounded-xl shadow overflow-hidden">
            <p className="text-sm text-neutral-500">Total Projects</p>
            <h3 className="text-3xl font-bold mt-1">12</h3>
            <Briefcase className="absolute right-4 bottom-1 text-neutral-200 dark:text-neutral-700 w-30 h-30 opacity-40 transform rotate-45" />
        </div>

        <div className="relative bg-white dark:bg-neutral-800 p-4 rounded-xl shadow overflow-hidden">
            <p className="text-sm text-neutral-500">Tasks In Progress</p>
            <h3 className="text-3xl font-bold mt-1">47</h3>
            <CheckCircle className="absolute right-4 bottom-1 text-neutral-200 dark:text-neutral-700 w-30 h-30 opacity-40 transform -rotate-12" />
        </div>

        <div className="relative bg-white dark:bg-neutral-800 p-4 rounded-xl shadow overflow-hidden">
            <p className="text-sm text-neutral-500">Active Members</p>
            <h3 className="text-3xl font-bold mt-1">8</h3>
            <Users className="absolute right-4 bottom-1 text-neutral-200 dark:text-neutral-700 w-30 h-30 opacity-30 transform rotate-30" />
        </div>
        </div>
    </AppLayout>
  );
}

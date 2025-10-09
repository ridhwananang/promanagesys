import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

type Props = {
  user: User;
};

export default function Edit({ user }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    _method: "put", // Laravel spoofing method
    name: user.name || "",
    email: user.email || "",
    role: user.role || "",
    password: "",
    password_confirmation: "",
    avatar: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(
    user.avatar ? `/storage/${user.avatar}` : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("users.update", user.id));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("avatar", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Edit User
          </h1>
          <Link
            href={route("users.index")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            <ArrowLeft size={18} /> Back
          </Link>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6"
        >
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            {preview ? (
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700 mb-3"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-3 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <label className="cursor-pointer text-blue-600 dark:text-blue-400 text-sm hover:underline">
              Change Avatar
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </label>
            {errors.avatar && (
              <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={data.role}
              onChange={(e) => setData("role", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              <option value="project_manager">Project Manager</option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="fullstack">Fullstack</option>
              <option value="uiux">UI/UX Designer</option>
              <option value="marketing">Marketing</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                placeholder="Leave blank to keep old password"
                className="mt-1"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                  setData("password_confirmation", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={processing}
              className="px-6 py-2 rounded-lg"
            >
              {processing ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

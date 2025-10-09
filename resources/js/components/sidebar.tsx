import { Home, FolderKanban, Clock, Users, Menu } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";

const menu = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Projects", icon: FolderKanban, href: "/projects" },
  { name: "Timelog", icon: Clock, href: "/timelog" },
  { name: "Members", icon: Users, href: "/users" },
];

export default function Sidebar({
  isOpen,
  setSidebarOpen,
}: {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { url } = usePage();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Toggle Button untuk Mobile */}
      <button
        onClick={() => setSidebarOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-red-600 rounded-md text-white md:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-red-600 to-orange-400 
          text-white flex flex-col overflow-hidden shadow-md rounded-r-2xl 
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <div className="relative z-5 p-3 text-3xl font-extrabold tracking-tight text-right drop-shadow-lg">
          Project <span className="text-yellow-300">Management</span> System
        </div>

        <nav className="relative z-10 flex-1 space-y-2 px-4 mt-1">
          {menu.map(({ name, icon: Icon, href }) => {
            const isActive = url.startsWith(href);
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 px-2 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/25 backdrop-blur-md shadow-lg scale-100"
                    : "hover:bg-white/10 hover:scale-105"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-yellow-300" : "text-white"}
                />
                <span className="text-sm font-medium">{name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}

import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import type { SidebarItem } from "../components/ui/Sidebar";
interface DashboardLayoutProps {
  items: SidebarItem[];
  title?: string;
}

export default function DashboardLayout({ items, title }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={items} title={title} />
      <div className="flex-1 min-w-0">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
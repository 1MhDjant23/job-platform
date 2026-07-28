import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
export interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
}

export default function Sidebar({ items, title = "Dashboard" }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white md:flex md:flex-col">
      <div className="px-5 py-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">{title}</h2>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
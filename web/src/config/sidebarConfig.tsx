import { LayoutDashboard, FileText, Bookmark, Briefcase, PlusCircle, ListChecks, Users, Building2, BarChart3 } from "lucide-react";
import type { SidebarItem } from "../components/ui/Sidebar";
export const seekerSidebarItems: SidebarItem[] = [
  { label: "Tableau de bord", to: "/dashboard/seeker", icon: LayoutDashboard },
  { label: "Mes candidatures", to: "/dashboard/seeker/applications", icon: FileText },
  { label: "Offres sauvegardées", to: "/dashboard/seeker/saved", icon: Bookmark },
];

export const employerSidebarItems: SidebarItem[] = [
  { label: "Tableau de bord", to: "/dashboard/employer", icon: LayoutDashboard },
  { label: "Publier une offre", to: "/dashboard/employer/post", icon: PlusCircle },
  { label: "Gérer les offres", to: "/dashboard/employer/listings", icon: ListChecks },
];

export const adminSidebarItems: SidebarItem[] = [
  { label: "Vue d'ensemble", to: "/dashboard/admin", icon: BarChart3 },
  { label: "Utilisateurs", to: "/dashboard/admin/users", icon: Users },
  { label: "Entreprises", to: "/dashboard/admin/companies", icon: Building2 },
];
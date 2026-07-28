import { Link, NavLink } from "react-router-dom";
import { Briefcase, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <span className="text-lg font-bold text-gray-900">Smart Job Board</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={linkClasses} end>
            Offres
          </NavLink>
          <NavLink to="/companies" className={linkClasses}>
            Entreprises
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <User className="h-4 w-4" />
            S'inscrire
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <NavLink to="/" className={linkClasses} end onClick={() => setOpen(false)}>
            Offres
          </NavLink>
          <NavLink to="/companies" className={linkClasses} onClick={() => setOpen(false)}>
            Entreprises
          </NavLink>
          <Link to="/login" className="mt-2 text-sm font-medium text-gray-600" onClick={() => setOpen(false)}>
            Connexion
          </Link>
          <Link
            to="/register"
            className="mt-1 rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white"
            onClick={() => setOpen(false)}
          >
            S'inscrire
          </Link>
        </nav>
      )}
    </header>
  );
}
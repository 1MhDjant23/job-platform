import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="mt-3 text-lg font-medium text-gray-900">Page introuvable</p>
      <p className="mt-1 text-sm text-gray-500">La page que tu cherches n'existe pas ou a été déplacée.</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
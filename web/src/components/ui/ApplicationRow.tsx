import { Eye } from "lucide-react";

export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

interface ApplicationRowProps {
  applicantName: string;
  applicantAvatar?: string;
  jobTitle: string;
  appliedAt: string;
  status: ApplicationStatus;
  onView?: () => void;
  onStatusChange?: (status: ApplicationStatus) => void;
}

const statusConfig: Record<ApplicationStatus, { label: string; classes: string }> = {
  pending: { label: "En attente", classes: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  reviewed: { label: "Examinée", classes: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  accepted: { label: "Acceptée", classes: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  rejected: { label: "Refusée", classes: "bg-red-50 text-red-700 ring-red-600/20" },
};

export default function ApplicationRow({
  applicantName,
  applicantAvatar,
  jobTitle,
  appliedAt,
  status,
  onView,
  onStatusChange,
}: ApplicationRowProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {applicantAvatar ? (
          <img src={applicantAvatar} alt={applicantName} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
            {applicantName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{applicantName}</p>
          <p className="truncate text-xs text-gray-500">{jobTitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden sm:block text-xs text-gray-400">{appliedAt}</span>

        {onStatusChange ? (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${config.classes}`}
          >
            <option value="pending">En attente</option>
            <option value="reviewed">Examinée</option>
            <option value="accepted">Acceptée</option>
            <option value="rejected">Refusée</option>
          </select>
        ) : (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${config.classes}`}>
            {config.label}
          </span>
        )}

        {onView && (
          <button
            onClick={onView}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
            aria-label="Voir la candidature"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
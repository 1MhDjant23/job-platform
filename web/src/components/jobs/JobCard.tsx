import { Link } from "react-router-dom";
import type { Job } from "@job-platform/contracts";

interface Props {
    job: Job
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME:  'Full Time',
  PART_TIME:  'Part Time',
  CONTRACT:   'Contract',
  INTERNSHIP: 'Internship',
  REMOTE:     'Remote',
};

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return '';
  if (min && max)   return `${min.toLocaleString()} – ${max.toLocaleString()} MAD`;
  if (min)          return `From ${min.toLocaleString()} MAD`;
  return `Up to ${max!.toLocaleString()} MAD`;
}

// How long ago the job was posted
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export  function    JobCard({ job }: Props) {

    const   salary = formatSalary(job.salaryMin, job.salaryMax);
    return (
        <Link
            to={`/jobs/${job.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-5
                    hover:border-blue-300 hover:shadow-sm
                    transition-all duration-150"
        >
                  {/* Header — logo + title + company */}
            <div className="flex items-start gap-3 mb-3">
                    {/* Company logo or placeholder */}
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0
                        flex items-center justify-center overflow-hidden">
                        {job.company.logoUrl ? (
                            <img
                                src={job.company.logoUrl}
                                alt={job.company.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-lg font-semibold text-gray-400">
                                {job.company.name.charAt(0)}
                            </span>
                        )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                        {job.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                    {job.company.name}
                    </p>
                </div>
                        {/* Posted time — top right */}
                <span className="text-xs text-gray-400 flex-shrink-0">
                    {timeAgo(job.createdAt)}
                </span>
            </div>
             {/* Meta row — location, type, salary */}
            <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-500">
                {job.location && (
                <span>📍 {job.location}</span>
                )}
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {JOB_TYPE_LABELS[job.type] ?? job.type}
                </span>
                {salary && (
                <span className="text-green-600 font-medium text-xs">
                    {salary}
                </span>
                )}
            </div>
            {/* Tags */}
            {job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                {job.tags.slice(0, 4).map(({ tag }) => (
                    <span
                    key={tag.id}
                    className="px-2.5 py-0.5 bg-blue-50 text-blue-700
                                text-xs rounded-full font-medium"
                    >
                    {tag.name}
                    </span>
                ))}
                {job.tags.length > 4 && (
                    <span className="px-2.5 py-0.5 bg-gray-50 text-gray-500
                                    text-xs rounded-full">
                    +{job.tags.length - 4} more
                    </span>
                )}
                </div>
            )}
            {/* Footer — applicant count */}
            <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                {job._count.applications} applicant
                {job._count.applications !== 1 ? 's' : ''}
                </span>
            </div>
        </Link>
    );

}
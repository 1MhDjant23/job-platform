import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/ui/Skeleton";
import { useState } from "react";
import type { Job } from "@job-platform/contracts";
import { useMyCompany } from "../../hooks/useCompany";
import { useDeleteJob, useMyJobs } from "../../hooks/useJobs";
import { Button } from "../../components/ui/Button";
import { ErrorState } from "../../components/ui/ErrorState";


// ── Jobs section skeleton ────
function JobsSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

interface DeleteModalProps {
  job:      Job;
  onClose:  () => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function DeleteModal({ job, onClose, onDelete, isDeleting }: DeleteModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center
                    justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Delete this job?
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                    <span className="font-medium text-gray-800">{job.title}</span>
                </p>
                <p className="text-sm text-red-600 mb-6">
                    All {job._count.applications} application
                    {job._count.applications !== 1 ? 's' : ''} will also be deleted.
                    This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <Button
                        variant="danger"
                        isLoading={isDeleting}
                        onClick={() => onDelete(job.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );

}

// ____ Job status badge 
const STATUS_STYLES: Record<string, string> = {
  OPEN:    'bg-green-100 text-green-700',
  CLOSED:  'bg-gray-100 text-gray-600',
  DRAFT:   'bg-yellow-100 text-yellow-700',
  EXPIRED: 'bg-red-100 text-red-600',
};

function StatusBadge({status} : {status: string}) {
    return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full
                        ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
}

interface JobRowProps {
    job: Job;
    onDelete: (job: Job) => void;
}

function JobRow({ job, onDelete }: JobRowProps) {
    return (
        <div className="flex items-center gap-4 p-4 hover:bg-gray-50
                    transition-colors border-b border-gray-100 last:border-0">
            {/* Title + meta */}
            <div className="flex-1 min-w-0">
                <Link
                    to={`/jobs/${job.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600
                        transition-colors truncate block"
                >
                    {job.title}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                        {job._count.applications} applicant
                        {job._count.applications !== 1 ? 's' : ''}
                    </span>
                    {job.location && (
                        <span className="text-xs text-gray-400">· {job.location}</span>
                    )}
                </div>
            </div>
            {/* status badge */}
            <StatusBadge status={job.status} />
            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                    to={`/jobs/${job.id}/applications`}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg
                     text-gray-600 hover:border-gray-300 transition-colors"
                >
                    View applications
                </Link>
                <button
                    onClick={() => onDelete(job)}
                    className="px-3 py-1.5 text-xs border border-red-200 rounded-lg
                     text-red-600 hover:bg-red-50 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );

}

// _______ Main dashboard component ________

export  function EmployerDashboard() {
    const   navigate = useNavigate();
    const   [jobToDelete, setJobToDelete] = useState<Job | null>(null);

    const  {
        data: company,
        isLoading: companyLoading,
        isError: companyError
    } = useMyCompany();

    const   {
        data: jobs,
        isLoading: jobsLoading,
        isError: jobsError,
        refetch: refetchJobs
    } = useMyJobs();

    const   { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

    const   handleDelete = (id: string) => {
        deleteJob(id, {
            onSuccess: () => setJobToDelete(null),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Page header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Dashboard
                        </h1>
                        {company && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {company.name}
                            </p>
                        )}
                    </div>
                    <Button
                        onClick={() => navigate('/post-job')}
                        className="w-auto px-5"
                    >
                        + Post a job
                    </Button>
                </div>
                {/* ______ Company card ____________ */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Company profile
                        </h2>
                        <Link
                            to={"/setting/company"}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Edite
                        </Link>
                    </div>

                    {companyLoading && (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    )}

                    {companyError && (
                        <p className="text-sm text-red-500">
                            Failed to load company profile
                        </p>
                    )}

                    {company && (
                        <div className="flex items-center gap-3">
                        {/* logo */}
                            <div className="w-10 h-10 rounded-lg bg-gray-100
                              flex items-center justify-center
                              overflow-hidden flex-shrink-0">
                                {company.logoUrl ? (
                                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-lg font-semibold text-gray-400">
                                        {company.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{company.name}</p>
                                <p className="text-xs text-gray-500">
                                    {company.location ?? "No location set"}
                                    {company.website && (
                                        <>
                                            {' . '}
                                            <a
                                                href={company.website}target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {company.website.replace("https://", '')}
                                            </a>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {/* _______ Jobs section _____ */}
                <div className="bg-white rounded-xl border border-gray-200">
                  {/* Section header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Your job listings
                            {jobs && (
                                <span className="ml-2 text-gray-400 font-normal">
                                    ({jobs.length})
                                </span>
                            )}
                        </h2>
                    </div>
                    {/* Loading */}
                    {jobsLoading && <JobsSkeleton />}

                    {/* Error */}
                    {jobsError && !jobsLoading && (
                        <div className="p-6">
                            <ErrorState
                                message="Failed to load your jobs"
                                onRetry={refetchJobs}
                            />
                        </div>
                    )}
                    {/* Empty */}
                    {!jobsLoading && !jobsError && jobs?.length === 0 && (
                        <div className="flex flex-col items-center justify-center
                                py-12 text-center px-4">
                            <p className="text-3xl mb-3">📋</p>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                                No jobs posted
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                Post your first job to start receiving applications
                            </p>
                            <Button
                                onClick={() => navigate('/post-job')}
                                className="w-auto px-5"
                            >
                                Post a job
                            </Button>
                        </div>
                    )}
                    {/* Job list */}
                    {!jobsLoading && !jobsError && jobs && jobs.length > 0 && (
                        <div>
                            {jobs.map(job => (
                                <JobRow
                                    key={job.id}
                                    job={job}
                                    onDelete={setJobToDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Delete modal */}
            {jobToDelete && (
                <DeleteModal
                    job={jobToDelete}
                    onClose={() => setJobToDelete(null)}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}
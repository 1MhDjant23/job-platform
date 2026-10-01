/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJob } from "../../hooks/useJobs";
import { ErrorState } from "../../components/ui/ErrorState";
import { Skeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../contexts/auth/AuthContext";
import type { Job } from "@job-platform/contracts";
import { useState } from "react";
import { ApplyModal } from "../../components/jobs/ApplyModal";

// ── Helpers ____
const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME:  'Full Time',
  PART_TIME:  'Part Time',
  CONTRACT:   'Contract',
  INTERNSHIP: 'Internship',
  REMOTE:     'Remote',
};

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max)
    return 'Salary not specified';
  if (min && max)
    return `${min.toLocaleString()} – ${max.toLocaleString()} MAD`;
  if (min)          
    return `From ${min.toLocaleString()} MAD`;
  return `Up to ${max!.toLocaleString()} MAD`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ── Apply button — behaviour depends on auth state ─────────────
function ApplyButton({ job }: { job: Job }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const   [open, setOpen] = useState<boolean>(false);

    // Not logged in → go to register
    if (!user) {
        return (
        <button
            onClick={() => navigate('/register')}
            className="w-full py-3 bg-blue-600 text-white font-medium
                    rounded-lg hover:bg-blue-700 transition-colors"
        >
            Sign up to apply
        </button>
        );
    }

    // Logged in as employer; they posted jobs, can't apply
    if (user.role === 'EMPLOYER') {
        return (
        <div className="w-full py-3 bg-gray-100 text-gray-500 font-medium
                        rounded-lg text-center text-sm">
            Employers cannot apply to jobs
        </div>
        );
    }

    // Job seeker; show apply button
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="w-full py-3 bg-blue-600 text-white font-medium
                   rounded-lg hover:bg-blue-700 transition-colors"
            >
                Apply now
            </button>
            {open && (
                <ApplyModal
                    job={job}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}

// ── Skeleton for detail page ──────────────────────────────────
function JobDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Skeleton className="h-4 w-24 mb-6" />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex gap-4 mb-4">
          <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}


//________________________________________________________________
export default function JobDetailPage() {

    const   { id } = useParams<{id: string}>();

    const   {data: job, isLoading, isError, error, refetch} = useJob(id);

    // loading state
    if(isLoading)   return JobDetailSkeleton();
    // ERROR STATE
    if(isError) {
        const e = error as any;

        const   message = e?.response?.status === 404
            ? 'This job listing no longer exists'
            : e?.response?.data?.message ?? 'Failed to load job';
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <Link
                    to={'/jobs'}
                    className="text-sm text-blue-600 hover:underline mb-6 block"
                >
                    ← Back to jobs
                </Link>
                <ErrorState message={message} onRetry={refetch} />
            </div>
        );
    }
    // Success State
    if(!job)    return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                 {/* Back link */}
                <Link
                    to="/jobs"
                    className="inline-flex items-center gap-1 text-sm text-gray-500
                            hover:text-gray-900 mb-6 transition-colors"
                >
                    ← Back to jobs
                </Link>
                {/* ── Job header card  */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                {/* Company + title */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0
                            flex items-center justify-center overflow-hidden">
                        {job.company.logoUrl ? (
                            <img
                            src={job.company.logoUrl}
                            alt={job.company.name}
                            className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl font-semibold text-gray-400">
                            {job.company.name.charAt(0)}
                            </span>
                        )}
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 mb-1">
                                {job.title}
                            </h1>
                            <p className="text-gray-500">{job.company.name}</p>
                        </div>
                    </div>
                        {/* meta pills */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {job.location && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            📍 {job.location}
                        </span>
                        )}
                        <span className="px-3 py-1 bg-gray-100 text-gray-700
                             text-sm rounded-full">
                            {JOB_TYPE_LABELS[job.type] ?? job.type}
                        </span>

                        <span className="px-3 py-1 bg-green-50 text-green-700
                             text-sm rounded-full font-medium">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>

                        <span className="px-3 py-1 bg-gray-100 text-gray-500
                                        text-sm rounded-full">
                        Posted {formatDate(job.createdAt)}
                        </span>

                        <span className="px-3 py-1 bg-gray-100 text-gray-500
                                        text-sm rounded-full">
                        {job._count.applications} applicant
                        {job._count.applications !== 1 ? 's' : ''}
                        </span>
                    </div>
                    {/* Tags */}
                    {job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                        {job.tags.map(({ tag }) => (
                            <span
                                key={tag.id}
                                className="px-2.5 py-0.5 bg-blue-50 text-blue-700
                                        text-xs rounded-full font-medium"
                            >
                                {tag.name}
                            </span>
                        ))}
                        </div>
                    )}
                    {/* Apply button */}
                    <ApplyButton job={job} />
                </div>
            {/* ── Job description card ____ */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Job Description
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {job.description}
                </p>
            </div>

            </div>
        </div>
    );
}
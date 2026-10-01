

// status badge

import type { Application } from "@job-platform/contracts";
import { Link } from "react-router-dom";
import { Skeleton } from "../../components/ui/Skeleton";
import { useState } from "react";
import { useMyApplications, useWithdrawApplication } from "../../hooks/useApplication";
import { ErrorState } from "../../components/ui/ErrorState";

const STATUS_CONFIG : Record<string, { label: string, className: string }> = {

    PENDING:  { label: 'Pending',  className: 'bg-yellow-100 text-yellow-700' },
    REVIEWED: { label: 'Reviewed', className: 'bg-blue-100   text-blue-700'   },
    ACCEPTED: { label: 'Accepted', className: 'bg-green-100  text-green-700'  },
    REJECTED: { label: 'Rejected', className: 'bg-red-100    text-red-600'    }
}

function StatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status] ?? {
        label: status,
        className: 'bg-gray-100 text-gray-600'
    }

    return (
        <span className={`px-2.5 py-0.5 text-xs font-medium
                      rounded-full ${config.className}`}>
            {config.label}
        </span>
    );
}

// withdraw confirmation

interface WithdrawModalProps {
    application: Application;
    onClose: () => void;
    onWithdraw: (id: string) => void;
    isWithdrawing: boolean;
}

function WithdrawModal({
    application,
    onClose,
    onWithdraw,
    isWithdrawing
}: WithdrawModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center
                    justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Withdraw application?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    You will lose you're application for{' '}
                    <span className="font-medium text-gray-800">
                        {application.job.title}
                    </span>{' '}
                    at{' '}
                    <span className="font-medium text-gray-800">
                        {application.job.company.name}
                    </span>.
                    This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => onWithdraw(application.id)}
                        disabled={isWithdrawing}
                        className="flex-1 py-2 bg-red-600 text-white text-sm
                            font-medium rounded-lg hover:bg-red-700
                            disabled:opacity-50 transition-colors"
                    >
                        {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isWithdrawing}
                        className="flex-1 py-2 border border-gray-200 text-sm
                            text-gray-700 rounded-lg hover:border-gray-300
                            disabled:opacity-50 transition-colors"
                    >
                        Keep application
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ApplicationRowProps {
    application: Application;
    onWithdraw: (application: Application) => void;
}

function ApplicationRow({ application, onWithdraw }: ApplicationRowProps) {
    const   {job} = application;

    const   canWithdraw = application.status === 'PENDING';
    // only PENDING application can be withdrawing.
    const   appliedDate = new Date(application.appliedAt).toLocaleDateString(
        'en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }
    );

    return (
        <div className="flex items-center gap-4 p-4 border-b border-gray-100
                    last:border-0 hover:bg-gray-50 transition-colors">
            {/* company logo  */}
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0
                      flex items-center justify-center overflow-hidden">
                {job.company.logoUrl ? (
                    <img 
                        src={job.company.logoUrl}
                        alt={job.company.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-sm font-semibold text-gray-400">
                        {job.company.name.charAt(0)}
                    </span>
                )}
            </div>
            {/* job info */}
            <div className="flex-1 min-w-0">
                <Link
                    to={`/jobs/${job.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600
                     transition-colors truncate block"
                >
                    {job.title}
                </Link>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{job.company.name}</span>
                    {job.location && (
                        <span className="text-xs text-gray-400">· {job.location}</span>
                    )}
                    <span className="text-xs text-gray-400">· Applied {appliedDate}</span>
                </div>
            </div>

            {/* status  */}
            <StatusBadge status={application.status} />

            {/* withdraw button only for PENDING  */}
            {canWithdraw && (
                <button
                    onClick={() => onWithdraw(application)}
                    className="text-xs text-red-500 hover:text-red-700
                     transition-colors flex-shrink-0"
                >
                    Withdraw
                </button>
            )}
        </div>
    );
}

// Skeleton

function    ApplicationsSkeleton() {
    return (
        <div className="divide-y divide-gray-100">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0"/>
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            ))}
        </div>
    );
}

export default function MyApplicationsPage() {
    const   [toWithdraw, setToWithdraw] = useState<Application | null>(null);

    const   {
        data: applications,
        isLoading,
        isError,
        refetch
    } = useMyApplications();

    const   {
        mutate: withdraw,
        isPending: isWithdrawing
    } = useWithdrawApplication();
    
    const   handleWithdraw = (id: string) => {
        withdraw(id, {
            onSuccess: () => setToWithdraw(null)
        })
    }

      // Status summary — how many in each state
    const summary = applications?.reduce(
        (acc, app) => {
        acc[app.status] = (acc[app.status] ?? 0) + 1;
        return acc;
        },
        {} as Record<string, number>
    );
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* header  */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        My applications
                    </h1>
                    {applications && (
                        <p className="text-sm text-gray-500 mt-1">
                            {applications.length} total
                        </p>
                    )}
                </div>

                {/* status summary card  */}
                {applications && applications.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                        <div
                            key={status}
                            className="bg-white rounded-xl border border-gray-200 p-4"
                        >
                            <p className="text-xl font-semibold text-gray-900">
                                {summary?.[status] ?? 0}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {config.label}
                            </p>
                        </div>
                        ))}
                    </div>
                )}
                {/* Application list  */}

                <div className="bg-white rounded-xl border border-gray-200">
                    {/* loading */}
                    {isLoading && <ApplicationsSkeleton />}
                    {/* Error */}
                    {isError && !isLoading && (
                        <div className="p-6">
                        <ErrorState
                            message="Failed to load your applications"
                            onRetry={refetch}
                        />
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && !isError && applications?.length === 0 && (
                        <div className="flex flex-col items-center justify-center
                                        py-12 text-center px-4">
                        <p className="text-3xl mb-3">📩</p>

                        <p className="text-sm font-medium text-gray-900 mb-1">
                            No applications yet
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                            Browse open positions and start applying
                        </p>
                        <Link
                            to="/jobs"
                            className="px-4 py-2 bg-blue-600 text-white text-sm
                                    rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse jobs
                        </Link>
                        </div>
                    )}

                    {/* list  */}
                    {!isLoading && !isError && applications && applications.length > 0 && (
                        <div>
                            {applications.map(app => (
                                <ApplicationRow
                                    key={app.id}
                                    application={app}
                                    onWithdraw={setToWithdraw}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* withdraw modal  */}
            {toWithdraw && (
                <WithdrawModal
                    application={toWithdraw}
                    onClose={() => setToWithdraw(null)}
                    onWithdraw={handleWithdraw}
                    isWithdrawing={isWithdrawing}
                />
            )}
        </div>
    );
}
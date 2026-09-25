import { useSearchParams } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import { JobCardSkeletonList } from "../../components/jobs/JobCardSkeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { JobCard } from "../../components/jobs/JobCard";
import { Pagination } from "../../components/ui/Pagination";

const JOB_TYPES = [
  { value: '',           label: 'All types' },
  { value: 'FULL_TIME',  label: 'Full Time' },
  { value: 'PART_TIME',  label: 'Part Time' },
  { value: 'CONTRACT',   label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'REMOTE',     label: 'Remote' },
];

export  function JobListingPage() {
    const   [searchParams, setSearchParams] = useSearchParams();
    // read all filters value from URl
    const page     = Number(searchParams.get('page'))     || 1;
    const search   = searchParams.get('search')           || '';
    const type     = searchParams.get('type')             || '';
    const location = searchParams.get('location')         || '';
    // fetch Jobs
    const   {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching
    } = useJobs({ page, search, type, location });

    const hasFilters = !!(search || type || location);

    const updateFilter = (key: string, value: string) => {
        setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }
        next.set('page', '1'); // always reset to page 1
        return next;
        });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('page', String(newPage));
        return next;
        });
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => setSearchParams({});

    const getErrorMessage = (err: unknown): string => {
        const e = err as any;
        if (!e?.response) return 'Network error — check your connection';
        return e.response?.data?.message ?? 'Failed to load jobs';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                        {/* Page header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Find your next opportunity
                    </h1>
                    {!isLoading && data && (
                        <p className="text-sm text-gray-500 mt-1">
                        {data.meta.total} jobs available
                        </p>
                    )}
                </div>
                {/* // filters allways visible */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={search}
                            onChange={e => updateFilter('search', e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-200
                                        rounded-lg outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                        />
                        {/* job type */}
                        <select
                            value={type}
                            onChange={e => updateFilter('type', e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg
                                        outline-none focus:ring-2 focus:ring-blue-500
                                        bg-white text-gray-700"
                            >
                            {JOB_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                         {/* Location */}
                        <input
                            type="text"
                            placeholder="Location..."
                            value={location}
                            onChange={e => updateFilter('location', e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-200
                                    rounded-lg outline-none focus:ring-2 focus:ring-blue-500
                                    focus:border-transparent"
                        />
                        {/* Clear filters */}
                        {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700
                                    border border-gray-200 rounded-lg hover:border-gray-300
                                    transition-colors whitespace-nowrap"
                        >
                            Clear ✕
                        </button>
                        )}
                    </div>
                </div>
                {/* Content for states */}

                {/* state 1: Loading */}
                {isLoading && <JobCardSkeletonList count={6}/>}
                {/* state 2: Error */}
                {isError && !isLoading && (
                <ErrorState
                    message={getErrorMessage(error)}
                    onRetry={refetch}
                />
                )}
                {/* state 3: Empty */}
                {!isLoading && !isError && data?.data.length === 0 && (
                <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
                )}
                {/* stat 4: Success */}
                {!isLoading && !isError && data && data.data.length > 0 && (
                    <>
                        <div className="flex flex-col gap-4">
                        {data.data.map(job => (
                            <JobCard key={job.id} job={job} />
                        ))}
                        </div>

                        <Pagination
                            meta={data.meta}
                            onPageChange={handlePageChange}
                            isFetching={isFetching}
                        />
                    </>
                )}

            </div>

        </div>
    );
}
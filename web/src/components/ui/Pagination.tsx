interface Meta {
  page:       number;
  totalPages: number;
  total:      number;
  limit:      number;
}

interface Props {
    meta: Meta;
    onPageChange: (page: number) => void;
    isFetching?:  boolean;
}

function    getPageRange(current: number, total: number): (number | '...')[] {
    if(total <= 7) {
        return Array.from({length: total}, (_, i) => i + 1);
    }
    const   pages: (number | '...')[] = [1];
    if(current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end   = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2)   pages.push('...');

    pages.push(total);
    return pages;
}

export  function Pagination({ meta, onPageChange, isFetching }: Props) {
    const { page, total, totalPages, limit } = meta;
    if(totalPages <= 1) return null;

    const   isFirst = page === 1;
    const   isLast = page === totalPages;
    const   from = (page - 1) * limit + 1;
    const   to = Math.min(page * limit, total);
    const   pages = getPageRange(page, totalPages);

    return (
        <div className={`flex items-center justify-between mt-8 flex-wrap gap-4
                     ${isFetching ? 'opacity-60 pointer-events-none' : ''}`}>

            <p className="text-sm text-gray-500">
                Showing{' '}
                <span className="font-medium text-gray-900">{from}–{to}</span>
                {' '}of{' '}
                <span className="font-medium text-gray-900">{total}</span> jobs
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page-1)}
                    disabled={isFirst}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200
                     hover:border-gray-300 disabled:opacity-40
                     disabled:cursor-not-allowed transition-colors"
                >
                    ← Prev
                </button>

            {pages.map((p, i) =>
            p === '...' ? (
                <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">
                ...
                </span>
            ) : (
                <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`w-8 h-8 text-sm rounded-lg transition-colors
                    ${p === page
                    ? 'bg-blue-600 text-white font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                {p}
                </button>
            )
            )}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={isLast}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200
                            hover:border-gray-300 disabled:opacity-40
                            disabled:cursor-not-allowed transition-colors"
            >
                Next →
            </button>
            </div>
        </div>
    );

}
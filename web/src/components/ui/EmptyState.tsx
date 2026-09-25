
interface Props {
    hasFilters: boolean;
    onClear: () => void

}
export function EmptyState({ hasFilters, onClear }: Props) {

    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
                {hasFilters ? 'No jobs match your filters' : 'No jobs posted yet'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                {hasFilters
                ? 'Try adjusting or clearing your filters'
                : 'Check back later for new opportunities'
                }
            </p>
            {hasFilters && onClear && (
                <button
                onClick={onClear}
                className="px-4 py-2 border border-gray-300 text-sm rounded-lg
                            text-gray-700 hover:border-gray-400 transition-colors"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );

}
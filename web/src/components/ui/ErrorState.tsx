
interface Props {
    message: string
    onRetry: () => void
}

export  function ErrorState({
    message = 'Something went wrong',
    onRetry
    }: Props) {

        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center
                      justify-center mb-4 text-xl">
                        ⚠️
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                    Failed to load
                </h3>
                <p className="text-sm text-gray-500 mb-4 max-w-xs">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 bg-blue-600 text-white text-sm
                     rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try again
                    </button>
                )}
            </div>
        );

}
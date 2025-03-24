export function ChatSkeleton() {
    return (
        <div className="flex flex-col flex-1">
            {/* Chat History Skeleton */}
            <div className="flex-1 p-4 space-y-4">
                {/* Message bubbles */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col space-y-2">
                        {/* AI Message */}
                        <div className="flex items-start space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="w-24 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
                                <div className="w-3/4 h-16 bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse" />
                            </div>
                        </div>
                        {/* User Message */}
                        <div className="flex items-start justify-end space-x-2">
                            <div className="flex-1 space-y-2">
                                <div className="w-20 h-4 ml-auto bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
                                <div className="w-2/3 h-16 bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse" />
                            </div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input Skeleton */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse" />
                    <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse" />
                </div>
            </div>
        </div>
    );
}

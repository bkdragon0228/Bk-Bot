interface ErrorMessageProps {
    title: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function ErrorMessage({ title, message, action }: ErrorMessageProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="w-full px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );
}

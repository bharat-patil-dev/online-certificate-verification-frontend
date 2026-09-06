import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorState = ({
    title = "Something went wrong",
    message = "We couldn't load the requested information.",
    onRetry,
}) => {
    return (
        <div className="py-16 px-6 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                <AlertTriangle size={28} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {title}
            </h3>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                {message}
            </p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            )}

        </div>
    );
};

export default ErrorState;
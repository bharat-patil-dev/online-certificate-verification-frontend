import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
    message = "Loading...",
    fullScreen = false,
}) => {
    return (
        <div
            className={
                fullScreen
                    ? "min-h-screen flex items-center justify-center bg-slate-50"
                    : "flex items-center justify-center py-12"
            }
        >
            <div className="flex flex-col items-center gap-3">
                <Loader2
                    size={32}
                    className="text-blue-600 animate-spin"
                />

                <p className="text-sm text-slate-500">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
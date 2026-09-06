import { Inbox } from "lucide-react";

const EmptyState = ({
    title = "Nothing here yet",
    description = "There is no data to display.",
    actionLabel,
    onAction,
}) => {
    return (
        <div className="py-16 px-6 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Inbox size={28} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {title}
            </h3>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                {description}
            </p>

            {actionLabel && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                >
                    {actionLabel}
                </button>
            )}

        </div>
    );
};

export default EmptyState;
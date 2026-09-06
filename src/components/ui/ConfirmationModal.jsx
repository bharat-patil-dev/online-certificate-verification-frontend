import {
    AlertTriangle,
    X,
} from "lucide-react";

const ConfirmationModal = ({
    open,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    danger = true,
}) => {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-5">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">

                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-start justify-between">

                    <div className="flex items-start gap-3">

                        <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                                danger
                                    ? "bg-red-50 text-red-600"
                                    : "bg-blue-50 text-blue-600"
                            }`}
                        >
                            <AlertTriangle size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                {title}
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                {message}
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* Actions */}
                <div className="p-6 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-white ${
                            danger
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {confirmText}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ConfirmationModal;
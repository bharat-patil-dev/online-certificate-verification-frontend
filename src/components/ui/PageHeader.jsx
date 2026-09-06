import { ArrowLeft } from "lucide-react";

const PageHeader = ({
    title,
    description,
    showBack = false,
    onBack,
    children,
}) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

            <div className="flex items-start gap-3">

                {showBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-1 w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-2 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

            </div>

            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}

        </div>
    );
};

export default PageHeader;
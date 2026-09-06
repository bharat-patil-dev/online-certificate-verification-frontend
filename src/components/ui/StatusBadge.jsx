import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

const StatusBadge = ({ status }) => {
    const config = {
        ACTIVE: {
            label: "ACTIVE",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
        },

        APPROVED: {
            label: "APPROVED",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
        },

        PENDING: {
            label: "PENDING",
            className: "bg-amber-50 text-amber-700 border-amber-200",
            icon: Clock3,
        },

        REVOKED: {
            label: "REVOKED",
            className: "bg-red-50 text-red-700 border-red-200",
            icon: XCircle,
        },

        REJECTED: {
            label: "REJECTED",
            className: "bg-red-50 text-red-700 border-red-200",
            icon: XCircle,
        },
    };

    const current = config[status] || {
        label: status || "UNKNOWN",
        className: "bg-slate-50 text-slate-600 border-slate-200",
        icon: Clock3,
    };

    const Icon = current.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${current.className}`}
        >
            <Icon size={13} />
            {current.label}
        </span>
    );
};

export default StatusBadge; 
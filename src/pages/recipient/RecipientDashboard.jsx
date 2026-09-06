import {
    Award,
    CheckCircle2,
    Search,
    Download,
    Eye,
    CalendarDays,
    Building2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatusBadge from "../../components/ui/StatusBadge";
import AppLayout from "../../components/layout/AppLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";

import { getRecipientCertificates } from "../../api/certificateApi";

const RecipientDashboard = () => {
    const navigate = useNavigate();

    const [certificates, setCertificates] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCertificates = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getRecipientCertificates();

            

            setCertificates(data || []);
        } catch (err) {
            console.error("Failed to load recipient certificates:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load certificates."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCertificates();
    }, []);

    const filteredCertificates = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return certificates.filter((certificate) => {
            const certificateId =
                certificate.certificateId || "";

            const courseName =
                certificate.courseName || "";

            const institutionName =
                certificate.institutionName || "";

            return (
                !searchText ||
                certificateId
                    .toLowerCase()
                    .includes(searchText) ||
                courseName
                    .toLowerCase()
                    .includes(searchText) ||
                institutionName
                    .toLowerCase()
                    .includes(searchText)
            );
        });
    }, [certificates, search]);

    const activeCertificates = certificates.filter(
        (certificate) =>
            certificate.status === "ACTIVE"
    ).length;

    const revokedCertificates = certificates.filter(
        (certificate) =>
            certificate.status === "REVOKED"
    ).length;

    const handleDownload = (certificate) => {
        if (certificate.pdfUrl) {
            window.open(
                certificate.pdfUrl,
                "_blank",
                "noopener,noreferrer"
            );
        }
    };

    if (loading) {
        return (
            <AppLayout
                role="RECIPIENT"
                activeItem="Certificates"
                userName="Recipient"
            >
                <LoadingSpinner
                    message="Loading certificates..."
                />
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout
                role="RECIPIENT"
                activeItem="Certificates"
                userName="Recipient"
            >
                <ErrorState
                    title="Unable to load certificates"
                    message={error}
                    onRetry={loadCertificates}
                />
            </AppLayout>
        );
    }

    return (
        <AppLayout
            role="RECIPIENT"
            activeItem="Certificates"
            userName="Recipient"
        >
            <div className="min-h-screen">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-900">
                        My Certificates
                    </h1>

                    <p className="mt-2 text-slate-500">
                        View, verify and manage your digital certificates.
                    </p>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

                    <StatCard
                        title="Total Certificates"
                        value={certificates.length}
                        icon={<Award size={21} />}
                        style="bg-blue-50 text-blue-600"
                    />

                    <StatCard
                        title="Active Certificates"
                        value={activeCertificates}
                        icon={<CheckCircle2 size={21} />}
                        style="bg-emerald-50 text-emerald-600"
                    />

                    <StatCard
                        title="Revoked Certificates"
                        value={revokedCertificates}
                        icon={<Award size={21} />}
                        style="bg-red-50 text-red-600"
                    />

                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

                    <div className="relative max-w-xl">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search certificates..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>

                {/* Certificates */}
                {filteredCertificates.length === 0 ? (

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-20 text-center">

                        <Award
                            size={45}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No certificates found
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            {certificates.length === 0
                                ? "You do not have any certificates yet."
                                : "Try changing your search."}
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                        {filteredCertificates.map(
                            (certificate) => (
                                <CertificateCard
                                    key={certificate.certificateId}
                                    certificate={certificate}
                                    onView={() =>
                                        navigate(
                                            `/recipient/certificates/${certificate.certificateId}`
                                        )
                                    }
                                    onDownload={() =>
                                        handleDownload(certificate)
                                    }
                                />
                            )
                        )}

                    </div>

                )}

            </div>
        </AppLayout>
    );
};

const StatCard = ({
    title,
    value,
    icon,
    style,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="text-3xl font-bold text-slate-900 mt-2">
                        {value}
                    </p>
                </div>

                <div className={`p-3 rounded-xl ${style}`}>
                    {icon}
                </div>

            </div>

        </div>
    );
};

const CertificateCard = ({
    certificate,
    onView,
    onDownload,
}) => {
    const isActive =
        certificate.status === "ACTIVE";

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">

            {/* Top */}
            <div className="h-32 bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">

                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                    <Award size={28} />
                </div>

            </div>

            {/* Content */}
            <div className="p-6">

                <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                        <h3 className="font-semibold text-slate-900 truncate">
                            {certificate.courseName || "-"}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 truncate">
                            {certificate.certificateId || "-"}
                        </p>

                    </div>

                    <StatusBadge
                        status={certificate.status}
                    />

                </div>

                <div className="mt-5 space-y-3">

                    <Detail
                        icon={<Building2 size={16} />}
                        value={
                            certificate.institutionName ||
                            "-"
                        }
                    />

                    <Detail
                        icon={<CalendarDays size={16} />}
                        value={
                            certificate.issueDate ||
                            "-"
                        }
                    />

                </div>

                <div className="mt-6 flex gap-2">

                    <button
                        type="button"
                        onClick={onView}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                    >
                        <Eye size={16} />
                        View
                    </button>

                    <button
                        type="button"
                        onClick={onDownload}
                        disabled={!certificate.pdfUrl}
                        className="w-11 h-11 rounded-xl border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                        title="Download"
                    >
                        <Download size={16} />
                    </button>

                </div>

            </div>
        </div>
    );
};

const Detail = ({ icon, value }) => (
    <div className="flex items-center gap-2 text-sm text-slate-600">

        <span className="text-slate-400">
            {icon}
        </span>

        <span className="truncate">
            {value}
        </span>

    </div>
);

export default RecipientDashboard;
import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Award,
    Eye,
    Download,
    Ban,
    Plus,
    Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";
import AppLayout from "../../components/layout/AppLayout";

import {
    getInstitutionCertificates,
} from "../../api/certificateApi";

const Certificates = () => {
    const navigate = useNavigate();

    const [certificates, setCertificates] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCertificates = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getInstitutionCertificates();

        

            setCertificates(data || []);

        } catch (err) {
            console.error(
                "Failed to load certificates:",
                err
            );

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
        const searchText =
            search.toLowerCase().trim();

        return certificates.filter((certificate) => {

            const certificateId =
                certificate.certificateId || "";

            const recipientName =
                certificate.recipientName || "";

            const recipientEmail =
                certificate.recipientEmail || "";

            const courseName =
                certificate.courseName || "";

            const matchesSearch =
                !searchText ||
                certificateId
                    .toLowerCase()
                    .includes(searchText) ||
                recipientName
                    .toLowerCase()
                    .includes(searchText) ||
                recipientEmail
                    .toLowerCase()
                    .includes(searchText) ||
                courseName
                    .toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "ALL" ||
                certificate.status ===
                    statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        certificates,
        search,
        statusFilter,
    ]);

    if (loading) {
        return (
            <AppLayout
                role="INSTITUTION"
                activeItem="Certificates"
                userName="Institution"
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
                role="INSTITUTION"
                activeItem="Certificates"
                userName="Institution"
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
            role="INSTITUTION"
            activeItem="Certificates"
            userName="Institution"
        >

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Certificates
                    </h1>

                    <p className="mt-2 text-slate-500">
                        View and manage certificates issued by your institution.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/institution/certificates/issue"
                        )
                    }
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Issue Certificate
                </button>

            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

                <div className="flex flex-col lg:flex-row gap-4">

                    {/* Search */}
                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search by certificate ID, recipient or course..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">

                        <Filter
                            size={18}
                            className="text-slate-500"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500"
                        >
                            <option value="ALL">
                                All Status
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="REVOKED">
                                Revoked
                            </option>
                        </select>

                    </div>

                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-200">
                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-900">
                            {filteredCertificates.length}
                        </span>{" "}
                        certificates
                    </p>
                </div>

                {filteredCertificates.length === 0 ? (

                    <div className="py-20 text-center">

                        <Award
                            size={42}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No certificates found
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            {certificates.length === 0
                                ? "No certificates have been issued by your institution yet."
                                : "Try changing your search or filter."}
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px]">

                            <thead>

                                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                                    <th className="px-6 py-4">
                                        Certificate
                                    </th>

                                    <th className="px-6 py-4">
                                        Recipient
                                    </th>

                                    <th className="px-6 py-4">
                                        Course
                                    </th>

                                    <th className="px-6 py-4">
                                        Issue Date
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredCertificates.map(
                                    (certificate) => (

                                        <CertificateRow
                                            key={
                                                certificate.certificateId
                                            }
                                            certificate={
                                                certificate
                                            }
                                            onView={() =>
                                                navigate(
                                                    `/institution/certificates/${certificate.certificateId}`
                                                )
                                            }
                                        />

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </AppLayout>
    );
};

const CertificateRow = ({
    certificate,
    onView,
}) => {

    const isActive =
        certificate.status === "ACTIVE";

    const formattedDate =
        certificate.issueDate
            ? new Date(
                  certificate.issueDate
              ).toLocaleDateString(
                  "en-IN",
                  {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                  }
              )
            : "Not available";

    const handleDownload = () => {

        if (!certificate.pdfUrl) {
            alert(
                "PDF is not available for this certificate."
            );
            return;
        }

        window.open(
            certificate.pdfUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <tr className="border-t border-slate-100 hover:bg-slate-50 transition">

            {/* Certificate */}
            <td className="px-6 py-5">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Award size={18} />
                    </div>

                    <div>

                        <p className="text-sm font-semibold text-slate-900">
                            {
                                certificate.certificateId
                            }
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                            Digital Certificate
                        </p>

                    </div>

                </div>

            </td>

            {/* Recipient */}
            <td className="px-6 py-5">

                <p className="text-sm font-medium text-slate-800">
                    {
                        certificate.recipientName ||
                        "Not available"
                    }
                </p>

                <p className="text-xs text-slate-500 mt-1">
                    {
                        certificate.recipientEmail ||
                        "Not available"
                    }
                </p>

            </td>

            {/* Course */}
            <td className="px-6 py-5 text-sm text-slate-700">
                {
                    certificate.courseName ||
                    "Not available"
                }
            </td>

            {/* Date */}
            <td className="px-6 py-5 text-sm text-slate-500">
                {formattedDate}
            </td>

            {/* Status */}
            <td className="px-6 py-5">
                <StatusBadge
                    status={
                        certificate.status ||
                        "ACTIVE"
                    }
                />
            </td>

            {/* Actions */}
            <td className="px-6 py-5">

                <div className="flex items-center justify-end gap-2">

                    {/* View */}
                    <ActionButton
                        icon={
                            <Eye size={16} />
                        }
                        title="View"
                        onClick={onView}
                    />

                    {/* Download */}
                    <ActionButton
                        icon={
                            <Download size={16} />
                        }
                        title="Download PDF"
                        onClick={handleDownload}
                    />

                    {/* Revoke */}
                    {isActive && (
                        <ActionButton
                            icon={
                                <Ban size={16} />
                            }
                            title="Revoke"
                            danger
                        />
                    )}

                </div>

            </td>

        </tr>
    );
};

const ActionButton = ({
    icon,
    title,
    onClick,
    danger = false,
}) => {

    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${
                danger
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
        >
            {icon}
        </button>
    );
};

export default Certificates;
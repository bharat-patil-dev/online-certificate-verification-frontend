import { useEffect, useMemo, useState } from "react";
import {
    Award,
    Search,
    Eye,
    CheckCircle2,
    XCircle,
    Ban,
    Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllCertificates } from "../../api/adminApi";

const AdminCertificates = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const statusFromUrl = searchParams.get("status") || "ALL";
    const searchQuery = searchParams.get("search") || "";

    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCertificates = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllCertificates();

                setCertificates(data || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load certificates."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCertificates();
    }, []);

    const handleStatusChange = (status) => {
        const params = new URLSearchParams(searchParams);

        if (status === "ALL") {
            params.delete("status");
        } else {
            params.set("status", status);
        }

        setSearchParams(params);
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;

        const params = new URLSearchParams(searchParams);

        if (value.trim() === "") {
            params.delete("search");
        } else {
            params.set("search", value);
        }

        setSearchParams(params);
    };

    const filteredCertificates = useMemo(() => {
        const search = searchQuery.toLowerCase().trim();

        return certificates.filter((certificate) => {
            const matchesStatus =
                statusFromUrl === "ALL" ||
                certificate.status === statusFromUrl;

            const matchesSearch =
                search === "" ||
                certificate.certificateId
                    ?.toLowerCase()
                    .includes(search) ||
                certificate.recipientName
                    ?.toLowerCase()
                    .includes(search) ||
                certificate.recipientEmail
                    ?.toLowerCase()
                    .includes(search) ||
                certificate.courseName
                    ?.toLowerCase()
                    .includes(search) ||
                certificate.institutionName
                    ?.toLowerCase()
                    .includes(search);

            return matchesStatus && matchesSearch;
        });
    }, [certificates, statusFromUrl, searchQuery]);

    const totalCertificates = certificates.length;

    const activeCertificates = certificates.filter(
        (certificate) => certificate.status === "ACTIVE"
    ).length;

    const revokedCertificates = certificates.filter(
        (certificate) => certificate.status === "REVOKED"
    ).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-600">
                    <Loader2
                        size={22}
                        className="animate-spin"
                    />
                    Loading certificates...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-red-800">
                        Failed to load certificates
                    </h2>

                    <p className="mt-2 text-sm text-red-700">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <Award size={23} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Certificates
                        </h1>

                        <p className="mt-1 text-slate-500">
                            View and monitor certificates issued through the platform.
                        </p>
                    </div>

                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

                <CertificateStat
                    title="Total Certificates"
                    value={totalCertificates}
                    icon={<Award size={20} />}
                />

                <CertificateStat
                    title="Active"
                    value={activeCertificates}
                    icon={<CheckCircle2 size={20} />}
                />

                <CertificateStat
                    title="Revoked"
                    value={revokedCertificates}
                    icon={<XCircle size={20} />}
                />

            </div>

            {/* Filters */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

                <div className="flex flex-col lg:flex-row gap-4">

                    {/* Search */}
                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search certificate ID, recipient, course or institution..."
                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    {/* Status */}
                    <select
                        value={statusFromUrl}
                        onChange={(event) =>
                            handleStatusChange(event.target.value)
                        }
                        className="h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="ALL">
                            All Certificates
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="REVOKED">
                            Revoked
                        </option>
                    </select>

                </div>

            </section>

            {/* Certificate table */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-200">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Certificate List
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                {filteredCertificates.length} certificate
                                {filteredCertificates.length !== 1 ? "s" : ""} found
                            </p>
                        </div>

                        <div className="hidden sm:flex items-center gap-2">

                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                <CheckCircle2 size={13} />
                                {activeCertificates} Active
                            </span>

                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
                                <Ban size={13} />
                                {revokedCertificates} Revoked
                            </span>

                        </div>

                    </div>

                </div>

                {filteredCertificates.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <Award size={26} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No certificates found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try changing your search or status filter.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px]">

                            <thead className="bg-slate-50">

                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                                    <th className="px-6 py-4 font-semibold">
                                        Certificate
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Recipient
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Institution
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Course
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Issue Date
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 font-semibold text-right">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {filteredCertificates.map((certificate) => (

                                    <tr
                                        key={certificate.certificateId}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-5">

                                            <p className="font-semibold text-slate-900">
                                                {certificate.certificateId}
                                            </p>

                                            <p className="text-xs text-slate-500 mt-1">
                                                {certificate.certificateTitle}
                                            </p>

                                        </td>

                                        <td className="px-6 py-5">

                                            <p className="font-medium text-slate-800">
                                                {certificate.recipientName}
                                            </p>

                                            <p className="text-xs text-slate-500 mt-1">
                                                {certificate.recipientEmail}
                                            </p>

                                        </td>

                                        <td className="px-6 py-5 text-sm text-slate-700">
                                            {certificate.institutionName}
                                        </td>

                                        <td className="px-6 py-5 text-sm text-slate-700">
                                            {certificate.courseName}
                                        </td>

                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {formatDate(certificate.issueDate)}
                                        </td>

                                        <td className="px-6 py-5">
                                            <CertificateStatus
                                                status={certificate.status}
                                            />
                                        </td>

                                        <td className="px-6 py-5 text-right">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/certificates/${certificate.certificateId}`
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    );
};


/* ================================
   STAT CARD
================================ */

const CertificateStat = ({
    title,
    value,
    icon,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="text-2xl font-bold text-slate-900 mt-1">
                        {value}
                    </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    {icon}
                </div>

            </div>

        </div>
    );
};


/* ================================
   STATUS
================================ */

const CertificateStatus = ({ status }) => {

    const isActive = status === "ACTIVE";

    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
            }`}
        >
            {isActive ? (
                <CheckCircle2 size={14} />
            ) : (
                <XCircle size={14} />
            )}

            {status}
        </span>
    );
};


/* ================================
   DATE
================================ */

const formatDate = (date) => {

    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

export default AdminCertificates;
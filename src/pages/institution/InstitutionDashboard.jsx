import {
    Award,
    CheckCircle2,
    Clock3,
    XCircle,
    Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";

import { getInstitutionCertificates } from "../../api/certificateApi";

const InstitutionDashboard = () => {
    const navigate = useNavigate();

    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getInstitutionCertificates();

            setCertificates(data || []);
        } catch (err) {
            console.error("Failed to load certificates:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load certificate data."
            );
        } finally {
            setLoading(false);
        }
    };

    const totalCertificates = certificates.length;

    const activeCertificates = certificates.filter(
        (certificate) =>
            certificate.status?.toUpperCase() === "ACTIVE"
    ).length;

    const revokedCertificates = certificates.filter(
        (certificate) =>
            certificate.status?.toUpperCase() === "REVOKED"
    ).length;

    const pendingCertificates = certificates.filter(
        (certificate) =>
            certificate.status?.toUpperCase() === "PENDING"
    ).length;

    const recentCertificates = [...certificates]
        .sort((a, b) => {
            const dateA = new Date(a.issueDate || 0);
            const dateB = new Date(b.issueDate || 0);

            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <AppLayout
            role="INSTITUTION"
            activeItem="Dashboard"
        >

            {/* Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Institution Dashboard
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Here's an overview of your certificate activity.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/institution/certificates/issue")
                    }
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Issue Certificate
                </button>

            </div>

            {/* Loading */}
            {loading && (
                <div className="py-12">
                    <LoadingSpinner />
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <ErrorState message={error} />
            )}

            {/* Dashboard Data */}
            {!loading && !error && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                        <StatCard
                            title="Total Certificates"
                            value={totalCertificates}
                            icon={<Award size={22} />}
                            style="bg-blue-50 text-blue-600"
                        />

                        <StatCard
                            title="Active Certificates"
                            value={activeCertificates}
                            icon={<CheckCircle2 size={22} />}
                            style="bg-emerald-50 text-emerald-600"
                        />

                        <StatCard
                            title="Pending"
                            value={pendingCertificates}
                            icon={<Clock3 size={22} />}
                            style="bg-amber-50 text-amber-600"
                        />

                        <StatCard
                            title="Revoked"
                            value={revokedCertificates}
                            icon={<XCircle size={22} />}
                            style="bg-red-50 text-red-600"
                        />

                    </div>

                    {/* Recent Certificates */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Recent Certificates
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Recently issued certificates
                            </p>
                        </div>

                        <div className="overflow-x-auto">

                            {recentCertificates.length === 0 ? (
                                <div className="p-10 text-center text-slate-500">
                                    No certificates have been issued yet.
                                </div>
                            ) : (
                                <table className="w-full">

                                    <thead className="bg-slate-50">
                                        <tr className="text-left text-xs uppercase tracking-wide text-slate-500">

                                            <th className="px-6 py-4">
                                                Certificate ID
                                            </th>

                                            <th className="px-6 py-4">
                                                Recipient
                                            </th>

                                            <th className="px-6 py-4">
                                                Course
                                            </th>

                                            <th className="px-6 py-4">
                                                Status
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentCertificates.map(
                                            (certificate) => (
                                                <tr
                                                    key={certificate.certificateId}
                                                    className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                                                    onClick={() =>
                                                        navigate(
                                                            `/institution/certificates/${certificate.certificateId}`
                                                        )
                                                    }
                                                >

                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        {certificate.certificateId}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm">
                                                        {certificate.recipientName}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm">
                                                        {certificate.courseName}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                                certificate.status?.toUpperCase() ===
                                                                "ACTIVE"
                                                                    ? "bg-emerald-50 text-emerald-700"
                                                                    : certificate.status?.toUpperCase() ===
                                                                      "REVOKED"
                                                                    ? "bg-red-50 text-red-700"
                                                                    : "bg-amber-50 text-amber-700"
                                                            }`}
                                                        >
                                                            {certificate.status}
                                                        </span>
                                                    </td>

                                                </tr>
                                            )
                                        )}
                                    </tbody>

                                </table>
                            )}

                        </div>

                    </div>
                </>
            )}

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

            <div className="flex items-start justify-between">

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

export default InstitutionDashboard;
import { useEffect, useMemo, useState } from "react";
import {
    Building2,
    CheckCircle2,
    Clock3,
    XCircle,
    ArrowUpRight,
    FileCheck2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import AppLayout from "../../components/layout/AppLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

import { getAllInstitutions } from "../../api/adminApi";

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [institutions, setInstitutions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getAllInstitutions();

        

            setInstitutions(data || []);

        } catch (err) {
            console.error(
                "Failed to load admin dashboard:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    /*
     * Calculate dashboard statistics
     * from REAL backend data.
     */
    const statistics = useMemo(() => {

        const total =
            institutions.length;

        const pending =
            institutions.filter(
                (institution) =>
                    institution.status === "PENDING"
            ).length;

        const approved =
            institutions.filter(
                (institution) =>
                    institution.status === "APPROVED"
            ).length;

        const rejected =
            institutions.filter(
                (institution) =>
                    institution.status === "REJECTED"
            ).length;

        return {
            total,
            pending,
            approved,
            rejected,
        };

    }, [institutions]);

    /*
     * Show a small list of pending institutions
     * on the dashboard.
     */
    const pendingInstitutions =
        institutions.filter(
            (institution) =>
                institution.status === "PENDING"
        );

    if (loading) {
        return (
            <AppLayout
                role="ADMIN"
                activeItem="Dashboard"
                userName={user?.fullName}
            >
                <LoadingSpinner
                    message="Loading admin dashboard..."
                />
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout
                role="ADMIN"
                activeItem="Dashboard"
                userName={user?.fullName}
            >
                <ErrorState
                    title="Unable to load dashboard"
                    message={error}
                    onRetry={loadDashboard}
                />
            </AppLayout>
        );
    }

    return (
        <AppLayout
            role="ADMIN"
            activeItem="Dashboard"
            userName={user?.fullName}
        >

            {/* ================= HEADER ================= */}

            <div className="mb-8">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <Building2 size={22} />
                    </div>

                    <div>

                        <h1 className="text-3xl font-bold text-slate-900">
                            Admin Dashboard
                        </h1>

                        <p className="mt-1 text-slate-500">
                            Manage institutions and certificate verification activity.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================= STATISTICS ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                <StatCard
                    title="Total Institutions"
                    value={statistics.total}
                    description="All registered institutions"
                    icon={
                        <Building2 size={21} />
                    }
                />

                <StatCard
                    title="Pending Approval"
                    value={statistics.pending}
                    description="Waiting for review"
                    icon={
                        <Clock3 size={21} />
                    }
                />

                <StatCard
                    title="Approved"
                    value={statistics.approved}
                    description="Approved institutions"
                    icon={
                        <CheckCircle2 size={21} />
                    }
                />

                <StatCard
                    title="Rejected"
                    value={statistics.rejected}
                    description="Rejected institutions"
                    icon={
                        <XCircle size={21} />
                    }
                />

            </div>


            {/* ================= MAIN CONTENT ================= */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">


                {/* ================= PENDING ================= */}

                <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">

                    <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4">

                        <div>

                            <h2 className="text-lg font-semibold text-slate-900">
                                Pending Institutions
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Institutions waiting for approval.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/institutions"
                                )
                            }
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            View all
                            <ArrowUpRight
                                size={16}
                            />
                        </button>

                    </div>


                    {pendingInstitutions.length === 0 ? (

                        <EmptyState
                            title="No pending institutions"
                            description="All institution registration requests have been reviewed."
                        />

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[700px]">

                                <thead>

                                    <tr className="border-b border-slate-200">

                                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Institution
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Contact
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>

                                        <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {pendingInstitutions.map(
                                        (institution) => (

                                            <tr
                                                key={
                                                    institution.id
                                                }
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                            >

                                                {/* Institution */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                            <Building2
                                                                size={18}
                                                            />
                                                        </div>

                                                        <div>

                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {
                                                                    institution.institutionName
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-500 mt-1">
                                                                ID #
                                                                {
                                                                    institution.id
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Contact */}

                                                <td className="px-6 py-5">

                                                    <p className="text-sm font-medium text-slate-800">
                                                        {
                                                            institution.userEmail
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {
                                                            institution.phone ||
                                                            "No phone"
                                                        }
                                                    </p>

                                                </td>


                                                {/* Status */}

                                                <td className="px-6 py-5">

                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">

                                                        <span className="w-2 h-2 rounded-full bg-amber-500" />

                                                        PENDING

                                                    </span>

                                                </td>


                                                {/* Action */}

                                                <td className="px-6 py-5">

                                                    <div className="flex justify-end">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/institutions/${institution.id}`
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                                                        >
                                                            Review
                                                            <ArrowUpRight
                                                                size={14}
                                                            />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>


                {/* ================= QUICK ACTIONS ================= */}

                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Quick Actions
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Common administration tasks.
                    </p>


                    <div className="mt-6 space-y-3">

                        <QuickAction
                            icon={
                                <Building2
                                    size={19}
                                />
                            }
                            title="Manage Institutions"
                            description="View all registered institutions"
                            onClick={() =>
                                navigate(
                                    "/admin/institutions"
                                )
                            }
                        />


                        <QuickAction
                            icon={
                                <Clock3
                                    size={19}
                                />
                            }
                            title="Pending Approvals"
                            description={`${statistics.pending} institution${
                                statistics.pending === 1
                                    ? ""
                                    : "s"
                            } waiting for approval`}
                            onClick={() =>
                                navigate(
                                    "/admin/institutions"
                                )
                            }
                        />


                        <QuickAction
                            icon={
                                <FileCheck2
                                    size={19}
                                />
                            }
                            title="Certificate Activity"
                            description="Manage issued certificates"
                            onClick={() =>
                                navigate(
                                    "/admin/certificates"
                                )
                            }
                        />

                    </div>

                </section>

            </div>


            {/* ================= SYSTEM STATUS ================= */}

            <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                            <CheckCircle2
                                size={19}
                            />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                System Status
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Admin API is responding successfully.
                            </p>

                        </div>

                    </div>


                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">

                        <span className="w-2 h-2 rounded-full bg-emerald-500" />

                        Operational

                    </span>

                </div>

            </section>

        </AppLayout>
    );
};


/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
    title,
    value,
    description,
    icon,
}) => {

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        {description}
                    </p>

                </div>


                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    {icon}
                </div>

            </div>

        </div>
    );
};


/* =========================================================
   QUICK ACTION
========================================================= */

const QuickAction = ({
    icon,
    title,
    description,
    onClick,
}) => {

    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 text-left hover:bg-slate-50 transition"
        >

            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                {icon}
            </div>

            <div className="flex-1 min-w-0">

                <p className="text-sm font-semibold text-slate-900">
                    {title}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                    {description}
                </p>

            </div>

            <ArrowUpRight
                size={16}
                className="text-slate-400 shrink-0"
            />

        </button>
    );
};

export default AdminDashboard;3
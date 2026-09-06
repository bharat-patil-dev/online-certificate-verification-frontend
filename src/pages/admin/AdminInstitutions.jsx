import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Building2,
    Eye,
    Check,
    Ban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

import {
    getAllInstitutions,
    approveInstitution,
    rejectInstitution,
} from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";

const AdminInstitutions = () => {
    
    
    const navigate = useNavigate();
    const { user } = useAuth();

    const [institutions, setInstitutions] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedInstitution, setSelectedInstitution] =
        useState(null);

    const [action, setAction] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // -----------------------------------
    // Load ALL institutions
    // -----------------------------------
    const loadInstitutions = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllInstitutions();

            

            setInstitutions(data || []);
        } catch (err) {
            console.error(
                "Failed to load institutions:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load institutions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInstitutions();
    }, []);

    // -----------------------------------
    // Search + status filter
    // -----------------------------------
    const filteredInstitutions = useMemo(() => {
        return institutions.filter((institution) => {
            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                institution.institutionName
                    ?.toLowerCase()
                    .includes(searchText) ||
                institution.userEmail
                    ?.toLowerCase()
                    .includes(searchText) ||
                institution.phone
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "ALL" ||
                institution.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        institutions,
        search,
        statusFilter,
    ]);

    // -----------------------------------
    // Confirmation modal
    // -----------------------------------
    const openApproveModal = (institution) => {
        setSelectedInstitution(institution);
        setAction("approve");
    };

    const openRejectModal = (institution) => {
        setSelectedInstitution(institution);
        setAction("reject");
    };

    const closeModal = () => {
        if (actionLoading) {
            return;
        }

        setSelectedInstitution(null);
        setAction(null);
    };

    // -----------------------------------
    // Approve / Reject
    // -----------------------------------
    const handleAction = async () => {
        if (!selectedInstitution) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");

            if (action === "approve") {
                await approveInstitution(
                    selectedInstitution.id
                );
            }

            if (action === "reject") {
                await rejectInstitution(
                    selectedInstitution.id
                );
            }

            setSelectedInstitution(null);
            setAction(null);

            await loadInstitutions();
        } catch (err) {
            console.error(
                "Institution action failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update institution."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // -----------------------------------
    // Loading
    // -----------------------------------
    if (loading) {
        return (
            <AppLayout
                role="ADMIN"
                activeItem="Institutions"
                userName={user?.fullName}
            >
                <LoadingSpinner
                    message="Loading institutions..."
                />
            </AppLayout>
        );
    }

    // -----------------------------------
    // Error
    // -----------------------------------
    if (error) {
        return (
            <AppLayout
                role="ADMIN"
                activeItem="Institutions"
                userName={user?.fullName}
            >
                <ErrorState
                    title="Unable to load institutions"
                    message={error}
                    onRetry={loadInstitutions}
                />
            </AppLayout>
        );
    }

    // -----------------------------------
    // Page
    // -----------------------------------
    return (
        <AppLayout
            role="ADMIN"
            activeItem="Institutions"
            userName={user?.fullName}
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Institutions
                </h1>

                <p className="mt-2 text-slate-500">
                    View, search and manage all registered institutions.
                </p>
            </div>

            {/* Search + filter */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

                <div className="flex flex-col lg:flex-row gap-4 lg:items-center">

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
                                setSearch(e.target.value)
                            }
                            placeholder="Search institution, email or phone..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Status */}
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        className="w-full lg:w-52 px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="ALL">
                            All Statuses
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="APPROVED">
                            Approved
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>
                    </select>

                </div>
            </div>

            {/* Count */}
            <div className="mb-4 text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                    {filteredInstitutions.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                    {institutions.length}
                </span>{" "}
                institutions
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {filteredInstitutions.length === 0 ? (
                    <EmptyState
                        title="No institutions found"
                        description={
                            search || statusFilter !== "ALL"
                                ? "Try changing your search or status filter."
                                : "There are no registered institutions yet."
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1000px]">

                            <thead>
                                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                                    <th className="px-6 py-4">
                                        Institution
                                    </th>

                                    <th className="px-6 py-4">
                                        Contact
                                    </th>

                                    <th className="px-6 py-4">
                                        Location
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
                                {filteredInstitutions.map(
                                    (institution) => {

                                        const isPending =
                                            institution.status ===
                                            "PENDING";

                                        return (
                                            <tr
                                                key={
                                                    institution.id
                                                }
                                                className="border-t border-slate-100 hover:bg-slate-50"
                                            >

                                                {/* Institution */}
                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                            <Building2
                                                                size={18}
                                                            />
                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                                {
                                                                    institution.institutionName
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Institution ID #
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

                                                {/* Location */}
                                                <td className="px-6 py-5 text-sm text-slate-600">
                                                    {
                                                        institution.address ||
                                                        "Not provided"
                                                    }
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-5">
                                                    <StatusBadge
                                                        status={
                                                            institution.status
                                                        }
                                                    />
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-5">

                                                    <div className="flex items-center justify-end gap-2">

                                                        {/* View */}
                                                        <button
                                                            type="button"
                                                            title="View institution"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/institutions/${institution.id}`
                                                                )
                                                            }
                                                            className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition"
                                                        >
                                                            <Eye
                                                                size={16}
                                                            />
                                                        </button>

                                                        {/* Approve */}
                                                        {isPending && (
                                                            <button
                                                                type="button"
                                                                title="Approve institution"
                                                                onClick={() =>
                                                                    openApproveModal(
                                                                        institution
                                                                    )
                                                                }
                                                                className="w-9 h-9 rounded-lg border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition"
                                                            >
                                                                <Check
                                                                    size={16}
                                                                />
                                                            </button>
                                                        )}

                                                        {/* Reject */}
                                                        {isPending && (
                                                            <button
                                                                type="button"
                                                                title="Reject institution"
                                                                onClick={() =>
                                                                    openRejectModal(
                                                                        institution
                                                                    )
                                                                }
                                                                className="w-9 h-9 rounded-lg border border-red-200 text-red-600 flex items-center justify-center hover:bg-red-50 transition"
                                                            >
                                                                <Ban
                                                                    size={16}
                                                                />
                                                            </button>
                                                        )}

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={Boolean(action)}
                title={
                    action === "approve"
                        ? "Approve institution?"
                        : "Reject institution?"
                }
                message={
                    action === "approve"
                        ? `Are you sure you want to approve ${selectedInstitution?.institutionName}?`
                        : `Are you sure you want to reject ${selectedInstitution?.institutionName}?`
                }
                confirmText={
                    action === "approve"
                        ? "Approve"
                        : "Reject"
                }
                cancelText="Cancel"
                onCancel={closeModal}
                onConfirm={handleAction}
                danger={action === "reject"}
            />

        </AppLayout>
    );
};

export default AdminInstitutions;
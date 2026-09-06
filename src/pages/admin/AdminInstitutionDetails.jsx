import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Check,
    Ban,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";

import StatusBadge from "../../components/ui/StatusBadge";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

import {
    getInstitutionById,
    approveInstitution,
    rejectInstitution,
} from "../../api/adminApi";

const AdminInstitutionDetails = () => {
    const { institutionId } = useParams();
    const navigate = useNavigate();

    const [institution, setInstitution] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const loadInstitution = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getInstitutionById(institutionId);

            setInstitution(data);
        } catch (err) {
            console.error("Failed to load institution:", err);

            setError(
                err?.response?.data?.message ||
                    "Failed to load institution details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInstitution();
    }, [institutionId]);

    const handleApprove = async () => {
        try {
            setActionLoading(true);

            await approveInstitution(institutionId);

            setShowApproveModal(false);

            await loadInstitution();
        } catch (err) {
            console.error("Failed to approve institution:", err);

            setError(
                err?.response?.data?.message ||
                    "Failed to approve institution."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        try {
            setActionLoading(true);

            await rejectInstitution(institutionId);

            setShowRejectModal(false);

            await loadInstitution();
        } catch (err) {
            console.error("Failed to reject institution:", err);

            setError(
                err?.response?.data?.message ||
                    "Failed to reject institution."
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <LoadingSpinner />
                </div>
            </AppLayout>
        );
    }

    if (error && !institution) {
        return (
            <AppLayout>
                <div className="p-6">
                    <ErrorState message={error} />
                </div>
            </AppLayout>
        );
    }

    if (!institution) {
        return (
            <AppLayout>
                <div className="p-6">
                    <ErrorState message="Institution not found." />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() =>
                                navigate("/admin/institutions")
                            }
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
                        >
                            <ArrowLeft size={18} />
                            Back to Institutions
                        </button>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Institution Details
                        </h1>

                        <p className="text-gray-500 mt-1">
                            View institution information
                        </p>
                    </div>

                    <StatusBadge status={institution.status} />
                </div>

                {/* Error after action */}
                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Institution Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Institution Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-4">

                            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">

                                {institution.logoUrl ? (
                                    <img
                                        src={institution.logoUrl}
                                        alt={institution.institutionName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Building2
                                        size={36}
                                        className="text-gray-400"
                                    />
                                )}

                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {institution.institutionName}
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    Institution ID: {institution.id}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Email */}
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Mail size={18} />
                                    <span className="text-sm font-medium">
                                        Email
                                    </span>
                                </div>

                                <p className="text-gray-900">
                                    {institution.userEmail || "Not provided"}
                                </p>
                            </div>

                            {/* Phone */}
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Phone size={18} />
                                    <span className="text-sm font-medium">
                                        Phone
                                    </span>
                                </div>

                                <p className="text-gray-900">
                                    {institution.phone || "Not provided"}
                                </p>
                            </div>

                            {/* Website */}
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Globe size={18} />
                                    <span className="text-sm font-medium">
                                        Website
                                    </span>
                                </div>

                                {institution.website ? (
                                    <a
                                        href={institution.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                    >
                                        {institution.website}
                                    </a>
                                ) : (
                                    <p className="text-gray-900">
                                        Not provided
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Building2 size={18} />
                                    <span className="text-sm font-medium">
                                        Status
                                    </span>
                                </div>

                                <StatusBadge
                                    status={institution.status}
                                />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <MapPin size={18} />
                                    <span className="text-sm font-medium">
                                        Address
                                    </span>
                                </div>

                                <p className="text-gray-900">
                                    {institution.address || "Not provided"}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Actions */}
                    {institution.status === "PENDING" && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">

                            <button
                                onClick={() =>
                                    setShowRejectModal(true)
                                }
                                disabled={actionLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                                <Ban size={18} />
                                Reject
                            </button>

                            <button
                                onClick={() =>
                                    setShowApproveModal(true)
                                }
                                disabled={actionLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                <Check size={18} />
                                Approve
                            </button>

                        </div>
                    )}

                </div>
            </div>

            {/* Approve Modal */}
            <ConfirmationModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleApprove}
                title="Approve Institution"
                message={`Are you sure you want to approve ${institution.institutionName}?`}
                confirmText="Approve"
            />

            {/* Reject Modal */}
            <ConfirmationModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                title="Reject Institution"
                message={`Are you sure you want to reject ${institution.institutionName}?`}
                confirmText="Reject"
            />

        </AppLayout>
    );
};

export default AdminInstitutionDetails;
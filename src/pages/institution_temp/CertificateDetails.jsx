import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Award,
    Download,
    QrCode,
    Ban,
    Mail,
    CalendarDays,
    BookOpen,
    UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getCertificateById,
    revokeCertificate,
} from "../../api/certificateApi";

import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const CertificateDetails = () => {
    const navigate = useNavigate();
    const { certificateId } = useParams();

    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [revoking, setRevoking] = useState(false);

    // Load certificate from backend
    useEffect(() => {
        const loadCertificate = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getCertificateById(
                    certificateId
                );

                setCertificate(data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load certificate."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCertificate();
    }, [certificateId]);

    // Revoke certificate
    const handleRevoke = async () => {
        try {
            setRevoking(true);

            await revokeCertificate(certificateId);

            setCertificate((prev) => ({
                ...prev,
                status: "REVOKED",
            }));

            setShowRevokeModal(false);

            alert("Certificate revoked successfully.");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to revoke certificate."
            );
        } finally {
            setRevoking(false);
        }
    };

    // Download PDF
    const handleDownload = () => {
        if (!certificate?.pdfUrl) {
            alert("PDF is not available.");
            return;
        }

        window.open(
            certificate.pdfUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // Open QR code
    const handleQrCode = () => {
        if (!certificate?.qrCodeUrl) {
            alert("QR code is not available.");
            return;
        }

        window.open(
            certificate.qrCodeUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-slate-500">
                        Loading certificate...
                    </p>
                </div>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/institution/certificates")
                    }
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    Back to Certificates
                </button>

                <div className="mt-8 bg-white rounded-2xl border border-red-200 p-8 text-center">
                    <h2 className="text-xl font-bold text-red-600">
                        Unable to load certificate
                    </h2>

                    <p className="mt-2 text-slate-500">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    // Certificate not found
    if (!certificate) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900">
                        Certificate not found
                    </h2>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/institution/certificates")
                        }
                        className="mt-4 text-blue-600 font-semibold"
                    >
                        Back to Certificates
                    </button>
                </div>
            </div>
        );
    }

    const isActive = certificate.status === "ACTIVE";

    return (
        <div className="min-h-screen bg-slate-50 p-8">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/institution/certificates")
                    }
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                >
                    <ArrowLeft size={19} />
                </button>

                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Certificate Details
                    </h1>

                    <p className="mt-1 text-slate-500">
                        View certificate information and manage its status.
                    </p>
                </div>

                <StatusBadge
                    status={certificate.status}
                />
            </div>


            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Certificate Preview */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">

                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Certificate Preview
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Digital certificate representation
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Download size={16} />
                            Download PDF
                        </button>

                    </div>


                    <div className="p-8">

                        <div className="relative aspect-[1.414/1] rounded-2xl border-[10px] border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center overflow-hidden">

                            <div className="absolute inset-5 border-2 border-blue-200 rounded-xl" />

                            <div className="relative z-10 text-center px-8">

                                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                                    <Award size={28} />
                                </div>

                                <p className="mt-5 text-xs uppercase tracking-[0.3em] text-slate-500">
                                    {certificate.institutionName}
                                </p>

                                <h3 className="mt-4 text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                                    {certificate.certificateTitle}
                                </h3>

                                <p className="mt-5 text-sm text-slate-500">
                                    This is to certify that
                                </p>

                                <p className="mt-2 text-2xl font-bold text-blue-700">
                                    {certificate.recipientName}
                                </p>

                                <p className="mt-4 text-sm text-slate-500">
                                    has successfully completed
                                </p>

                                <p className="mt-2 text-lg font-semibold text-slate-900">
                                    {certificate.courseName}
                                </p>

                                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-500">

                                    <span>
                                        Certificate ID:{" "}
                                        <strong className="text-slate-700">
                                            {certificate.certificateId}
                                        </strong>
                                    </span>

                                    <span>
                                        Issue Date:{" "}
                                        <strong className="text-slate-700">
                                            {certificate.issueDate}
                                        </strong>
                                    </span>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>


                {/* Right Side */}
                <div className="space-y-6">

                    {/* Recipient */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Recipient
                        </h2>

                        <div className="mt-5 space-y-4">

                            <DetailRow
                                icon={<UserRound size={17} />}
                                label="Name"
                                value={certificate.recipientName}
                            />

                            <DetailRow
                                icon={<Mail size={17} />}
                                label="Email"
                                value={certificate.recipientEmail}
                            />

                            <DetailRow
                                icon={<BookOpen size={17} />}
                                label="Course"
                                value={certificate.courseName}
                            />

                            <DetailRow
                                icon={<CalendarDays size={17} />}
                                label="Issue Date"
                                value={certificate.issueDate}
                            />

                        </div>

                    </section>


                    {/* Verification QR */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <QrCode size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Verification QR
                                </h2>

                                <p className="text-xs text-slate-500 mt-1">
                                    Scan to verify this certificate
                                </p>
                            </div>

                        </div>


                        {/* Real QR Code */}
                        <div className="mt-5 aspect-square max-w-44 mx-auto rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">

                            {certificate.qrCodeUrl ? (
                                <img
                                    src={certificate.qrCodeUrl}
                                    alt="Certificate QR Code"
                                    className="w-full h-full object-contain p-3"
                                />
                            ) : (
                                <div className="text-center text-slate-400">

                                    <QrCode
                                        size={70}
                                        className="mx-auto"
                                    />

                                    <p className="text-xs mt-3">
                                        QR not available
                                    </p>

                                </div>
                            )}

                        </div>


                        {/* Open QR */}
                        {certificate.qrCodeUrl && (
                            <button
                                type="button"
                                onClick={handleQrCode}
                                className="mt-4 w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Open QR Code
                            </button>
                        )}

                    </section>


                    {/* Actions */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                        <h2 className="font-semibold text-slate-900">
                            Certificate Actions
                        </h2>

                        <div className="mt-5 space-y-3">

                            {/* Download */}
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                            >
                                <Download size={17} />
                                Download Certificate
                            </button>


                            {/* Revoke */}
                            {isActive && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowRevokeModal(true)
                                    }
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50"
                                >
                                    <Ban size={17} />
                                    Revoke Certificate
                                </button>
                            )}

                        </div>

                    </section>

                </div>

            </div>


            {/* Confirmation Modal */}
            <ConfirmationModal
                open={showRevokeModal}
                title="Revoke certificate?"
                message="This certificate will be marked as revoked and public verification will show the revoked status."
                confirmText={
                    revoking
                        ? "Revoking..."
                        : "Revoke Certificate"
                }
                cancelText="Cancel"
                onCancel={() => {
                    if (!revoking) {
                        setShowRevokeModal(false);
                    }
                }}
                onConfirm={handleRevoke}
            />

        </div>
    );
};


// Detail row
const DetailRow = ({
    icon,
    label,
    value,
}) => {
    return (
        <div className="flex items-start gap-3">

            <div className="mt-0.5 text-slate-400">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs text-slate-500">
                    {label}
                </p>

                <p className="text-sm font-medium text-slate-800 mt-1 break-all">
                    {value}
                </p>

            </div>

        </div>
    );
};


export default CertificateDetails;
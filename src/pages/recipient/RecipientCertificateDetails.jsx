import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Award,
    Download,
    QrCode,
    Mail,
    CalendarDays,
    BookOpen,
    UserRound,
    Building2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import StatusBadge from "../../components/ui/StatusBadge";

const RecipientCertificateDetails = () => {
    const navigate = useNavigate();
    const { certificateId } = useParams();

    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCertificate = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    "/api/recipient/certificates"
                );

                const certificates = response.data || [];

                const foundCertificate = certificates.find(
                    (certificate) =>
                        certificate.certificateId === certificateId
                );

                if (!foundCertificate) {
                    setError("Certificate not found.");
                    return;
                }

                setCertificate(foundCertificate);

            } catch (err) {
                console.error(
                    "Failed to load certificate:",
                    err
                );

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

    if (error || !certificate) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="text-center">

                    <h2 className="text-xl font-bold text-slate-900">
                        Certificate not found
                    </h2>

                    <p className="mt-2 text-red-600">
                        {error || "Certificate could not be loaded."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/recipient")
                        }
                        className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                        Back to Certificates
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/recipient")
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
                        View your digital certificate information.
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
                                            {formatDate(
                                                certificate.issueDate
                                            )}
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
                                value={formatDate(
                                    certificate.issueDate
                                )}
                            />

                        </div>

                    </section>


                    {/* Institution */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Institution
                        </h2>

                        <div className="mt-5">

                            <DetailRow
                                icon={<Building2 size={17} />}
                                label="Institution Name"
                                value={certificate.institutionName}
                            />

                        </div>

                    </section>


                    {/* QR Code */}
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


                        <div className="mt-5 flex justify-center">

                            {certificate.qrCodeUrl ? (
                                <img
                                    src={certificate.qrCodeUrl}
                                    alt="Certificate QR Code"
                                    className="w-44 h-44 object-contain rounded-xl border border-slate-200"
                                />
                            ) : (
                                <div className="w-44 h-44 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    <QrCode
                                        size={70}
                                        className="text-slate-400"
                                    />
                                </div>
                            )}

                        </div>


                        <button
                            type="button"
                            onClick={handleQrCode}
                            className="mt-4 w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                        >
                            Open QR Code
                        </button>

                    </section>


                    {/* Download */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                        <h2 className="font-semibold text-slate-900">
                            Certificate Actions
                        </h2>

                        <button
                            type="button"
                            onClick={handleDownload}
                            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        >
                            <Download size={17} />
                            Download Certificate
                        </button>

                    </section>

                </div>

            </div>

        </div>
    );
};


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
                    {value || "-"}
                </p>

            </div>

        </div>
    );
};

export default RecipientCertificateDetails;
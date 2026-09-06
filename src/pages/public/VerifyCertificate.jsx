import { useState } from "react";
import { verifyCertificate } from "../../api/certificateApi";
import {
    Search,
    ShieldCheck,
    Award,
    CalendarDays,
    UserRound,
    Building2,
    BookOpen,
    Mail,
    QrCode,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Download,
} from "lucide-react";

import StatusBadge from "../../components/ui/StatusBadge";

const VerifyCertificate = () => {

    const [certificateId, setCertificateId] = useState("");
    const [certificate, setCertificate] = useState(null);

    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =========================
    // VERIFY CERTIFICATE
    // =========================

    const handleVerify = async (e) => {
    e.preventDefault();

    const id = certificateId.trim();

    if (!id) {
        setError("Please enter a certificate ID.");
        setCertificate(null);
        setSearched(true);
        return;
    }

    try {
        setLoading(true);
        setSearched(false);
        setCertificate(null);
        setError("");

        const data = await verifyCertificate(id);

        

        setCertificate(data);
        setSearched(true);

    } catch (err) {
        console.error("Certificate verification failed:", err);

        setCertificate(null);
        setError(
            err.response?.data?.message ||
            err.response?.data ||
            "Certificate not found."
        );
        setSearched(true);

    } finally {
        setLoading(false);
    }
};


    // =========================
    // VIEW CERTIFICATE
    // =========================

    const handleViewCertificate = () => {

        if (!certificate?.pdfUrl) {
            alert("Certificate PDF is not available.");
            return;
        }

        window.open(
            certificate.pdfUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    // =========================
    // OPEN QR
    // =========================

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


    // =========================
    // RESET
    // =========================

    const handleTryAgain = () => {

        setCertificateId("");
        setCertificate(null);
        setError("");
        setSearched(false);

    };


    return (
        <div className="min-h-screen bg-slate-50">

            {/* =========================
                NAVBAR
            ========================= */}

            <header className="bg-slate-950 text-white">

                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                            <Award size={21} />
                        </div>

                        <div>

                            <h1 className="text-lg font-bold">
                                OCVS
                            </h1>

                            <p className="text-xs text-slate-400">
                                Online Certificate Verification System
                            </p>

                        </div>

                    </div>


                    <a
                        href="/login"
                        className="text-sm font-medium text-slate-300 hover:text-white"
                    >
                        Institution Login
                    </a>

                </div>

            </header>


            {/* =========================
                HERO
            ========================= */}

            <section className="bg-slate-950 text-white pb-20">

                <div className="max-w-4xl mx-auto px-6 pt-16 text-center">

                    <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-400/20 flex items-center justify-center">

                        <ShieldCheck
                            size={32}
                            className="text-blue-400"
                        />

                    </div>


                    <h2 className="mt-7 text-4xl md:text-5xl font-bold">
                        Verify a Certificate
                    </h2>


                    <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
                        Verify the authenticity of a digital certificate
                        issued through the OCVS platform.
                    </p>


                    {/* SEARCH */}

                    <form
                        onSubmit={handleVerify}
                        className="mt-10 max-w-2xl mx-auto"
                    >

                        <div className="bg-white rounded-2xl p-2 flex gap-2 shadow-xl">

                            <div className="flex-1 relative">

                                <Search
                                    size={20}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={certificateId}
                                    onChange={(e) =>
                                        setCertificateId(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter certificate ID"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 outline-none"
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Verifying..."
                                    : "Verify"}
                            </button>

                        </div>


                        <p className="text-xs text-slate-500 mt-3">
                            Enter the certificate ID shown on the certificate.
                        </p>

                    </form>

                </div>

            </section>


            {/* =========================
                RESULTS
            ========================= */}

            <main className="max-w-6xl mx-auto px-6 -mt-8 pb-16">


                {/* NOTHING SEARCHED */}

                {!searched && !loading && (

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

                        <QrCode
                            size={50}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-5 text-xl font-semibold text-slate-900">
                            Enter a certificate ID
                        </h3>

                        <p className="mt-2 text-slate-500">
                            The verification result will appear here.
                        </p>

                    </div>

                )}


                {/* LOADING */}

                {loading && (

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                        <h3 className="mt-5 text-xl font-semibold text-slate-900">
                            Verifying certificate...
                        </h3>

                        <p className="mt-2 text-slate-500">
                            Please wait while we check the certificate.
                        </p>

                    </div>

                )}


                {/* ERROR */}

                {searched && !loading && error && (

                    <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-10 text-center">

                        <XCircle
                            size={55}
                            className="mx-auto text-red-500"
                        />

                        <h3 className="mt-5 text-xl font-semibold text-red-700">
                            Certificate Not Found
                        </h3>

                        <p className="mt-2 text-slate-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={handleTryAgain}
                            className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =========================
                    CERTIFICATE RESULT
                ========================= */}

                {searched && !loading && certificate && (

                    <div className="space-y-6">


                        {/* STATUS */}

                        <div
                            className={`rounded-2xl border p-6 ${
                                certificate.status === "ACTIVE"
                                    ? "bg-emerald-50 border-emerald-200"
                                    : "bg-red-50 border-red-200"
                            }`}
                        >

                            <div className="flex items-center justify-between gap-4">

                                <div className="flex items-center gap-4">

                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            certificate.status === "ACTIVE"
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "bg-red-100 text-red-600"
                                        }`}
                                    >

                                        {certificate.status === "ACTIVE" ? (
                                            <CheckCircle2 size={25} />
                                        ) : (
                                            <XCircle size={25} />
                                        )}

                                    </div>


                                    <div>

                                        <p
                                            className={`text-sm font-semibold ${
                                                certificate.status === "ACTIVE"
                                                    ? "text-emerald-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                                            {certificate.status === "ACTIVE"
                                                ? "CERTIFICATE VERIFIED"
                                                : "CERTIFICATE REVOKED"}
                                        </p>


                                        <p className="text-sm text-slate-600 mt-1">

                                            Certificate ID:{" "}

                                            <span className="font-semibold">
                                                {certificate.certificateId}
                                            </span>

                                        </p>

                                    </div>

                                </div>


                                <StatusBadge
                                    status={certificate.status}
                                />

                            </div>

                        </div>


                        {/* INFORMATION + QR */}

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">


                            {/* INFORMATION */}

                            <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">

                                <div className="p-6 border-b border-slate-200">

                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Certificate Information
                                    </h3>

                                </div>


                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <Info
                                        icon={<UserRound size={18} />}
                                        label="Recipient"
                                        value={certificate.recipientName}
                                    />

                                    <Info
                                        icon={<Mail size={18} />}
                                        label="Email"
                                        value={certificate.recipientEmail}
                                    />

                                    <Info
                                        icon={<BookOpen size={18} />}
                                        label="Course"
                                        value={certificate.courseName}
                                    />

                                    <Info
                                        icon={<Award size={18} />}
                                        label="Certificate Title"
                                        value={certificate.certificateTitle}
                                    />

                                    <Info
                                        icon={<CalendarDays size={18} />}
                                        label="Issue Date"
                                        value={certificate.issueDate}
                                    />

                                    <Info
                                        icon={<Building2 size={18} />}
                                        label="Institution"
                                        value={certificate.institutionName}
                                    />

                                </div>


                                {certificate.description && (

                                    <div className="px-6 pb-6">

                                        <div className="p-4 rounded-xl bg-slate-50">

                                            <p className="text-xs text-slate-500">
                                                Description
                                            </p>

                                            <p className="text-sm text-slate-700 mt-2">
                                                {certificate.description}
                                            </p>

                                        </div>

                                    </div>

                                )}

                            </section>


                            {/* VERIFICATION */}

                            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                                <h3 className="text-lg font-semibold text-slate-900">
                                    Verification
                                </h3>


                                {/* QR */}

                                <div className="mt-6 aspect-square rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">

                                    {certificate.qrCodeUrl ? (

                                        <img
                                            src={certificate.qrCodeUrl}
                                            alt="Certificate QR Code"
                                            className="w-full h-full object-contain p-5"
                                        />

                                    ) : (

                                        <div className="text-center">

                                            <QrCode
                                                size={100}
                                                className="mx-auto text-slate-300"
                                            />

                                            <p className="text-xs text-slate-500 mt-4">
                                                QR code not available
                                            </p>

                                        </div>

                                    )}

                                </div>


                                {/* OPEN QR */}

                                {certificate.qrCodeUrl && (

                                    <button
                                        type="button"
                                        onClick={handleQrCode}
                                        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                                    >
                                        <QrCode size={17} />
                                        Open QR Code
                                    </button>

                                )}


                                {/* VIEW */}

                                <button
                                    type="button"
                                    onClick={handleViewCertificate}
                                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                                >
                                    <ExternalLink size={17} />
                                    View Certificate
                                </button>


                                {/* DOWNLOAD */}

                                <button
                                    type="button"
                                    onClick={handleViewCertificate}
                                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                                >
                                    <Download size={17} />
                                    Download Certificate
                                </button>

                            </section>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
};


// =========================
// INFORMATION ROW
// =========================

const Info = ({
    icon,
    label,
    value,
}) => {

    return (

        <div className="flex items-start gap-3">

            <div className="text-slate-400 mt-0.5">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs text-slate-500">
                    {label}
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1 break-words">
                    {value || "-"}
                </p>

            </div>

        </div>

    );
};


export default VerifyCertificate;
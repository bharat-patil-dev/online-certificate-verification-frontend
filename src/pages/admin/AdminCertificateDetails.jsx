import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAdminCertificate,
    revokeAdminCertificate,
} from "../../api/adminApi";

const AdminCertificateDetails = () => {
    const { certificateId } = useParams();
    const navigate = useNavigate();

    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [revoking, setRevoking] = useState(false);

    useEffect(() => {
        loadCertificate();
    }, [certificateId]);

    const loadCertificate = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminCertificate(certificateId);
            setCertificate(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load certificate details.");
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async () => {
        try {
            setRevoking(true);

            await revokeAdminCertificate(certificateId);

            setCertificate((prev) => ({
                ...prev,
                status: "REVOKED"
            }));

            setShowRevokeModal(false);
        } catch (err) {
            console.error(err);
            alert("Failed to revoke certificate.");
        } finally {
            setRevoking(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const openPDF = () => {
        if (certificate?.pdfUrl) {
            window.open(
                certificate.pdfUrl,
                "_blank",
                "noopener,noreferrer"
            );
        }
    };

    const openQR = () => {
        if (certificate?.qrCodeUrl) {
            window.open(
                certificate.qrCodeUrl,
                "_blank",
                "noopener,noreferrer"
            );
        }
    };

    if (loading) {
        return (
            <div style={styles.center}>
                <p>Loading certificate details...</p>
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div style={styles.center}>
                <p style={styles.error}>{error || "Certificate not found."}</p>

                <button
                    style={styles.backButton}
                    onClick={() => navigate("/admin/certificates")}
                >
                    ← Back to Certificates
                </button>
            </div>
        );
    }

    const isRevoked = certificate.status === "REVOKED";

    return (
        <div style={styles.page}>

            {/* Header */}
            <div style={styles.header}>
                <button
                    style={styles.backButton}
                    onClick={() => navigate("/admin/certificates")}
                >
                    ← Back
                </button>

                <h1 style={styles.title}>
                    Certificate Details
                </h1>
            </div>

            {/* Main Card */}
            <div style={styles.card}>

                <div style={styles.topSection}>
                    <div>
                        <h2 style={styles.certificateTitle}>
                            {certificate.certificateTitle || "Certificate"}
                        </h2>

                        <p style={styles.certificateId}>
                            ID: {certificate.certificateId}
                        </p>
                    </div>

                    <span
                        style={{
                            ...styles.status,
                            ...(isRevoked
                                ? styles.revoked
                                : styles.active)
                        }}
                    >
                        {certificate.status}
                    </span>
                </div>

                <hr />

                {/* Certificate Information */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>
                        Certificate Information
                    </h3>

                    <div style={styles.grid}>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Certificate ID
                            </span>
                            <span style={styles.value}>
                                {certificate.certificateId || "-"}
                            </span>
                        </div>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Issue Date
                            </span>
                            <span style={styles.value}>
                                {formatDate(certificate.issueDate)}
                            </span>
                        </div>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Course Name
                            </span>
                            <span style={styles.value}>
                                {certificate.courseName || "-"}
                            </span>
                        </div>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Certificate Title
                            </span>
                            <span style={styles.value}>
                                {certificate.certificateTitle || "-"}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Recipient Information */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>
                        Recipient Information
                    </h3>

                    <div style={styles.grid}>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Recipient Name
                            </span>
                            <span style={styles.value}>
                                {certificate.recipientName || "-"}
                            </span>
                        </div>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Email
                            </span>
                            <span style={styles.value}>
                                {certificate.recipientEmail || "-"}
                            </span>
                        </div>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Institution
                            </span>
                            <span style={styles.value}>
                                {certificate.institutionName || "-"}
                            </span>
                        </div>

                    </div>
                </div>

                {/* QR Code */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>
                        QR Code
                    </h3>

                    {certificate.qrCodeUrl ? (
                        <div style={styles.qrContainer}>
                            <img
                                src={certificate.qrCodeUrl}
                                alt="Certificate QR Code"
                                style={styles.qrImage}
                            />

                            <button
                                style={styles.secondaryButton}
                                onClick={openQR}
                            >
                                Open QR Code
                            </button>
                        </div>
                    ) : (
                        <p>No QR code available.</p>
                    )}
                </div>

                {/* Actions */}
                <div style={styles.actions}>

                    <button
                        style={styles.primaryButton}
                        onClick={openPDF}
                        disabled={!certificate.pdfUrl}
                    >
                        View / Download Certificate
                    </button>

                    {!isRevoked && (
                        <button
                            style={styles.dangerButton}
                            onClick={() => setShowRevokeModal(true)}
                        >
                            Revoke Certificate
                        </button>
                    )}

                    {isRevoked && (
                        <div style={styles.revokedMessage}>
                            This certificate has been revoked.
                        </div>
                    )}

                </div>

            </div>

            {/* Revoke Modal */}
            {showRevokeModal && (
                <div style={styles.modalOverlay}>

                    <div style={styles.modal}>

                        <h2>Revoke Certificate?</h2>

                        <p>
                            Are you sure you want to revoke this certificate?
                            This action will change its status to REVOKED.
                        </p>

                        <div style={styles.modalActions}>

                            <button
                                style={styles.cancelButton}
                                onClick={() => setShowRevokeModal(false)}
                                disabled={revoking}
                            >
                                Cancel
                            </button>

                            <button
                                style={styles.dangerButton}
                                onClick={handleRevoke}
                                disabled={revoking}
                            >
                                {revoking
                                    ? "Revoking..."
                                    : "Yes, Revoke"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

const styles = {
    page: {
        padding: "30px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh"
    },

    header: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "25px"
    },

    title: {
        margin: 0,
        fontSize: "28px"
    },

    backButton: {
        padding: "10px 16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
        cursor: "pointer"
    },

    card: {
        background: "#fff",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        maxWidth: "1000px",
        margin: "0 auto"
    },

    topSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    certificateTitle: {
        margin: 0,
        fontSize: "24px"
    },

    certificateId: {
        color: "#666",
        marginTop: "8px"
    },

    status: {
        padding: "7px 14px",
        borderRadius: "20px",
        fontWeight: "600"
    },

    active: {
        background: "#dcfce7",
        color: "#166534"
    },

    revoked: {
        background: "#fee2e2",
        color: "#991b1b"
    },

    section: {
        marginTop: "30px"
    },

    sectionTitle: {
        marginBottom: "18px",
        fontSize: "18px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "18px"
    },

    infoBox: {
        padding: "15px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px"
    },

    label: {
        display: "block",
        fontSize: "13px",
        color: "#6b7280",
        marginBottom: "6px"
    },

    value: {
        fontWeight: "600",
        color: "#111827"
    },

    qrContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "15px"
    },

    qrImage: {
        width: "180px",
        height: "180px",
        objectFit: "contain",
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "8px"
    },

    actions: {
        display: "flex",
        gap: "15px",
        marginTop: "35px",
        flexWrap: "wrap"
    },

    primaryButton: {
        padding: "12px 20px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },

    secondaryButton: {
        padding: "10px 16px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer"
    },

    dangerButton: {
        padding: "12px 20px",
        background: "#dc2626",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },

    cancelButton: {
        padding: "12px 20px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer"
    },

    revokedMessage: {
        padding: "12px 20px",
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "8px",
        fontWeight: "600"
    },

    center: {
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px"
    },

    error: {
        color: "#dc2626"
    },

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    },

    modal: {
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "450px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    },

    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "25px"
    }
};

export default AdminCertificateDetails;
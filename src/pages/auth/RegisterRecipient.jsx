import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import api from "../../api/axios";

function RegisterRecipient() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (form.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/api/auth/register/recipient",
                {
                    fullName: form.fullName,
                    email: form.email,
                    password: form.password,
                }
            );

            setMessage(
                response.data || "Recipient registered successfully."
            );

            setForm({
                fullName: "",
                email: "",
                password: "",
            });

        } catch (err) {
            setError(
                err.response?.data ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    style={styles.backButton}
                >
                    <ArrowLeft size={18} />
                    Back to Login
                </button>

                <div style={styles.iconContainer}>
                    <User size={32} />
                </div>

                <h1 style={styles.title}>
                    Recipient Registration
                </h1>

                <p style={styles.subtitle}>
                    Create your account to access your certificates.
                </p>

                {message && (
                    <div style={styles.success}>
                        {message}
                    </div>
                )}

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label style={styles.label}>
                        Full Name
                    </label>

                    <div style={styles.inputContainer}>
                        <User size={18} />
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <label style={styles.label}>
                        Email
                    </label>

                    <div style={styles.inputContainer}>
                        <Mail size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <label style={styles.label}>
                        Password
                    </label>

                    <div style={styles.inputContainer}>
                        <Lock size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Minimum 8 characters"
                            value={form.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.submitButton}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Recipient Account"}
                    </button>

                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        padding: "20px",
    },

    card: {
        width: "100%",
        maxWidth: "450px",
        background: "#ffffff",
        padding: "35px",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    },

    backButton: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        border: "none",
        background: "none",
        cursor: "pointer",
        marginBottom: "25px",
        fontSize: "14px",
    },

    iconContainer: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "#eef2ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 15px",
    },

    title: {
        textAlign: "center",
        marginBottom: "8px",
    },

    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "25px",
    },

    label: {
        display: "block",
        marginBottom: "7px",
        marginTop: "16px",
        fontWeight: "500",
    },

    inputContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "0 12px",
    },

    input: {
        width: "100%",
        padding: "12px 0",
        border: "none",
        outline: "none",
        fontSize: "15px",
    },

    submitButton: {
        width: "100%",
        marginTop: "25px",
        padding: "13px",
        border: "none",
        borderRadius: "8px",
        background: "#4f46e5",
        color: "#fff",
        fontSize: "16px",
        cursor: "pointer",
    },

    success: {
        padding: "10px",
        marginBottom: "15px",
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "6px",
        fontSize: "14px",
    },

    error: {
        padding: "10px",
        marginBottom: "15px",
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "6px",
        fontSize: "14px",
    },
};

export default RegisterRecipient;
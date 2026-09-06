import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerInstitution } from "../../api/authApi";

const RegisterInstitution = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        institutionName: "",
        phone: "",
        website: "",
        address: "",
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
        setLoading(true);

        try {
            const response = await registerInstitution(form);

            setMessage(
                typeof response === "string"
                    ? response
                    : "Registration successful. Waiting for admin approval."
            );

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Institution Registration</h1>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <input
                    name="institutionName"
                    placeholder="Institution Name"
                    value={form.institutionName}
                    onChange={handleChange}
                    required
                />

                <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                />

                <input
                    name="website"
                    placeholder="Website"
                    value={form.website}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Registering..."
                        : "Register Institution"}
                </button>
            </form>

            <p>
                Already registered?{" "}
                <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default RegisterInstitution;
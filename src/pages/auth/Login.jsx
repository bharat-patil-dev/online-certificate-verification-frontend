import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setLoading(true);

        try {
            const response = await login(form);

        

            if (response.role === "ADMIN") {
                navigate("/admin");
            } else if (response.role === "INSTITUTION") {
                navigate("/institution");
            } else if (response.role === "RECIPIENT") {
                navigate("/recipient");
            } else {
                setErrorMessage("Unknown user role.");
            }

        } catch (err) {
            console.error("LOGIN ERROR:", err);

            setErrorMessage(
                err.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

                    <div className="text-center mb-8">

                        <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                            <span className="font-bold text-lg">
                                O
                            </span>
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-slate-900">
                            Welcome to OCVS
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Sign in to your account
                        </p>

                    </div>

                    {errorMessage && (
                        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                            <p className="text-sm text-red-700">
                                {errorMessage}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>

                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">

                        Don't have an institution account?{" "}

                        <Link
                            to="/register/institution"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Register
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;
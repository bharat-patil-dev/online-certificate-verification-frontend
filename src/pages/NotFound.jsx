import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

            <div className="w-full max-w-lg text-center">

                <div className="mx-auto w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <AlertTriangle size={38} />
                </div>

                <p className="mt-8 text-7xl font-bold text-slate-900">
                    404
                </p>

                <h1 className="mt-4 text-2xl font-bold text-slate-900">
                    Page not found
                </h1>

                <p className="mt-3 text-slate-500 leading-relaxed">
                    The page you're looking for doesn't exist or may have
                    been moved.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition"
                    >
                        <ArrowLeft size={17} />
                        Go Back
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        <Home size={17} />
                        Go Home
                    </button>

                </div>

            </div>
        </div>
    );
};

export default NotFound;
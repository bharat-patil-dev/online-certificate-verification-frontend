import {
    Clock3,
    ShieldCheck,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApprovalPending = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

            <div className="w-full max-w-lg">

                {/* Logo */}
                <div className="flex justify-center mb-8">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                            <ShieldCheck size={23} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                OCVS
                            </h1>

                            <p className="text-xs text-slate-500">
                                Certificate Verification System
                            </p>
                        </div>

                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center">

                    <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock3 size={32} />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-slate-900">
                        Approval Pending
                    </h2>

                    <p className="mt-3 text-slate-500 leading-relaxed">
                        Your institution registration has been submitted
                        successfully. An administrator needs to review and
                        approve your institution before you can access the
                        institution dashboard.
                    </p>

                    {/* Status */}
                    <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-100">

                        <div className="flex items-center justify-center gap-2">

                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />

                            <span className="text-sm font-semibold text-amber-700">
                                WAITING FOR ADMIN APPROVAL
                            </span>

                        </div>

                    </div>

                    <div className="mt-8 space-y-3">

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            Go to Login
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                        >
                            <ArrowLeft size={17} />
                            Back to Home
                        </button>

                    </div>

                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    OCVS securely manages digital certificates and verification.
                </p>

            </div>
        </div>
    );
};

export default ApprovalPending;
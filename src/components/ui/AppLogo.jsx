import { Award } from "lucide-react";

const AppLogo = ({ dark = false }) => {
    return (
        <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Award size={21} />
            </div>

            <div>
                <h1
                    className={`text-lg font-bold ${
                        dark ? "text-white" : "text-slate-900"
                    }`}
                >
                    OCVS
                </h1>

                <p
                    className={`text-xs ${
                        dark
                            ? "text-slate-400"
                            : "text-slate-500"
                    }`}
                >
                    Certificate Verification System
                </p>
            </div>

        </div>
    );
};

export default AppLogo;
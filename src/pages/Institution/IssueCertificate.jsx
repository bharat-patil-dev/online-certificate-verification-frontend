import { useState } from "react";
import {
    Award,
    ArrowLeft,
    CheckCircle2,
    UserRound,
    BookOpen,
    FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { issueCertificate } from "../../api/certificateApi";

const IssueCertificate = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        recipientName: "",
        recipientEmail: "",
        courseName: "",
        certificateTitle: "",
        description: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [issuedCertificate, setIssuedCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await issueCertificate(form);
            setIssuedCertificate(response);
            setSubmitted(true);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to issue certificate. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">

                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={34} />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-slate-900">
                        Certificate Ready
                    </h1>

                    <p className="mt-3 text-slate-500">
                        {issuedCertificate?.message ||
                            "The certificate has been issued successfully."}
                    </p>

                    <div className="mt-6 p-4 rounded-2xl bg-slate-50 text-left">
                        <p className="text-xs text-slate-500">
                            Certificate ID
                        </p>
                        <p className="font-semibold text-slate-900">
                            {issuedCertificate?.certificateId}
                        </p>

                        <p className="text-xs text-slate-500 mt-4">
                            Recipient
                        </p>
                        <p className="font-semibold text-slate-900">
                            {issuedCertificate?.recipientName}
                        </p>

                        <p className="text-xs text-slate-500 mt-4">
                            Course
                        </p>
                        <p className="font-semibold text-slate-900">
                            {issuedCertificate?.courseName}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/institution/certificates")}
                        className="mt-8 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                        View Certificates
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
                    onClick={() => navigate("/institution")}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
                >
                    <ArrowLeft size={19} />
                </button>

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Issue Certificate
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Create a new digital certificate for a recipient.
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Form */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">

                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Certificate Information
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Enter the recipient and certificate details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">

                        {/* Recipient */}
                        <div className="mb-8">

                            <div className="flex items-center gap-2 mb-5">
                                <UserRound size={18} className="text-blue-600" />
                                <h3 className="font-semibold text-slate-900">
                                    Recipient Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <FormInput
                                    label="Recipient Name"
                                    name="recipientName"
                                    placeholder="Enter recipient name"
                                    value={form.recipientName}
                                    onChange={handleChange}
                                    required
                                />

                                <FormInput
                                    label="Recipient Email"
                                    name="recipientEmail"
                                    type="email"
                                    placeholder="Enter recipient email"
                                    value={form.recipientEmail}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                        {/* Course */}
                        <div className="mb-8">

                            <div className="flex items-center gap-2 mb-5">
                                <BookOpen size={18} className="text-blue-600" />
                                <h3 className="font-semibold text-slate-900">
                                    Course Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <FormInput
                                    label="Course Name"
                                    name="courseName"
                                    placeholder="Enter course name"
                                    value={form.courseName}
                                    onChange={handleChange}
                                    required
                                />

                                <FormInput
                                    label="Certificate Title"
                                    name="certificateTitle"
                                    placeholder="Enter certificate title"
                                    value={form.certificateTitle}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                        {/* Description */}
                        <div>

                            <div className="flex items-center gap-2 mb-5">
                                <FileText size={18} className="text-blue-600" />
                                <h3 className="font-semibold text-slate-900">
                                    Additional Information
                                </h3>
                            </div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Enter certificate description..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {error && (
                            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => navigate("/institution")}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Award size={17} />
                                {loading ? "Issuing..." : "Issue Certificate"}
                            </button>

                        </div>

                    </form>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-fit">

                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Preview
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Certificate preview
                        </p>
                    </div>

                    <div className="p-6">

                        <div className="aspect-[1.414/1] rounded-xl border-4 border-slate-200 bg-slate-50 p-5 flex flex-col items-center justify-center text-center">

                            <Award
                                size={32}
                                className="text-blue-600"
                            />

                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mt-4">
                                Certificate of Completion
                            </p>

                            <p className="text-xs text-slate-500 mt-6">
                                This certifies that
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 mt-2">
                                {form.recipientName || "Recipient Name"}
                            </h3>

                            <p className="text-xs text-slate-500 mt-4">
                                has successfully completed
                            </p>

                            <h4 className="font-semibold text-blue-700 mt-2">
                                {form.courseName || "Course Name"}
                            </h4>

                            <div className="w-full border-t border-slate-200 mt-6 pt-4">
                                <p className="text-xs text-slate-500">
                                    {form.certificateTitle ||
                                        "Certificate Title"}
                                </p>
                            </div>

                        </div>

                        <div className="mt-5 p-4 rounded-xl bg-blue-50">
                            <p className="text-xs text-blue-700 leading-relaxed">
                                The actual PDF certificate, unique certificate
                              The certificate ID, PDF and QR code will be generated automatically after issuance.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

const FormInput = ({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
}) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
        </label>

        <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
    </div>
);

export default IssueCertificate;
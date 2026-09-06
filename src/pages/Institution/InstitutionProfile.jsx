import { useEffect, useRef, useState } from "react";
import {
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Pencil,
    ShieldCheck,
    Upload,
    Loader2,
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";
import StatusBadge from "../../components/ui/StatusBadge";

import {
    getInstitutionProfile,
    uploadInstitutionLogo,
} from "../../api/institutionApi";

const InstitutionProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadError, setUploadError] = useState("");

    const fileInputRef = useRef(null);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getInstitutionProfile();

            

            setProfile(data);
        } catch (err) {
            console.error(
                "Failed to load institution profile:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load institution profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleLogoChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploadMessage("");
        setUploadError("");

        if (!file.type.startsWith("image/")) {
            setUploadError(
                "Please select a valid image file."
            );
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setUploadError(
                "Logo image must be smaller than 5 MB."
            );
            event.target.value = "";
            return;
        }

        try {
            setUploading(true);

            const response =
                await uploadInstitutionLogo(file);

            console.log(
                "Logo upload response:",
                response
            );

            setUploadMessage(
                "Institution logo uploaded successfully."
            );

            await loadProfile();
        } catch (err) {
            console.error(
                "Logo upload failed:",
                err
            );

            setUploadError(
                err.response?.data?.message ||
                "Failed to upload institution logo."
            );
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    if (loading) {
        return (
            <AppLayout
                role="INSTITUTION"
                activeItem="Institution Profile"
                userName={
                    profile?.fullName ||
                    "Institution"
                }
            >
                <LoadingSpinner
                    message="Loading institution profile..."
                />
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout
                role="INSTITUTION"
                activeItem="Institution Profile"
                userName="Institution"
            >
                <ErrorState
                    title="Unable to load profile"
                    message={error}
                    onRetry={loadProfile}
                />
            </AppLayout>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <AppLayout
            role="INSTITUTION"
            activeItem="Institution Profile"
            userName={profile.fullName}
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Institution Profile
                </h1>

                <p className="mt-2 text-slate-500">
                    View your institution information and account status.
                </p>
            </div>

            {/* Upload success */}
            {uploadMessage && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <p className="text-sm font-medium text-emerald-700">
                        {uploadMessage}
                    </p>
                </div>
            )}

            {/* Upload error */}
            {uploadError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-700">
                        {uploadError}
                    </p>
                </div>
            )}

            {/* Main content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Profile summary */}
                <section className="xl:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                    <div className="flex flex-col items-center text-center">

                        {/* Logo */}
                        <div className="w-24 h-24 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center overflow-hidden">

                            {profile.logoUrl ? (
                                <img
                                    src={profile.logoUrl}
                                    alt="Institution logo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building2 size={38} />
                            )}

                        </div>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleLogoChange}
                            className="hidden"
                        />

                        {/* Change logo button */}
                        <button
                            type="button"
                            onClick={handleLogoClick}
                            disabled={uploading}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    Change Logo
                                </>
                            )}
                        </button>

                        <p className="mt-2 text-xs text-slate-400">
                            PNG, JPG or WEBP • Max 5 MB
                        </p>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            {profile.institutionName}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {profile.email}
                        </p>

                        <div className="mt-4">
                            <StatusBadge
                                status={profile.status}
                            />
                        </div>
                    </div>

                    {/* Institution ID */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-xs text-slate-500">
                            Institution ID
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                            #{profile.institutionId}
                        </p>
                    </div>

                </section>

                {/* Details */}
                <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">

                    <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4">

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Institution Information
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Information associated with your institution account.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Pencil size={16} />
                            Edit
                        </button>

                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        <InfoRow
                            icon={<Building2 size={18} />}
                            label="Institution Name"
                            value={profile.institutionName}
                        />

                        <InfoRow
                            icon={<ShieldCheck size={18} />}
                            label="Account Status"
                            value={profile.status}
                        />

                        <InfoRow
                            icon={<Mail size={18} />}
                            label="Email"
                            value={profile.email}
                        />

                        <InfoRow
                            icon={<Phone size={18} />}
                            label="Phone"
                            value={profile.phone}
                        />

                        <InfoRow
                            icon={<Globe size={18} />}
                            label="Website"
                            value={profile.website}
                            link
                        />

                        <InfoRow
                            icon={<MapPin size={18} />}
                            label="Address"
                            value={profile.address}
                        />

                        <InfoRow
                            icon={<Building2 size={18} />}
                            label="Contact Person"
                            value={profile.fullName}
                        />

                    </div>

                </section>

            </div>
        </AppLayout>
    );
};

const InfoRow = ({
    icon,
    label,
    value,
    link = false,
}) => {
    return (
        <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs text-slate-500">
                    {label}
                </p>

                {link && value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="block mt-1 text-sm font-medium text-blue-600 hover:underline break-all"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="mt-1 text-sm font-medium text-slate-800 break-all">
                        {value || "Not provided"}
                    </p>
                )}

            </div>

        </div>
    );
};

export default InstitutionProfile;
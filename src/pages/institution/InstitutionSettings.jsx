import { useEffect, useState } from "react";
import {
    User,
    Shield,
    Bell,
    Trash2,
    Save,
    CheckCircle2,
    Eye,
    EyeOff,
} from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const InstitutionSettings = () => {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState("account");

    const [account, setAccount] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const loadAccountDetails = async () => {
            try {
                const response = await api.get(
                    "/api/institution/profile"
                );

                const profile = response.data;

                setAccount({
                    fullName:
                        user?.fullName ||
                        profile.userFullName ||
                        profile.fullName ||
                        "",
                    email:
                        user?.email ||
                        "",
                    phone:
                        profile.phone ||
                        "",
                });
            } catch (error) {
                console.error(
                    "Failed to load institution profile:",
                    error
                );

                if (user) {
                    setAccount({
                        fullName: user.fullName || "",
                        email: user.email || "",
                        phone: "",
                    });
                }
            }
        };

        loadAccountDetails();
    }, [user]);

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [notifications, setNotifications] = useState({
        certificateIssued: true,
        certificateRevoked: true,
        institutionUpdates: true,
        securityAlerts: true,
    });

    const [saved, setSaved] = useState(false);

    const handleAccountChange = (e) => {
        setAccount({
            ...account,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };

    const tabs = [
        {
            id: "account",
            label: "Account",
            icon: User,
        },
        {
            id: "security",
            label: "Security",
            icon: Shield,
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
        },
        {
            id: "danger",
            label: "Danger Zone",
            icon: Trash2,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="mb-8">

                <h1 className="text-3xl font-bold text-slate-900">
                    Settings
                </h1>

                <p className="mt-2 text-slate-500">
                    Manage your account, security and notification preferences.
                </p>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Sidebar */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 h-fit">

                    {tabs.map((tab) => {
                        const Icon = tab.icon;

                        const active =
                            activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() =>
                                    setActiveTab(tab.id)
                                }
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition mb-1 ${active
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}

                </div>

                {/* Content */}
                <div className="lg:col-span-3">

                    {/* SUCCESS */}
                    {saved && (
                        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">

                            <CheckCircle2 size={18} />

                            <p className="text-sm font-medium">
                                Changes saved successfully.
                            </p>

                        </div>
                    )}

                    {/* ACCOUNT */}
                    {activeTab === "account" && (
                        <SettingsCard
                            title="Account Settings"
                            description="Manage your personal account information."
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <FormField
                                    label="Full Name"
                                    name="fullName"
                                    value={account.fullName}
                                    onChange={handleAccountChange}
                                />

                                <FormField
                                    label="Phone"
                                    name="phone"
                                    value={account.phone}
                                    onChange={handleAccountChange}
                                />

                                <div className="md:col-span-2">
                                    <FormField
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={account.email}
                                        onChange={handleAccountChange}
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        Email changes may require verification.
                                    </p>
                                </div>

                            </div>

                            <SaveButton onClick={handleSave} />

                        </SettingsCard>
                    )}

                    {/* SECURITY */}
                    {activeTab === "security" && (
                        <SettingsCard
                            title="Security"
                            description="Update your password and protect your account."
                        >

                            <div className="space-y-6">

                                <PasswordField
                                    label="Current Password"
                                    name="currentPassword"
                                    value={password.currentPassword}
                                    onChange={handlePasswordChange}
                                    visible={showCurrentPassword}
                                    onToggle={() =>
                                        setShowCurrentPassword(
                                            !showCurrentPassword
                                        )
                                    }
                                />

                                <PasswordField
                                    label="New Password"
                                    name="newPassword"
                                    value={password.newPassword}
                                    onChange={handlePasswordChange}
                                    visible={showNewPassword}
                                    onToggle={() =>
                                        setShowNewPassword(
                                            !showNewPassword
                                        )
                                    }
                                />

                                <PasswordField
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    value={password.confirmPassword}
                                    onChange={handlePasswordChange}
                                    visible={showConfirmPassword}
                                    onToggle={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                />

                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">

                                <p className="text-sm font-semibold text-blue-800">
                                    Password requirements
                                </p>

                                <p className="text-xs text-blue-700 mt-2">
                                    Use at least 8 characters with a combination
                                    of letters, numbers and special characters.
                                </p>

                            </div>

                            <SaveButton
                                label="Update Password"
                                onClick={handleSave}
                            />

                        </SettingsCard>
                    )}

                    {/* NOTIFICATIONS */}
                    {activeTab === "notifications" && (
                        <SettingsCard
                            title="Notification Preferences"
                            description="Choose which notifications you want to receive."
                        >

                            <div className="divide-y divide-slate-100">

                                <NotificationRow
                                    title="Certificate Issued"
                                    description="Notify me when a certificate is successfully issued."
                                    checked={
                                        notifications.certificateIssued
                                    }
                                    onChange={() =>
                                        setNotifications({
                                            ...notifications,
                                            certificateIssued:
                                                !notifications.certificateIssued,
                                        })
                                    }
                                />

                                <NotificationRow
                                    title="Certificate Revoked"
                                    description="Notify me when a certificate is revoked."
                                    checked={
                                        notifications.certificateRevoked
                                    }
                                    onChange={() =>
                                        setNotifications({
                                            ...notifications,
                                            certificateRevoked:
                                                !notifications.certificateRevoked,
                                        })
                                    }
                                />

                                <NotificationRow
                                    title="Institution Updates"
                                    description="Receive important updates about your institution."
                                    checked={
                                        notifications.institutionUpdates
                                    }
                                    onChange={() =>
                                        setNotifications({
                                            ...notifications,
                                            institutionUpdates:
                                                !notifications.institutionUpdates,
                                        })
                                    }
                                />

                                <NotificationRow
                                    title="Security Alerts"
                                    description="Receive alerts about suspicious or important account activity."
                                    checked={
                                        notifications.securityAlerts
                                    }
                                    onChange={() =>
                                        setNotifications({
                                            ...notifications,
                                            securityAlerts:
                                                !notifications.securityAlerts,
                                        })
                                    }
                                />

                            </div>

                            <SaveButton onClick={handleSave} />

                        </SettingsCard>
                    )}

                    {/* DANGER ZONE */}
                    {activeTab === "danger" && (
                        <div className="bg-white rounded-2xl border border-red-200 shadow-sm">

                            <div className="p-6 border-b border-red-100">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                        <Trash2 size={19} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Danger Zone
                                        </h2>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Irreversible account actions.
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="p-6">

                                <div className="p-5 rounded-xl border border-red-200 bg-red-50">

                                    <h3 className="font-semibold text-red-800">
                                        Delete institution account
                                    </h3>

                                    <p className="text-sm text-red-700 mt-2 leading-relaxed">
                                        Deleting the account may remove access
                                        to your institution dashboard and its
                                        associated information. This action
                                        cannot be undone.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            alert(
                                                "Delete account functionality is not available yet.")
                                        }
                                        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                                    >
                                        <Trash2 size={16} />
                                        Delete Account
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

const SettingsCard = ({
    title,
    description,
    children,
}) => {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            <div className="p-6 border-b border-slate-200">

                <h2 className="text-lg font-semibold text-slate-900">
                    {title}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    {description}
                </p>

            </div>

            <div className="p-6">
                {children}
            </div>

        </section>
    );
};

const FormField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
}) => {
    return (
        <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

        </div>
    );
};

const PasswordField = ({
    label,
    name,
    value,
    onChange,
    visible,
    onToggle,
}) => {
    return (
        <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <div className="relative">

                <input
                    type={visible ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                    {visible ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>

            </div>

        </div>
    );
};

const NotificationRow = ({
    title,
    description,
    checked,
    onChange,
}) => {
    return (
        <div className="py-5 flex items-center justify-between gap-5">

            <div>
                <p className="text-sm font-semibold text-slate-900">
                    {title}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                    {description}
                </p>
            </div>

            <button
                type="button"
                onClick={onChange}
                className={`relative shrink-0 w-11 h-6 rounded-full transition ${checked
                        ? "bg-blue-600"
                        : "bg-slate-300"
                    }`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition ${checked
                            ? "left-6"
                            : "left-1"
                        }`}
                />
            </button>

        </div>
    );
};

const SaveButton = ({
    onClick,
    label = "Save Changes",
}) => {
    return (
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">

            <button
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
                <Save size={17} />
                {label}
            </button>

        </div>
    );
};

export default InstitutionSettings;
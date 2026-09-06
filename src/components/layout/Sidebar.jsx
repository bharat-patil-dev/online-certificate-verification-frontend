import {
    LayoutDashboard,
    Award,
    Settings,
    LogOut,
    Building2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Sidebar = ({
    role = "INSTITUTION",
    activeItem = "Dashboard",
    mobileOpen = false,
    onClose,
}) => {
    const navigate = useNavigate();

    const institutionItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/institution",
        },
        {
            label: "Certificates",
            icon: Award,
            path: "/institution/certificates",
        },
        {
            label: "Institution Profile",
            icon: Building2,
            path: "/institution/profile",
        },
        {
            label: "Settings",
            icon: Settings,
            path: "/institution/settings",
        },
    ];

    const adminItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin",
        },
        {
            label: "Institutions",
            icon: Building2,
            path: "/admin/institutions",
        },
        {
            label: "Certificates",
            icon: Award,
            path: "/admin/certificates",
        },
        {
            label: "Settings",
            icon: Settings,
            path: "/admin/settings",
        },
    ];

    const items =
        role === "ADMIN"
            ? adminItems
            : institutionItems;

    const handleNavigation = (path) => {
        navigate(path);

        if (onClose) {
            onClose();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-64 bg-slate-950 text-white
                    flex flex-col
                    transform transition-transform duration-300
                    lg:static lg:translate-x-0
                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {/* Logo */}
                <div className="h-20 px-6 flex items-center border-b border-slate-800">
                    <div>
                        <h1 className="text-xl font-bold">
                            OCVS
                        </h1>

                        <p className="text-xs text-slate-400">
                            Certificate Verification
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

                    {items.map((item) => {
                        const Icon = item.icon;

                        const active =
                            activeItem === item.label;

                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() =>
                                    handleNavigation(item.path)
                                }
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                                    active
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}

                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-800">

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
                    >
                        <LogOut size={19} />
                        <span>Logout</span>
                    </button>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
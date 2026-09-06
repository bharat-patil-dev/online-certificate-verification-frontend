import {
    Bell,
    ChevronDown,
    Menu,
    Settings,
    LogOut,
    User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Topbar = ({
    userName,
    role = "INSTITUTION",
    onMenuClick,
}) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [displayName, setDisplayName] = useState(userName || "");
    const [logoUrl, setLogoUrl] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        const loadUserDetails = async () => {
            // Institution gets its real profile from backend
            if (role === "INSTITUTION") {
                try {
                    const response = await api.get(
                        "/api/institution/profile"
                    );

                    const profile = response.data;

                    setDisplayName(
                        profile.institutionName ||
                        profile.userFullName ||
                        profile.fullName ||
                        ""
                    );

                    setLogoUrl(profile.logoUrl || "");
                } catch (error) {
                    console.error(
                        "Failed to load institution profile:",
                        error
                    );
                }
            } else {
                // Admin / other roles use the real name
                // supplied by AuthContext through AppLayout.
                setDisplayName(userName || "");
            }
        };

        loadUserDetails();
    }, [role, userName]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setShowUserMenu(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const initials = displayName
        ? displayName
              .split(" ")
              .filter(Boolean)
              .map((name) => name[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "IN";

    const handleSettings = () => {
        setShowUserMenu(false);

        if (role === "ADMIN") {
            navigate("/admin/settings");
        } else if (role === "INSTITUTION") {
            navigate("/institution/settings");
        }
    };

    const handleProfile = () => {
        setShowUserMenu(false);

        if (role === "INSTITUTION") {
            navigate("/institution/profile");
        }
    };

    const handleLogout = () => {
        setShowUserMenu(false);
        setShowNotifications(false);

        logout();
        navigate("/login");
    };

    return (
        <header className="h-20 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

            <div className="flex items-center gap-3">

                {/* Mobile menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                    <Menu
                        size={22}
                        className="text-gray-700"
                    />
                </button>

                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Dashboard
                    </h2>

                    <p className="hidden sm:block text-sm text-gray-500">
                        Manage your certificate operations
                    </p>
                </div>

            </div>

            <div className="flex items-center gap-3 sm:gap-5">

                {/* Notifications */}
                <div
                    className="relative"
                    ref={notificationRef}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setShowNotifications(
                                !showNotifications
                            );
                            setShowUserMenu(false);
                        }}
                        className="relative p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Notifications"
                    >
                        <Bell
                            size={20}
                            className="text-gray-600"
                        />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50">

                            <div className="px-4 py-3 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Notifications
                                </h3>
                            </div>

                            <div className="px-4 py-8 text-center">
                                <Bell
                                    size={28}
                                    className="mx-auto mb-2 text-gray-300"
                                />

                                <p className="text-sm text-gray-500">
                                    No new notifications
                                </p>
                            </div>

                        </div>
                    )}
                </div>

                <div className="hidden sm:block h-8 w-px bg-gray-200" />

                {/* User / Institution */}
                <div
                    className="relative"
                    ref={userMenuRef}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setShowUserMenu(!showUserMenu);
                            setShowNotifications(false);
                        }}
                        className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition"
                    >

                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={
                                    displayName ||
                                    "Institution logo"
                                }
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                                {initials}
                            </div>
                        )}

                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-gray-900">
                                {displayName || "User"}
                            </p>

                            <p className="text-xs text-gray-500">
                                {role}
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            className={`hidden md:block text-gray-500 transition-transform ${
                                showUserMenu
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />

                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">

                            <div className="px-4 py-3 border-b border-gray-200">
                                <p className="text-sm font-semibold text-gray-900">
                                    {displayName || "User"}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    {role}
                                </p>
                            </div>

                            <div className="p-2">

                                {role === "INSTITUTION" && (
                                    <button
                                        type="button"
                                        onClick={handleProfile}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 text-left"
                                    >
                                        <User size={17} />
                                        Profile
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleSettings}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 text-left"
                                >
                                    <Settings size={17} />
                                    Settings
                                </button>

                                <div className="my-2 border-t border-gray-100" />

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 text-left"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>

                            </div>

                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Topbar;
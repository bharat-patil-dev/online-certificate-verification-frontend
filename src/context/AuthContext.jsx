import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/authApi";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {

        const response = await loginUser(credentials);

        localStorage.setItem("token", response.token);

        const userData = {
            email: response.email,
            fullName: response.fullName,
            role: response.role,
        };

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);

        return response;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};
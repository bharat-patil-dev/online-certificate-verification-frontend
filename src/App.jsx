import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import RegisterInstitution from "./pages/auth/RegisterInstitution";
import RegisterRecipient from "./pages/auth/RegisterRecipient";
import ApprovalPending from "./pages/auth/ApprovalPending";

// Institution
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";
import InstitutionProfile from "./pages/institution/InstitutionProfile";
import IssueCertificate from "./pages/institution/IssueCertificate";
import Certificates from "./pages/institution/Certificates";
import CertificateDetails from "./pages/institution/CertificateDetails";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInstitutions from "./pages/admin/AdminInstitutions";
import AdminInstitutionDetails from "./pages/admin/AdminInstitutionDetails";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminCertificateDetails from "./pages/admin/AdminCertificateDetails";

// Recipient
import RecipientDashboard from "./pages/recipient/RecipientDashboard";
import RecipientCertificateDetails from "./pages/recipient/RecipientCertificateDetails";

// Public
import VerifyCertificate from "./pages/public/VerifyCertificate";

// Common
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/RouteProtected";

import InstitutionSettings from "./pages/Institution/InstitutionSettings";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ==================== AUTH ==================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register/institution"
                    element={<RegisterInstitution />}
                />

                <Route
                    path="/register/recipient"
                    element={<RegisterRecipient />}
                />

                <Route
                    path="/approval-pending"
                    element={<ApprovalPending />}
                />


                {/* ==================== INSTITUTION ==================== */}

                <Route
                    path="/institution"
                    element={
                        <ProtectedRoute
                            allowedRoles={["INSTITUTION"]}
                        >
                            <InstitutionDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/institution/profile"
                    element={
                        <ProtectedRoute
                            allowedRoles={["INSTITUTION"]}
                        >
                            <InstitutionProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/institution/certificates"
                    element={
                        <ProtectedRoute
                            allowedRoles={["INSTITUTION"]}
                        >
                            <Certificates />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/institution/certificates/issue"
                    element={
                        <ProtectedRoute
                            allowedRoles={["INSTITUTION"]}
                        >
                            <IssueCertificate />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/institution/certificates/:certificateId"
                    element={
                        <ProtectedRoute
                            allowedRoles={["INSTITUTION"]}
                        >
                            <CertificateDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/institution/settings"
                    element={
                        <ProtectedRoute
                            allowedRoles={["INSTITUTION"]}
                        >
                            <InstitutionSettings />
                        </ProtectedRoute>
                    }
                />


                {/* ==================== ADMIN ==================== */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/institutions"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminInstitutions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/institutions/:institutionId"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminInstitutionDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/certificates"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminCertificates />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/certificates/:certificateId"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminCertificateDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminSettings />
                        </ProtectedRoute>
                    }
                />


                {/* ==================== RECIPIENT ==================== */}

                <Route
                    path="/recipient"
                    element={
                        <ProtectedRoute
                            allowedRoles={["RECIPIENT"]}
                        >
                            <RecipientDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recipient/certificates/:certificateId"
                    element={
                        <ProtectedRoute
                            allowedRoles={["RECIPIENT"]}
                        >
                            <RecipientCertificateDetails />
                        </ProtectedRoute>
                    }
                />


                {/* ==================== PUBLIC ==================== */}

                <Route
                    path="/verify"
                    element={<VerifyCertificate />}
                />


                {/* ==================== 404 ==================== */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
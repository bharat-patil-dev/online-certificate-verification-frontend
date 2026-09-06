import api from "./axios";

export const getAllInstitutions = async () => {
    const response = await api.get(
        "/api/admin/institutions"
    );

    return response.data;
};

export const getPendingInstitutions = async () => {
    const response = await api.get(
        "/api/admin/institutions/pending"
    );

    return response.data;
};

export const getInstitutionById = async (institutionId) => {
    const response = await api.get(
        `/api/admin/institutions/${institutionId}`
    );

    return response.data;
};

export const approveInstitution = async (institutionId) => {
    const response = await api.put(
        `/api/admin/institutions/${institutionId}/approve`
    );

    return response.data;
};

export const rejectInstitution = async (institutionId) => {
    const response = await api.put(
        `/api/admin/institutions/${institutionId}/reject`
    );

    return response.data;
};

export const getAllCertificates = async () => {
    const response = await api.get(
        "/api/admin/certificates"
    );

    return response.data;
};

export const getAdminCertificate = async (certificateId) => {
    const response = await api.get(
        `/api/admin/certificates/${certificateId}`
    );

    return response.data;
};

export const revokeAdminCertificate = async (certificateId) => {
    const response = await api.put(
        `/api/admin/certificates/${certificateId}/revoke`
    );

    return response.data;
};

    
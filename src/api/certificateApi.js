import api from "./axios";

export const issueCertificate = async (data) => {
    const response = await api.post(
        "/api/institution/certificates/issue",
        data
    );

    return response.data;
};

export const getInstitutionCertificates = async () => {
    const response = await api.get(
        "/api/institution/certificates"
    );

    return response.data;
};

export const revokeCertificate = async (certificateId) => {
    const response = await api.put(
        `/api/institution/certificates/${certificateId}/revoke`
    );

    return response.data;
};

export const getCertificateById = async (certificateId) => {
    const response = await api.get(
        `/api/institution/certificates/${certificateId}`
    );

    return response.data;
};

export const verifyCertificate = async (certificateId) => {
    const response = await api.get(
        `/api/public/certificates/verify/${certificateId}`
    );

    return response.data;
};

export const getRecipientCertificates = async () => {
    const response = await api.get(
        "/api/recipient/certificates"
    );

    return response.data;
};
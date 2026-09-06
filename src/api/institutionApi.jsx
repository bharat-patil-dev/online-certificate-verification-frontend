import api from "./axios";

export const getInstitutionProfile = async () => {
    const response = await api.get(
        "/api/institution/profile"
    );

    return response.data;
};

export const uploadInstitutionLogo = async (file) => {
    const formData = new FormData();

    formData.append("logo", file);

    const response = await api.post(
        "/api/institution/logo",
        formData
    );

    return response.data;
};
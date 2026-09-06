import api from "./axios";

export const loginUser = async (data) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
};

export const registerInstitution = async (data) => {
    const response = await api.post(
        "/api/auth/register/institution",
        data
    );

    return response.data;
};
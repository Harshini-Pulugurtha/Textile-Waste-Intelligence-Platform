import API from "./api";

export const getAnalysisHistory = async () => {
    const token = localStorage.getItem("token");

    return API.get("/analysis/history", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const deleteAnalysis = async (id) => {
    const token = localStorage.getItem("token");

    return API.delete(`/analysis/history/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
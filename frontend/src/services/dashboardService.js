import API from "./api";

export const getDashboardStats = async () => {

    const token = localStorage.getItem("token");

    return API.get("/dashboard/stats", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

};
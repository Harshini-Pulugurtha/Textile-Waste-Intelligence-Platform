// import API from "./api";

// export const getDashboardStats = async () => {

//     const token = localStorage.getItem("token");

//     return API.get("/dashboard/stats", {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     });

// };
import API from "./api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Inventory Dashboard
export const getDashboardStats = async () => {
    return API.get("/dashboard/stats", getAuthHeaders());
};

// AI Dashboard Statistics
export const getAnalysisStats = async () => {
    return API.get("/dashboard/analysis-stats", getAuthHeaders());
};


// Waste Distribution
export const getWasteDistribution = async () => {
    return API.get("/dashboard/waste-distribution", getAuthHeaders());
};
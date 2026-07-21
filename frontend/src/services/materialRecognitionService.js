import API from "./api";

export const analyzeTextileImage = async (imageFile) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await API.post(
        "/classification/predict",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response;
};
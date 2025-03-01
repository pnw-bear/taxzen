const API_URL = "https://taxzen-backend-production.up.railway.app/"

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    return response.json();
}

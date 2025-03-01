const API_URL = "http://localhost:4000"; // Change to Railway URL when deployed

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    return response.json();
}

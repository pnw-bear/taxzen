const API_URL = "https://taxzen-backend-production.up.railway.app"

// ✅ Upload a file to Supabase
export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData,
        });

        return await response.json();
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "File upload failed." };
    }
}

// ✅ Analyze tax data using AI
export async function analyzeTax(data) {
    try {
        const response = await fetch(`${API_URL}/analyze-tax`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        return await response.json();
    } catch (error) {
        console.error("Tax analysis error:", error);
        return { error: "Tax analysis failed." };
    }
}

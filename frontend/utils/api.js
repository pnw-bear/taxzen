const API_URL = "https://taxzen-backend-production.up.railway.app"

export async function processTaxDocs(files) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
        const response = await fetch(`${API_URL}/process-tax-docs`, {
            method: "POST",
            body: formData,
        });

        return await response.json();
    } catch (error) {
        console.error("Processing error:", error);
        return { error: "Failed to process tax documents." };
    }
}

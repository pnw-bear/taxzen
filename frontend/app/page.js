"use client";

import { useState } from "react";
import { uploadFile, analyzeTax } from "../utils/api";

export default function Home() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [analysis, setAnalysis] = useState("");

    // Handle file selection
    const handleFileChange = (e) => setFile(e.target.files[0]);

    // Upload file and trigger AI tax analysis
    const handleUploadAndAnalyze = async () => {
        if (!file) return alert("Please select a file");

        // ✅ Step 1: Upload the file
        setUploadStatus("Uploading...");
        const uploadResult = await uploadFile(file);

        if (uploadResult.error) {
            setUploadStatus("Upload failed: " + uploadResult.error);
            return;
        }
        setUploadStatus("✅ File uploaded successfully!");

        // ✅ Step 2: Process the tax document using AI
        setAnalysis("Processing tax insights...");
        const taxData = { income: "100000", deductions: "20000", stockSales: "5000" }; // This should be extracted from the uploaded file in a future enhancement
        const analysisResult = await analyzeTax(taxData);

        if (analysisResult.error) {
            setAnalysis("Analysis failed: " + analysisResult.error);
        } else {
            setAnalysis(analysisResult.analysis || "No insights generated.");
        }
    };

    return (
        <div>
            <h1>Welcome to TaxZen</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUploadAndAnalyze}>Upload & Analyze</button>
            <p>Upload Status: {uploadStatus}</p>
            <p>AI Tax Insights: {analysis}</p>
        </div>
    );
}

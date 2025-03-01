"use client";

import { useState } from "react";
import { uploadFile } from "../utils/api";

export default function Home() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!file) return alert("Please select a file");

        const result = await uploadFile(file);
        setUploadStatus(result.message || "Upload failed");
    };

    return (
        <div>
            <h1>Welcome to TaxZen</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Tax Document</button>
            <p>Upload Status: {uploadStatus}</p>
        </div>
    );
}

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

// ✅ Connect to Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("❌ Missing Supabase environment variables!");
}

// ✅ Configure Multer for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ File Upload API Endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const fileExt = req.file.originalname.split('.').pop(); // Get file extension
        const filePath = `uploads/${Date.now()}.${fileExt}`; // Unique filename

        console.log("Uploading file:", filePath); // Debugging log

        // ✅ Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from("tax-docs")
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype
            });

        if (error) {
            console.error("Supabase Upload Error:", error);
            return res.status(500).json({ error: "Failed to upload file to Supabase" });
        }

        res.json({ message: "File uploaded successfully", url: data.path });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));

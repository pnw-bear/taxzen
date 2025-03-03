const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const OpenAI = require("openai");
const xlsx = require("xlsx");
const csvParser = require("csv-parser");
const stream = require("stream");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/process-tax-docs", upload.array("files"), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        let extractedData = [];

        for (const file of req.files) {
            console.log(`Processing file: ${file.originalname}, Type: ${file.mimetype}`);

            if (file.mimetype === "application/pdf") {
                const text = await pdfParse(file.buffer);
                extractedData.push(text.text);
            } else if (file.mimetype.startsWith("image/")) {
                const { data: { text } } = await Tesseract.recognize(file.buffer, "eng");
                extractedData.push(text);
            } else if (file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel") {
                const csvData = await parseCSV(file.buffer);
                extractedData.push(csvData);
            } else if (
                file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                file.mimetype === "application/vnd.ms-excel.sheet.macroEnabled.12"
            ) {
                const excelData = await parseExcel(file.buffer);
                extractedData.push(excelData);
            } else {
                extractedData.push(file.buffer.toString("utf-8"));
            }
        }

        console.log("Extracted Tax Data:", extractedData);

        const prompt = `Based on the extracted tax documents, generate a structured JSON response:
        {
            "total_taxable_income": "Calculated total taxable income",
            "estimated_tax_owed": "Estimated tax owed",
            "top_recommendations": [
                {"strategy": "Max out 401(k)", "impact": "$7,500 reduction"},
                {"strategy": "Tax-loss harvesting", "impact": "$3,000 reduction"}
            ],
            "detailed_breakdown": {
                "income_sources": {"w2": "XX,XXX", "1099": "XX,XXX", "investments": "XX,XXX"},
                "deductions": {"standard_deduction": "XX,XXX", "charitable_donations": "X,XXX"},
                "credits": {"child_tax_credit": "X,XXX"}
            }
        }
        Extracted data: ${JSON.stringify(extractedData, null, 2)}
        Return only JSON, no additional text.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: prompt }],
            max_tokens: 500
        });

        const cleanResponse = response.choices[0].message.content;
        console.log("🔍 OpenAI Raw Response:", cleanResponse);

        if (!cleanResponse) {
            throw new Error("OpenAI response is empty or undefined.");
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(cleanResponse);
        } catch (parseErr) {
            console.error("❌ JSON Parse Error:", parseErr);
            return res.status(500).json({ error: "Failed to parse AI response" });
        }

        jsonResponse.top_recommendations = jsonResponse.top_recommendations || [];

        const formatData = (obj) => {
            if (!obj || typeof obj !== "object") return;

            for (let key in obj) {
                if (typeof obj[key] === "object") {
                    formatData(obj[key]);
                } else {
                    if (!isNaN(parseFloat(obj[key])) && obj[key] !== "N/A") {
                        obj[key] = parseFloat(obj[key]);
                    } else if (obj[key] === "N/A") {
                        obj[key] = "N/A";
                    } else if (!obj[key]) {
                        obj[key] = 0.00;
                    }
                }
            }
        };

        formatData(jsonResponse);
        res.json(jsonResponse);

    } catch (err) {
        console.error("❌ Processing Error:", err);
        res.status(500).json({ error: "Internal server error: " + err.message });
    }
});

const parseCSV = async (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const readableStream = new stream.Readable();
        readableStream.push(buffer.toString("utf-8"));
        readableStream.push(null);

        readableStream
            .pipe(csvParser({ headers: true }))
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (err) => reject(err));
    });
};

const parseExcel = async (buffer) => {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
};

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));

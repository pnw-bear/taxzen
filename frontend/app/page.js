"use client";

import { useState } from "react";
import { processTaxDocs } from "../utils/api";

export default function Home() {
    const [files, setFiles] = useState([]);
    const [processingStatus, setProcessingStatus] = useState("");
    const [taxInsights, setTaxInsights] = useState(null);

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleUploadAndProcess = async () => {
        if (files.length === 0) return alert("Please select files");

        setProcessingStatus("Processing tax documents...");

        const result = await processTaxDocs(files);

        if (result.error) {
            setProcessingStatus("❌ Error: " + result.error);
        } else {
            setProcessingStatus("✅ Analysis Complete!");
            setTaxInsights(result);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 bg-gray-100 text-gray-900">
            <h1 className="text-2xl font-bold text-gray-800">📊 TaxZen: Smart Tax Analysis</h1>
            <input type="file" multiple onChange={handleFileChange} className="border border-gray-300 rounded-md p-2 w-full" />
            <button
                onClick={handleUploadAndProcess}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Upload & Analyze
            </button>
            <p className="text-gray-700">{processingStatus}</p>

            {/* ✅ Render structured tax insights */}
            {taxInsights && (
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Tax Summary</h2>
                    <p className="text-gray-700 font-semibold">💰 <strong>Total Taxable Income:</strong> <span className="text-blue-600">{taxInsights.total_taxable_income}</span></p>
                    <p className="text-gray-700 font-semibold">⚠️ <strong>Estimated Tax Owed:</strong> <span className="text-red-600">{taxInsights.estimated_tax_owed}</span></p>

                    <h3 className="text-lg font-bold text-gray-800 mt-4">📌 Top Tax-Saving Strategies</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                        {taxInsights.top_recommendations.map((rec, index) => (
                            <li key={index}>
                                <strong>{rec.strategy}:</strong> {rec.impact}
                            </li>
                        ))}
                    </ul>

                    <h3 className="text-lg font-bold text-gray-800 mt-4">📂 Detailed Breakdown</h3>
                    <div className="space-y-2">
                        <p><strong>💼 Income Sources:</strong></p>
                        <ul className="list-disc pl-5 text-gray-700">
                            {Object.entries(taxInsights.detailed_breakdown.income_sources).map(([key, value], index) => (
                                <li key={index}><strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> ${value}</li>
                            ))}
                        </ul>
                        <p><strong>📉 Deductions:</strong></p>
                        <ul className="list-disc pl-5 text-gray-700">
                            {Object.entries(taxInsights.detailed_breakdown.deductions).map(([key, value], index) => (
                                <li key={index}><strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> ${value}</li>
                            ))}
                        </ul>
                        <p><strong>🎁 Credits:</strong></p>
                        <ul className="list-disc pl-5 text-gray-700">
                            {Object.entries(taxInsights.detailed_breakdown.credits).map(([key, value], index) => (
                                <li key={index}><strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> ${value}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

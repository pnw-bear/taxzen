"use client";

import { useState } from "react";
import { processTaxDocs } from "../utils/api";
import Head from "next/head";

export default function Home() {
    const [files, setFiles] = useState([]);
    const [processingStatus, setProcessingStatus] = useState("");
    const [taxInsights, setTaxInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const formatCurrency = (value) => {
        if (typeof value === "number") {
            return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
        }
        if (typeof value === "string" && value.startsWith("$")) {
            return value;
        }
        return value;
    };

    const handleUploadAndProcess = async () => {
        if (files.length === 0) return alert("Please select files");

        setIsLoading(true);
        setProcessingStatus("Processing tax documents...");

        try {
            const result = await processTaxDocs(files);

            if (result.error) {
                setProcessingStatus("❌ Error: " + result.error);
            } else {
                setProcessingStatus("✅ Analysis Complete!");
                setTaxInsights(result);
            }
        } catch (error) {
            setProcessingStatus("❌ Error: Unable to process documents");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="w-8 h-8 mr-2">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="2" y="4" width="4" height="16" fill="#4CAF50" />
                                        <rect x="10" y="8" width="4" height="12" fill="#2196F3" />
                                        <rect x="18" y="6" width="4" height="14" fill="#3F51B5" />
                                    </svg>
                                </div>
                                <span className="font-serif text-xl font-bold">TaxZen</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button className="ml-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">Smart Tax Analysis</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Upload your tax documents and get AI-powered insights to optimize your tax situation.
                    </p>
                </div>

                {/* File Upload Section */}
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <div className="mb-4">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M24 8V32M16 16L24 8L32 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 32H36V40H12V32Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-gray-600 mb-4">
                                {files.length > 0
                                    ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                                    : 'Drag and drop your tax documents here, or'}
                            </p>
                            <div className="flex justify-center">
                                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Browse Files
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleUploadAndProcess}
                                disabled={isLoading || files.length === 0}
                                className={`w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                                    isLoading || files.length === 0
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Upload & Analyze'
                                )}
                            </button>
                        </div>

                        {processingStatus && (
                            <div className={`mt-4 text-center font-medium ${
                                processingStatus.includes('❌') ? 'text-red-600' : 'text-indigo-600'
                            }`}>
                                {processingStatus}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                {taxInsights && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-200">
                                <h2 className="text-2xl font-serif font-bold text-gray-800">Tax Summary</h2>
                            </div>

                            <div className="p-8">
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-green-50 rounded-lg p-6">
                                        <p className="text-sm font-medium text-green-800 mb-1">Total Taxable Income</p>
                                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(taxInsights.total_taxable_income)}</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-lg p-6">
                                        <p className="text-sm font-medium text-amber-800 mb-1">Estimated Tax Owed</p>
                                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(taxInsights.estimated_tax_owed)}</p>
                                    </div>
                                </div>

                                {taxInsights.top_recommendations && taxInsights.top_recommendations.length > 0 && (
                                    <>
                                        <div className="mb-8">
                                            <h3 className="text-xl font-serif font-bold text-gray-800 mb-4">Tax-Saving Strategies</h3>
                                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                                {taxInsights.top_recommendations.map((rec, index) => (
                                                    <div key={index} className={`px-6 py-4 flex items-center justify-between ${
                                                        index !== taxInsights.top_recommendations.length - 1 ? 'border-b border-gray-200' : ''
                                                    }`}>
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                                                {index === 0 ? '💰' : '📈'}
                                                            </div>
                                                            <div className="ml-4">
                                                                <p className="text-sm font-medium text-gray-900">{rec.strategy}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-semibold text-green-600">
                                                            {formatCurrency(rec.impact)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {taxInsights.detailed_breakdown && (
                                            <div>
                                                <h3 className="text-xl font-serif font-bold text-gray-800 mb-4">Detailed Breakdown</h3>

                                                {taxInsights.detailed_breakdown.income_sources && (
                                                    <div className="mb-6">
                                                        <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                                                            <span className="mr-2">💼</span>
                                                            Income Sources
                                                        </h4>
                                                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                                            {Object.entries(taxInsights.detailed_breakdown.income_sources).map(([key, value], index, arr) => (
                                                                <div key={index} className={`px-6 py-4 flex justify-between ${
                                                                    index !== arr.length - 1 ? 'border-b border-gray-200' : ''
                                                                }`}>
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        {key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                                                    </span>
                                                                    <span className="text-sm font-semibold">${value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {taxInsights.detailed_breakdown.deductions && (
                                                    <div className="mb-6">
                                                        <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                                                            <span className="mr-2">📉</span>
                                                            Deductions
                                                        </h4>
                                                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                                            {Object.entries(taxInsights.detailed_breakdown.deductions).map(([key, value], index, arr) => (
                                                                <div key={index} className={`px-6 py-4 flex justify-between ${
                                                                    index !== arr.length - 1 ? 'border-b border-gray-200' : ''
                                                                }`}>
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        {key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                                                    </span>
                                                                    <span className="text-sm font-semibold">${value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {taxInsights.detailed_breakdown.credits && (
                                                    <div>
                                                        <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                                                            <span className="mr-2">🎁</span>
                                                            Credits
                                                        </h4>
                                                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                                            {Object.entries(taxInsights.detailed_breakdown.credits).map(([key, value], index, arr) => (
                                                                <div key={index} className={`px-6 py-4 flex justify-between ${
                                                                    index !== arr.length - 1 ? 'border-b border-gray-200' : ''
                                                                }`}>
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        {key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                                                    </span>
                                                                    <span className="text-sm font-semibold">${value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white mt-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 mr-2">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="4" width="4" height="16" fill="#4CAF50" />
                                    <rect x="10" y="8" width="4" height="12" fill="#2196F3" />
                                    <rect x="18" y="6" width="4" height="14" fill="#3F51B5" />
                                </svg>
                            </div>
                            <span className="font-serif font-bold">TaxZen</span>
                        </div>
                        <div className="mt-8 md:mt-0">
                            <p className="text-center text-sm text-gray-500">
                                © 2025 TaxZen. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
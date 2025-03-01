app.post("/analyze-tax", async (req, res) => {
    try {
        const { income, deductions, stockSales } = req.body;

        // Ensure input data is valid
        if (!income || !deductions || !stockSales) {
            return res.status(400).json({ error: "Missing required tax data." });
        }

        // ✅ Debugging: Check if OpenAI API Key is available
        if (!process.env.OPENAI_API_KEY) {
            console.error("❌ ERROR: Missing OpenAI API Key!");
            return res.status(500).json({ error: "OpenAI API Key is missing in backend." });
        }

        const prompt = `Analyze this tax data:
        - Income: ${income}
        - Deductions: ${deductions}
        - Stock Sales: ${stockSales}
        Provide estimated taxable income and tax-saving strategies.`;

        const response = await openai.createCompletion({
            model: "gpt-4",
            prompt,
            max_tokens: 200,
        });

        if (!response || !response.data || !response.data.choices) {
            console.error("❌ ERROR: OpenAI API response malformed", response);
            return res.status(500).json({ error: "Failed to process AI insights." });
        }

        res.json({ analysis: response.data.choices[0].text });

    } catch (err) {
        console.error("❌ AI Processing Error:", err);
        res.status(500).json({ error: "Internal server error: " + err.message });
    }
});

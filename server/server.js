const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/', (req, res) => {
    res.send('Generative AI Platform Backend is Running!');
});

const MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
const MAX_RETRIES = 2;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithFallback(systemPrompt, userPrompt) {
    let lastError;

    for (const model of MODELS) {
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(`Trying model: ${model} (attempt ${attempt + 1})`);
                const result = await ai.models.generateContent({
                    model: model,
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: systemPrompt },
                                { text: `\n\nUser Requirement:\n${userPrompt}` }
                            ]
                        }
                    ],
                    config: {
                        temperature: 0.7,
                        topP: 0.95,
                        maxOutputTokens: 8192,
                    }
                });
                return { model, text: result.text || 'No response generated.' };
            } catch (err) {
                lastError = err;
                console.log(`Model ${model} attempt ${attempt + 1} failed: ${err.message}`);
                if (attempt < MAX_RETRIES) {
                    await sleep(2000 * (attempt + 1));
                }
            }
        }
    }

    throw lastError;
}

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ success: false, error: 'Prompt is required' });
        }

        const systemPrompt = `You are an expert software architect and developer. Given a software requirement, generate a comprehensive project structure and architecture including:

1. Project Overview & Tech Stack
2. Directory Structure (tree format)
3. Key Components & Their Responsibilities
4. Database Schema (if applicable)
5. API Endpoints (if applicable)
6. Sample Code Snippets for critical files

Format the response clearly with headings and proper formatting. Be thorough and practical.`;

        const { model, text } = await generateWithFallback(systemPrompt, prompt);
        console.log(`Successfully generated using model: ${model}`);
        res.json({ success: true, result: text });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({
            success: false,
            error: `Failed to generate project structure. ${error.message || 'Google AI servers may be experiencing high demand - please try again in a moment.'}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
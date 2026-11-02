const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

const router = express.Router();

const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || 'AIzaSy_placeholder';
const genAI = new GoogleGenerativeAI(geminiKey);

// Prioritize supported Gemini 3.5 series models
const CANDIDATE_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];

async function generateAIResponse(promptText) {
  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(promptText);
      const text = result?.response?.text();
      if (text) return text;
    } catch (err) {
      console.warn(`Model ${modelName} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed to generate content');
}

// Chat with AI
router.post('/', auth, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ response: 'Please provide a message.' });
  }

  try {
    console.log('Received chatbot message:', message);

    const prompt = `You are a helpful, encouraging AI Startup Mentor for the Student Startup Hub. 
Provide concise, practical, and inspiring advice on startup ideas, business models, validation, tech stack, marketing, or finding teammates.
Format responses with clean spacing, bullet points, and brief paragraphs where helpful.
User: ${message.trim()}`;

    const response = await generateAIResponse(prompt);
    console.log('Chatbot AI response generated successfully');
    res.json({ response });
  } catch (error) {
    console.error('Chatbot AI Error:', error);

    const errorMessage =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Sorry, I'm having trouble responding right now. Please try again later.";

    res.json({ response: `[AI Assistant Error]: ${errorMessage}` });
  }
});

module.exports = router;
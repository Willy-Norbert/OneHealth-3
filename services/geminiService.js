const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let genAI;

function getModel(modelName = 'gemini-1.5-flash') {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY (or GOOGLE_API_KEY) is not set in environment variables');
  }
  if (!genAI) genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Generate structured JSON from Gemini given a prompt and an expected JSON schema description.
 * @param {string} prompt - User/domain prompt with instructions
 * @param {string} schemaDescription - Explain the exact JSON keys and types expected
 * @param {object} options - { model?: string, temperature?: number, maxOutputTokens?: number }
 */
async function generateJSON(prompt, schemaDescription, options = {}) {
  const model = getModel(options.model);
  const generationConfig = {
    responseMimeType: 'application/json',
    temperature: options.temperature ?? 0.3,
    maxOutputTokens: options.maxOutputTokens ?? 2048,
  };

  const system = `You are a medical assistant. Always return ONLY valid JSON as specified.\nSchema: ${schemaDescription}`;

  const result = await model.generateContent({
    contents: [
      { role: 'user', parts: [{ text: system }] },
      { role: 'user', parts: [{ text: prompt }] }
    ],
    generationConfig,
  });

  const text = result?.response?.text?.() || result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to recover JSON from code fences if present
    const match = text.match(/```json\n([\s\S]*?)```/i) || text.match(/```\n([\s\S]*?)```/i);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    throw new Error('Failed to parse JSON from Gemini response');
  }
}

module.exports = { generateJSON };

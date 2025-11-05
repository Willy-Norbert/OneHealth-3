const { GoogleGenerativeAI } = require('@google/generative-ai');
const https = require('https');

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let genAI = null;
let cachedWorkingModel = null;

// Initialize Gemini AI client
function initializeGenAI() {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY (or GOOGLE_API_KEY) is not set in environment variables');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ [GEMINI] GoogleGenerativeAI client initialized');
  }
  return genAI;
}

// Get a model instance
function getModel(modelName = 'gemini-1.5-flash') {
  const client = initializeGenAI();
  return client.getGenerativeModel({ model: modelName });
}

// List available models using REST API directly
async function listAvailableModelsViaREST() {
  if (!apiKey) {
    return null;
  }

  return new Promise((resolve) => {
    const urlPath = `/v1beta/models?key=${encodeURIComponent(apiKey)}`;
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: urlPath,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log('📋 [GEMINI] Fetching available models via REST API...');
    console.log('   URL: https://generativelanguage.googleapis.com/v1beta/models');
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            console.error(`❌ [GEMINI] REST API returned status ${res.statusCode}`);
            console.error('   Response:', data.substring(0, 500));
            resolve([]);
            return;
          }
          
          const response = JSON.parse(data);
          const models = response.models || [];
          
          console.log(`✅ [GEMINI] Found ${models.length} total models via REST API`);
          
          // Log all models for debugging
          models.forEach(m => {
            const name = m.name || '';
            const methods = m.supportedGenerationMethods || [];
            console.log(`   Model: ${name}, Methods: [${methods.join(', ')}]`);
          });
          
          // Find models that support generateContent
          const workingModels = models
            .filter(m => {
              const methods = m.supportedGenerationMethods || [];
              return methods.includes('generateContent');
            })
            .map(m => {
              const name = m.name || '';
              // Remove 'models/' prefix if present
              const cleanName = name.replace(/^models\//, '');
              return cleanName;
            })
            .filter(name => name && name.length > 0);
          
          if (workingModels.length > 0) {
            console.log('📋 [GEMINI] Available working models with generateContent:', workingModels);
            resolve(workingModels);
          } else {
            console.warn('⚠️  [GEMINI] No models with generateContent support found in API response');
            // Return all model names as fallback
            const allModelNames = models
              .map(m => (m.name || '').replace(/^models\//, ''))
              .filter(name => name && name.length > 0);
            console.log('📋 [GEMINI] All available model names:', allModelNames);
            resolve(allModelNames);
          }
        } catch (error) {
          console.error('❌ [GEMINI] Error parsing models response:', error.message);
          console.error('   Raw response:', data.substring(0, 500));
          resolve([]);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ [GEMINI] Error fetching models via REST:', error.message);
      resolve([]);
    });
    
    req.setTimeout(10000, () => {
      console.error('❌ [GEMINI] REST API request timeout');
      req.destroy();
      resolve([]);
    });
    
    req.end();
  });
}

// List of models to try in order (most common first)
const DEFAULT_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.0-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-001',
  'gemini-1.5-pro-001',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro',
  'models/gemini-pro'
];

/**
 * Generate conversational response from Gemini
 * @param {string} prompt - The user's prompt/question (should already include language instructions)
 * @param {object} options - Optional configuration (temperature, maxTokens, model, lang, etc.)
 * @returns {Promise<string>} - The generated text response
 */
async function generateConversationalResponse(prompt, options = {}) {
  console.log('\n💬 ============================================');
  console.log('💬 [GEMINI] Generating Conversational Response');
  console.log('💬 ============================================');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('📝 Prompt length:', prompt.length);
  console.log('📝 Prompt preview:', prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''));
  console.log('⚙️  Options:', options);
  console.log('🌐 Language:', options.lang || 'auto-detect');
  
  if (!apiKey) {
    const errorMsg = 'GEMINI_API_KEY is not set in environment variables';
    console.error('❌ [GEMINI]', errorMsg);
    throw new Error(errorMsg);
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    const errorMsg = 'Prompt is required and must be a non-empty string';
    console.error('❌ [GEMINI]', errorMsg);
    throw new Error(errorMsg);
  }

  // First, try to get available models from REST API if we haven't cached one
  let modelsToTry = DEFAULT_MODELS;
  
  if (!cachedWorkingModel) {
    try {
      console.log('🔍 [GEMINI] Fetching available models from API...');
      const availableModels = await listAvailableModelsViaREST();
      if (availableModels && availableModels.length > 0) {
        modelsToTry = availableModels;
        cachedWorkingModel = availableModels[0];
        console.log(`✅ [GEMINI] Using models from API. First model: ${cachedWorkingModel}`);
      } else {
        console.warn('⚠️  [GEMINI] Could not fetch models from API, using default list');
      }
    } catch (error) {
      console.warn('⚠️  [GEMINI] Error fetching models from API, using default list:', error.message);
    }
  }
  
  // If we have a cached working model, prioritize it
  if (cachedWorkingModel && !modelsToTry.includes(cachedWorkingModel)) {
    modelsToTry = [cachedWorkingModel, ...modelsToTry];
  }
  
  // Add user's preferred model if specified
  const userModel = options.model || process.env.GEMINI_MODEL;
  if (userModel && !modelsToTry.includes(userModel)) {
    modelsToTry = [userModel, ...modelsToTry];
  }
  
  let lastError = null;
  let result = null;
  let modelUsed = null;

  // Try each model until one works
  for (const currentModelName of modelsToTry) {
    try {
      console.log(`🔄 [GEMINI] Trying model: ${currentModelName}`);
      const model = getModel(currentModelName);
      
      const generationConfig = {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens ?? 4096,
        topP: options.topP ?? 0.95,
        topK: options.topK ?? 40,
      };
      
      console.log('⚙️  Generation Config:', generationConfig);
      console.log('📤 [GEMINI] Sending request to Gemini API...');
      
      const startTime = Date.now();
      
      // Generate content
      result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ],
        generationConfig,
      });
      
      const duration = Date.now() - startTime;
      console.log(`⏱️  [GEMINI] Response received in ${duration}ms`);
      
      // Extract response text
      const response = result.response;
      const text = response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }
      
      modelUsed = currentModelName;
      cachedWorkingModel = currentModelName; // Cache the working model
      console.log('📥 [GEMINI] Response length:', text.length);
      console.log('📥 [GEMINI] Response preview:', text.substring(0, 300) + (text.length > 300 ? '...' : ''));
      console.log(`✅ [GEMINI] Successfully generated response using model: ${currentModelName}`);
      console.log('💬 ============================================');
      console.log('💬 [GEMINI] Request Completed Successfully');
      console.log('💬 ============================================\n');
      
      return text;
      
    } catch (error) {
      lastError = error;
      
      // Check if it's a 404 (model not found) - try next model
      if (error.message && error.message.includes('404') && error.message.includes('not found')) {
        console.warn(`⚠️  [GEMINI] Model ${currentModelName} not found (404), trying next model...`);
        continue;
      }
      
      // Check if it's an API key error
      if (error.message && (error.message.includes('API key') || error.message.includes('401') || error.message.includes('403'))) {
        console.error(`❌ [GEMINI] API key error with model ${currentModelName}:`, error.message);
        throw new Error(`Invalid or unauthorized API key. Please check your GEMINI_API_KEY at https://makersuite.google.com/app/apikey`);
      }
      
      // For other errors, log and try next model
      console.warn(`⚠️  [GEMINI] Model ${currentModelName} failed:`, error.message);
      continue;
    }
  }

  // If we get here, all models failed
  console.error('\n❌ ============================================');
  console.error('❌ [GEMINI] Error Generating Conversational Response');
  console.error('❌ ============================================');
  console.error('❌ Error type:', lastError?.constructor?.name || 'Unknown');
  console.error('❌ Error message:', lastError?.message);
  console.error('❌ Error stack:', lastError?.stack);
  console.error('❌ All models tried:', modelsToTry);
  console.error('❌ ============================================\n');
  
  throw new Error(`Failed to generate response with any available Gemini model. Last error: ${lastError?.message || 'Unknown error'}. Please check your API key at https://makersuite.google.com/app/apikey`);
}

/**
 * Generate structured JSON from Gemini
 * @param {string} prompt - The user's prompt
 * @param {string} schemaDescription - JSON schema description
 * @param {object} options - Optional configuration
 * @returns {Promise<object>} - Parsed JSON response
 */
async function generateJSON(prompt, schemaDescription, options = {}) {
  console.log('\n🤖 ============================================');
  console.log('🤖 [GEMINI] Generating JSON Response');
  console.log('🤖 ============================================');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('📝 Prompt length:', prompt.length);
  console.log('📋 Schema:', schemaDescription);
  console.log('⚙️  Options:', options);
  
  if (!apiKey) {
    const errorMsg = 'GEMINI_API_KEY is not set in environment variables';
    console.error('❌ [GEMINI]', errorMsg);
    throw new Error(errorMsg);
  }

  // First, try to get available models from REST API if we haven't cached one
  let modelsToTry = DEFAULT_MODELS;
  
  if (!cachedWorkingModel) {
    try {
      console.log('🔍 [GEMINI] Fetching available models from API...');
      const availableModels = await listAvailableModelsViaREST();
      if (availableModels && availableModels.length > 0) {
        modelsToTry = availableModels;
        cachedWorkingModel = availableModels[0];
        console.log(`✅ [GEMINI] Using models from API. First model: ${cachedWorkingModel}`);
      } else {
        console.warn('⚠️  [GEMINI] Could not fetch models from API, using default list');
      }
    } catch (error) {
      console.warn('⚠️  [GEMINI] Error fetching models from API, using default list:', error.message);
    }
  }
  
  // If we have a cached working model, prioritize it
  if (cachedWorkingModel && !modelsToTry.includes(cachedWorkingModel)) {
    modelsToTry = [cachedWorkingModel, ...modelsToTry];
  }
  
  // Add user's preferred model if specified
  const userModel = options.model || process.env.GEMINI_MODEL;
  if (userModel && !modelsToTry.includes(userModel)) {
    modelsToTry = [userModel, ...modelsToTry];
  }
  
  let lastError = null;
  let result = null;
  let modelUsed = null;

  // Build full prompt with schema
  const systemPrompt = `You are a helpful medical assistant. Your role is to:
1. Answer the user's question directly and helpfully
2. Provide accurate, helpful information
3. Always return ONLY valid JSON as specified in the schema
4. Do NOT add extra explanations outside the JSON structure
5. Focus on answering what the user actually asked

Schema: ${schemaDescription}`;

  const fullPrompt = `${systemPrompt}\n\n${prompt}`;

  // Try each model until one works
  for (const currentModelName of modelsToTry) {
    try {
      console.log(`🔄 [GEMINI] Trying model: ${currentModelName}`);
      const model = getModel(currentModelName);
      
  const generationConfig = {
    responseMimeType: 'application/json',
    temperature: options.temperature ?? 0.3,
    maxOutputTokens: options.maxOutputTokens ?? 2048,
  };

      console.log('⚙️  Generation Config:', generationConfig);
      console.log('📤 [GEMINI] Sending request to Gemini API...');

      const startTime = Date.now();

      // Generate content
      result = await model.generateContent({
    contents: [
          { role: 'user', parts: [{ text: fullPrompt }] }
    ],
    generationConfig,
  });

      const duration = Date.now() - startTime;
      console.log(`⏱️  [GEMINI] Response received in ${duration}ms`);
      
      // Extract response text
      const response = result.response;
      const text = response.text();
      
      console.log('📥 [GEMINI] Raw Response Length:', text.length);
      console.log('📥 [GEMINI] Raw Response Preview:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      // Parse JSON
      try {
        const parsed = JSON.parse(text);
        console.log('✅ [GEMINI] JSON parsed successfully');
        console.log('📊 [GEMINI] Parsed Response:', JSON.stringify(parsed, null, 2));
        modelUsed = currentModelName;
        cachedWorkingModel = currentModelName; // Cache the working model
        console.log(`✅ [GEMINI] Successfully generated JSON using model: ${currentModelName}`);
        console.log('🤖 ============================================');
        console.log('🤖 [GEMINI] Request Completed Successfully');
        console.log('🤖 ============================================\n');
        return parsed;
      } catch (parseError) {
        // Try to extract JSON from code fences
        console.warn('⚠️  [GEMINI] Failed to parse JSON directly, trying to extract from code fences...');
    const match = text.match(/```json\n([\s\S]*?)```/i) || text.match(/```\n([\s\S]*?)```/i);
    if (match && match[1]) {
          console.log('✅ [GEMINI] Found JSON in code fences');
          const parsed = JSON.parse(match[1]);
          console.log('📊 [GEMINI] Parsed Response:', JSON.stringify(parsed, null, 2));
          modelUsed = currentModelName;
          cachedWorkingModel = currentModelName; // Cache the working model
          console.log(`✅ [GEMINI] Successfully generated JSON using model: ${currentModelName}`);
          console.log('🤖 ============================================');
          console.log('🤖 [GEMINI] Request Completed Successfully');
          console.log('🤖 ============================================\n');
          return parsed;
        }
        throw new Error(`Failed to parse JSON from Gemini response: ${parseError.message}`);
      }
      
    } catch (error) {
      lastError = error;
      
      // Check if it's a 404 (model not found) - try next model
      if (error.message && error.message.includes('404') && error.message.includes('not found')) {
        console.warn(`⚠️  [GEMINI] Model ${currentModelName} not found (404), trying next model...`);
        continue;
      }
      
      // Check if it's an API key error
      if (error.message && (error.message.includes('API key') || error.message.includes('401') || error.message.includes('403'))) {
        console.error(`❌ [GEMINI] API key error with model ${currentModelName}:`, error.message);
        throw new Error(`Invalid or unauthorized API key. Please check your GEMINI_API_KEY at https://makersuite.google.com/app/apikey`);
      }
      
      // For other errors, log and try next model
      console.warn(`⚠️  [GEMINI] Model ${currentModelName} failed:`, error.message);
      continue;
    }
  }

  // If we get here, all models failed
  console.error('\n❌ ============================================');
  console.error('❌ [GEMINI] Error Generating JSON Response');
  console.error('❌ ============================================');
  console.error('❌ Error type:', lastError?.constructor?.name || 'Unknown');
  console.error('❌ Error message:', lastError?.message);
  console.error('❌ Error stack:', lastError?.stack);
  console.error('❌ All models tried:', modelsToTry);
  console.error('❌ ============================================\n');
  
  throw new Error(`Failed to generate JSON response with any available Gemini model. Last error: ${lastError?.message || 'Unknown error'}. Please check your API key at https://makersuite.google.com/app/apikey`);
}

// Initialize on module load
console.log('🤖 [GEMINI] Initializing Gemini Service...');
console.log('   GEMINI_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT SET');
console.log('   GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'SET' : 'NOT SET');
console.log('   GEMINI_MODEL:', process.env.GEMINI_MODEL || 'will auto-detect from available models');

if (!apiKey) {
  console.warn('⚠️  [GEMINI] WARNING: GEMINI_API_KEY is not set. AI features will not work.');
  console.warn('   Please set GEMINI_API_KEY in your .env file');
  console.warn('   Get your API key at: https://makersuite.google.com/app/apikey');
}

module.exports = {
  generateConversationalResponse,
  generateJSON
};

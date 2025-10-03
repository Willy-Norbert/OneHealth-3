const mongoose = require('mongoose');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function connectWithRetry(uri, options = {}, retries = 10, delayMs = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri, options);
      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`MongoDB connection failed (attempt ${attempt}/${retries}):`, error.message);
      if (attempt < retries) {
        console.log(`Retrying in ${Math.round(delayMs/1000)}s...`);
        await sleep(delayMs);
        continue;
      }
      throw error;
    }
  }
}

const connectDB = async () => {
  const envUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const devFallback = 'mongodb://127.0.0.1:27017/onehealth';
  const forceLocal = String(process.env.USE_LOCAL_DB || '').toLowerCase() === 'true';
  const isProd = process.env.NODE_ENV === 'production';

  let uri = forceLocal ? devFallback : (envUri || (!isProd ? devFallback : null));
  if (!uri) {
    console.error('No MongoDB URI provided. Set MONGO_URI or MONGODB_URI in environment variables.');
    process.exit(1);
  }

  try {
    await connectWithRetry(uri, {}, 12, 5000);
  } catch (error) {
    console.error('MongoDB connection failed after retries:', error.message);
    console.log('Tried URI:', uri);
    // Do not hard-exit immediately; allow process manager to restart or ops to fix IP allowlist
    process.exit(1);
  }
};

module.exports = connectDB;

// ================================================
//  config/db.js – MongoDB connection via Mongoose
// ================================================
const mongoose = require('mongoose');

const MAX_RETRIES  = 3;
const RETRY_DELAY  = 3000; // ms

async function connectDB(retries = 0) {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('⚠️  MONGO_URI not set in .env — running without database (mock data only).');
    return null;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS:          45000,
    });

    console.log(`✅  MongoDB connected → ${mongoose.connection.host}`);

    // ── Connection event listeners ───────────────
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect…');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('✅  MongoDB reconnected.');
    });
    mongoose.connection.on('error', (err) => {
      console.error('❌  MongoDB error:', err.message);
    });

    // ── Graceful shutdown ────────────────────────
    const shutdown = async (signal) => {
      console.log(`\n🔌  ${signal} received – closing MongoDB connection…`);
      await mongoose.connection.close();
      console.log('✅  MongoDB connection closed. Exiting.');
      process.exit(0);
    };
    process.once('SIGINT',  () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));

    return mongoose.connection;

  } catch (err) {
    console.error(`❌  MongoDB connection failed (attempt ${retries + 1}/${MAX_RETRIES}): ${err.message}`);

    if (retries < MAX_RETRIES - 1) {
      console.log(`🔄  Retrying in ${RETRY_DELAY / 1000}s…`);
      await new Promise(res => setTimeout(res, RETRY_DELAY));
      return connectDB(retries + 1);
    }

    console.warn('⚠️  Could not connect to MongoDB. Server will start with mock data only.');
    return null;
  }
}

module.exports = connectDB;

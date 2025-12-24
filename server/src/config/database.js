const mongoose = require('mongoose');

/**
 * Database Connection with Business Logic
 * - Handles reconnection for high availability
 * - Monitors connection for analytics
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pooling for scalability
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      // Monitoring
      autoIndex: process.env.NODE_ENV === 'development',
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Business metric: Track DB connection uptime
    global.dbConnectedAt = new Date();

    // Handle connection events for business continuity
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB Disconnected - Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB Reconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Error:', err.message);
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    // Critical for startup: Exit if DB unavailable
    process.exit(1);
  }
};

module.exports = connectDB;

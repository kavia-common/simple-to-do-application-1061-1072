'use strict';
/**
 * Database connection utility using Mongoose.
 * Reads configuration from environment variables.
 * Required ENV:
 * - MONGODB_URL: the Mongo connection string
 * - MONGODB_DB: the database name
 */
const mongoose = require('mongoose');

/**
 * PUBLIC_INTERFACE
 * connectToDatabase
 * Establishes and caches a MongoDB connection using Mongoose.
 * Ensures the connection is created once per process and reused.
 */
async function connectToDatabase() {
  /** This function connects to MongoDB and returns the mongoose connection. */
  const uri = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB;

  if (!uri || !dbName) {
    throw new Error('Missing required environment variables: MONGODB_URL and/or MONGODB_DB');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Use strictQuery per Mongoose 7 best practices
  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    dbName,
    // Recommended options
    autoIndex: true,
    maxPoolSize: 10,
  });

  mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected to database "${dbName}"`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  return mongoose.connection;
}

module.exports = {
  connectToDatabase,
};

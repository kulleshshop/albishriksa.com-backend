import mongoose from "mongoose";

// Global connection cache for serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  // If already connected, return the existing connection
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    console.log("🔄 Creating new MongoDB connection...");

    // Set mongoose options optimized for serverless
    mongoose.set("strictQuery", false);

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        // Optimized for serverless environments
        serverSelectionTimeoutMS: 5000, // Reduced from 10000
        socketTimeoutMS: 30000, // Reduced from 45000
        connectTimeoutMS: 10000, // Added explicit connect timeout
        maxPoolSize: 1, // Reduced for serverless
        minPoolSize: 0, // Allow connection to close
        maxIdleTimeMS: 10000, // Close idle connections quickly
        retryWrites: true,
        retryReads: true,
        // Buffer commands when not connected (important for serverless)
        bufferCommands: true,
        bufferMaxEntries: 0,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error.message);
        cached.promise = null; // Reset promise on error
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;

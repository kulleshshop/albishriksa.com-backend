import mongoose from "mongoose";

// Simple connection for Render
const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Using existing MongoDB connection");
      return;
    }

    console.log("🔄 Connecting to MongoDB...");

    // Connection options optimized for Render + MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      // SSL/TLS options for better compatibility
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      // Retry options
      retryWrites: true,
      retryReads: true,
      // Connection pool options
      maxPoolSize: 10,
      minPoolSize: 1,
    });

    console.log("✅ MongoDB Connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

export default connectDB;

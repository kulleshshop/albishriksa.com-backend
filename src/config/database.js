import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("🔄 Attempting MongoDB connection...");

    // Set mongoose options for better serverless handling
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Increased to 10s for initial connection
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`❌ Full error:`, error);
    isConnected = false;
    throw error;
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  isConnected = true;
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.log("Mongoose disconnected from MongoDB");
});

export default connectDB;

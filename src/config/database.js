import mongoose from "mongoose";

let isConnected = false;

const connectDB = async (retries = 3) => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  // Set mongoose options for better serverless handling
  mongoose.set("strictQuery", false);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        `🔄 Attempting MongoDB connection (attempt ${attempt}/${retries})...`
      );

      const conn = await mongoose.connect(
        "mongodb+srv://kulleshshopping_db_user:2thgQRLx6HCnjQWC@albaseri.gxpehzv.mongodb.net/?retryWrites=true&w=majority&appName=albaseri",
        {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          maxPoolSize: 10,
          minPoolSize: 1,
          retryWrites: true,
          retryReads: true,
        }
      );

      isConnected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(
        `❌ MongoDB Connection Error (attempt ${attempt}/${retries}): ${error.message}`
      );

      isConnected = false;

      // If this is the last attempt, throw the error
      if (attempt === retries) {
        console.error(`❌ All connection attempts failed`);
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
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

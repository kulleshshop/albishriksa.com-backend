import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/database.js";
import Client from "../models/Client.js";
import Project from "../models/Project.js";
import Service from "../models/Service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Data file paths
const DATA_DIR = path.join(__dirname, "../../data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const CLIENTS_FILE = path.join(DATA_DIR, "clients.json");
const SERVICES_FILE = path.join(DATA_DIR, "services-data.json");

// Helper function to read JSON data
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...");

    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Project.deleteMany({});
    await Client.deleteMany({});
    await Service.deleteMany({});

    // Seed Projects
    console.log("📦 Seeding projects...");
    const projectsData = readJsonFile(PROJECTS_FILE);
    if (projectsData && projectsData.projects) {
      await Project.insertMany(projectsData.projects);
      console.log(`✅ Seeded ${projectsData.projects.length} projects`);
    }

    // Seed Clients
    console.log("👥 Seeding clients...");
    const clientsData = readJsonFile(CLIENTS_FILE);
    if (clientsData && clientsData.clients) {
      await Client.insertMany(clientsData.clients);
      console.log(`✅ Seeded ${clientsData.clients.length} clients`);
    }

    // Seed Services
    console.log("🛠️  Seeding services...");
    const servicesData = readJsonFile(SERVICES_FILE);
    if (servicesData && servicesData.services) {
      await Service.insertMany(servicesData.services);
      console.log(`✅ Seeded ${servicesData.services.length} services`);
    }

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

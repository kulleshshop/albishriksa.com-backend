import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import connectDB from "./config/database.js";
import Client from "./models/Client.js";
import Project from "./models/Project.js";
import Service from "./models/Service.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to ensure MongoDB connection before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.error("Full error:", error);
    res.status(503).json({
      success: false,
      message: "Database connection unavailable",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// JWT Secret
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Albasari Backend Server is running" });
});

// Authentication
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // In production, validate against database
  const validEmail = process.env.CMS_EMAIL || "info@albishriksa.com";
  const validPassword = process.env.CMS_PASSWORD || "admin123";

  if (email === validEmail && password === validPassword) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
    res.json({
      success: true,
      data: { token, user: { email } },
      message: "Login successful",
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
});

// Projects API
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (project) {
      res.json({ success: true, data: project });
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
});

app.post("/api/projects", authenticateToken, async (req, res) => {
  try {
    const newProject = new Project({
      ...req.body,
      id: req.body.id || `project-${Date.now()}`,
    });
    await newProject.save();
    res.json({
      success: true,
      data: newProject,
      message: "Project created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
});

app.put("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (project) {
      res.json({
        success: true,
        data: project,
        message: "Project updated successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
});

app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id });
    if (project) {
      res.json({ success: true, message: "Project deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
});

// Clients API
app.get("/api/clients", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
});

app.get("/api/clients/:id", async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (client) {
      res.json({ success: true, data: client });
    } else {
      res.status(404).json({ success: false, message: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch client",
      error: error.message,
    });
  }
});

app.post("/api/clients", authenticateToken, async (req, res) => {
  try {
    const newClient = new Client({
      ...req.body,
      id: req.body.id || `client-${Date.now()}`,
    });
    await newClient.save();
    res.json({
      success: true,
      data: newClient,
      message: "Client created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create client",
      error: error.message,
    });
  }
});

app.put("/api/clients/:id", authenticateToken, async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (client) {
      res.json({
        success: true,
        data: client,
        message: "Client updated successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update client",
      error: error.message,
    });
  }
});

app.delete("/api/clients/:id", authenticateToken, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ id: req.params.id });
    if (client) {
      res.json({ success: true, message: "Client deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: error.message,
    });
  }
});

// Services API
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
});

app.get("/api/services/:id", async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });
    if (service) {
      res.json({ success: true, data: service });
    } else {
      res.status(404).json({ success: false, message: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
});

app.post("/api/services", authenticateToken, async (req, res) => {
  try {
    const newService = new Service({
      ...req.body,
      id: req.body.id || `service-${Date.now()}`,
    });
    await newService.save();
    res.json({
      success: true,
      data: newService,
      message: "Service created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
});

app.put("/api/services/:id", authenticateToken, async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (service) {
      res.json({
        success: true,
        data: service,
        message: "Service updated successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
});

app.delete("/api/services/:id", authenticateToken, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ id: req.params.id });
    if (service) {
      res.json({ success: true, message: "Service deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
});

// Export the Express app for Vercel
export default app;

// Start server only in development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Albasari Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  });
}

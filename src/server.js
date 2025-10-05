import cors from "cors";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret (in production, use environment variable)
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Data file paths
const DATA_DIR = path.join(__dirname, "../data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const CLIENTS_FILE = path.join(DATA_DIR, "clients.json");
const SERVICES_FILE = path.join(DATA_DIR, "services-data.json");

// Helper function to read JSON data
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Helper function to write JSON data
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

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
  const validEmail = process.env.CMS_EMAIL || "admin@albasari.com";
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
app.get("/api/projects", (req, res) => {
  const data = readJsonFile(PROJECTS_FILE);
  if (data) {
    res.json({ success: true, data: data.projects });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read projects data" });
  }
});

app.get("/api/projects/:id", (req, res) => {
  const data = readJsonFile(PROJECTS_FILE);
  if (data) {
    const project = data.projects.find((p) => p.id === req.params.id);
    if (project) {
      res.json({ success: true, data: project });
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read projects data" });
  }
});

app.post("/api/projects", authenticateToken, (req, res) => {
  const data = readJsonFile(PROJECTS_FILE);
  if (data) {
    const newProject = {
      ...req.body,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.projects.push(newProject);

    if (writeJsonFile(PROJECTS_FILE, data)) {
      res.json({
        success: true,
        data: newProject,
        message: "Project created successfully",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to save project" });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read projects data" });
  }
});

app.put("/api/projects/:id", authenticateToken, (req, res) => {
  const data = readJsonFile(PROJECTS_FILE);
  if (data) {
    const projectIndex = data.projects.findIndex((p) => p.id === req.params.id);
    if (projectIndex !== -1) {
      data.projects[projectIndex] = {
        ...data.projects[projectIndex],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      if (writeJsonFile(PROJECTS_FILE, data)) {
        res.json({
          success: true,
          data: data.projects[projectIndex],
          message: "Project updated successfully",
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to save project" });
      }
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read projects data" });
  }
});

app.delete("/api/projects/:id", authenticateToken, (req, res) => {
  const data = readJsonFile(PROJECTS_FILE);
  if (data) {
    const projectIndex = data.projects.findIndex((p) => p.id === req.params.id);
    if (projectIndex !== -1) {
      data.projects.splice(projectIndex, 1);

      if (writeJsonFile(PROJECTS_FILE, data)) {
        res.json({ success: true, message: "Project deleted successfully" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to delete project" });
      }
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read projects data" });
  }
});

// Clients API
app.get("/api/clients", (req, res) => {
  const data = readJsonFile(CLIENTS_FILE);
  if (data) {
    res.json({ success: true, data: data.clients });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read clients data" });
  }
});

app.get("/api/clients/:id", (req, res) => {
  const data = readJsonFile(CLIENTS_FILE);
  if (data) {
    const client = data.clients.find((c) => c.id === req.params.id);
    if (client) {
      res.json({ success: true, data: client });
    } else {
      res.status(404).json({ success: false, message: "Client not found" });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read clients data" });
  }
});

app.post("/api/clients", authenticateToken, (req, res) => {
  const data = readJsonFile(CLIENTS_FILE);
  if (data) {
    const newClient = {
      ...req.body,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.clients.push(newClient);

    if (writeJsonFile(CLIENTS_FILE, data)) {
      res.json({
        success: true,
        data: newClient,
        message: "Client created successfully",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to save client" });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read clients data" });
  }
});

app.put("/api/clients/:id", authenticateToken, (req, res) => {
  const data = readJsonFile(CLIENTS_FILE);
  if (data) {
    const clientIndex = data.clients.findIndex((c) => c.id === req.params.id);
    if (clientIndex !== -1) {
      data.clients[clientIndex] = {
        ...data.clients[clientIndex],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      if (writeJsonFile(CLIENTS_FILE, data)) {
        res.json({
          success: true,
          data: data.clients[clientIndex],
          message: "Client updated successfully",
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to save client" });
      }
    } else {
      res.status(404).json({ success: false, message: "Client not found" });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read clients data" });
  }
});

app.delete("/api/clients/:id", authenticateToken, (req, res) => {
  const data = readJsonFile(CLIENTS_FILE);
  if (data) {
    const clientIndex = data.clients.findIndex((c) => c.id === req.params.id);
    if (clientIndex !== -1) {
      data.clients.splice(clientIndex, 1);

      if (writeJsonFile(CLIENTS_FILE, data)) {
        res.json({ success: true, message: "Client deleted successfully" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to delete client" });
      }
    } else {
      res.status(404).json({ success: false, message: "Client not found" });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read clients data" });
  }
});

// Services API
app.get("/api/services", (req, res) => {
  const data = readJsonFile(SERVICES_FILE);
  if (data) {
    res.json({ success: true, data: data.services });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read services data" });
  }
});

app.get("/api/services/:slug", (req, res) => {
  const data = readJsonFile(SERVICES_FILE);
  if (data) {
    const service = data.services.find((s) => s.slug === req.params.slug);
    if (service) {
      res.json({ success: true, data: service });
    } else {
      res.status(404).json({ success: false, message: "Service not found" });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to read services data" });
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

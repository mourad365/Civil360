import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/database";
import { registerRoutes } from "./routes";
import authRoutes from "./routes/auth";

// Simple logging function
const log = (message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [express] ${message}`);
};

// Load environment variables
dotenv.config();

async function startServer() {
  console.log('Starting server initialization...');

  // Connect to MongoDB - Skip if no valid URI provided
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<db_password>')) {
    try {
      await connectDB();
    } catch (error) {
      console.warn('MongoDB connection failed, continuing without database:', error);
    }
  } else {
    console.log('MongoDB URI not configured, running in demo mode without database');
  }

  const app = express();
console.log('Express app created');

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your production domain
    : ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

console.log('Express middleware configured');

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Authentication routes
app.use('/api/auth', authRoutes);

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Next.js handles the frontend, this server only serves the API

  // Serve the API on port 3001 (Next.js runs on 3000)
  const port = parseInt(process.env.PORT || '3001', 10);
  server.listen(port, "0.0.0.0", () => {
    console.log(`✓ API server ready on http://localhost:${port}`);
    log(`API server running on port ${port}`);
  });
})();
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

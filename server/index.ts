process.env.NODE_ENV = process.env.NODE_ENV || "development";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testConnection } from "./db";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});


// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || false 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT || 5000);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✓ Set" : "✗ Missing");

// Test database connection on startup
testConnection().then((connected) => {
  if (!connected) {
    console.error("Failed to connect to database. Exiting...");
    process.exit(1);
  }
}).catch((error) => {
  console.error("Database connection test failed:", error);
  process.exit(1);
});

// Logging middleware for API requests
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
      if (capturedJsonResponse && Object.keys(capturedJsonResponse).length > 0) {
        // Log product count for products endpoint
        if (path === "/api/products" && capturedJsonResponse.products) {
          logLine += ` :: ${capturedJsonResponse.products.length} products`;
        } else {
          const responsePreview = JSON.stringify(capturedJsonResponse).substring(0, 100);
          logLine += ` :: ${responsePreview}${JSON.stringify(capturedJsonResponse).length > 100 ? '...' : ''}`;
        }
      }
      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? 'connected' : 'not configured'
  });
});

(async () => {
  try {
    // Register routes (includes auth setup)
    const server = registerRoutes(app);

    // Global error handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error(`Error ${status}:`, {
        message,
        path: req.path,
        method: req.method,
        stack: process.env.NODE_ENV === 'development' ? err.stack : 'Hidden in production',
        timestamp: new Date().toISOString()
      });

      res.status(status).json({ 
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    // Setup Vite middleware in development
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    const port = parseInt(process.env.PORT || "5000", 10);
    const host = process.env.HOST || "0.0.0.0";
    
    server.listen(port, host, () => {
      log(`🚀 Server running on http://${host}:${port}`);
      log(`📊 Health check available at http://${host}:${port}/api/health`);
      log(`🛒 API endpoints available at http://${host}:${port}/api/`);
      log(`🔧 Debug endpoint: http://${host}:${port}/api/debug/products`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
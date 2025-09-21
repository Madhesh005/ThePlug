import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0'] as string[],
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't exit process on Vite errors in development
        console.error('Vite error (continuing):', msg);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // Skip API routes
    if (url.startsWith('/api/')) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "client",
        "index.html",
      );

      // Check if template exists
      if (!fs.existsSync(clientTemplate)) {
        console.error('Template not found:', clientTemplate);
        return res.status(500).send('Template not found');
      }

      // Always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      const error = e as Error;
      vite.ssrFixStacktrace(error);
      console.error('Vite SSR error:', error);
      next(error);
    }
  });
}

// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  if (process.env.NODE_ENV === "development") {
    console.log("Dev mode detected — skipping static serve.");
    return;
  }

  const distPath = path.resolve(__dirname, "..", "client", "dist");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true,
  }));

  app.use("*", (req, res) => {
    // Skip API routes
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
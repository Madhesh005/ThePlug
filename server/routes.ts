import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProductSchema, insertCartSchema, insertOrderSchema, insertContactSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      const products = category 
        ? await storage.getProductsByCategory(category as string)
        : await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cart routes
  app.get("/api/cart", requireAuth, async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.user!.id);
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCartSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/cart/:productId", requireAuth, async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartQuantity(
        req.user!.id,
        req.params.productId,
        quantity
      );
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cart/:productId", requireAuth, async (req, res) => {
    try {
      await storage.removeFromCart(req.user!.id, req.params.productId);
      res.sendStatus(204);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cart", requireAuth, async (req, res) => {
    try {
      await storage.clearCart(req.user!.id);
      res.sendStatus(204);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Order routes
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const order = await storage.createOrder(validatedData);
      
      // Clear cart after successful order
      await storage.clearCart(req.user!.id);
      
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getUserOrders(req.user!.id);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order || order.userId !== req.user!.id) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Seed products route (for initial data)
  app.post("/api/seed-products", async (req, res) => {
    try {
      const sampleProducts = [
        {
          name: "GameView P7 27\" 4K IPS",
          category: "monitors",
          price: "299.00",
          originalPrice: "499.00",
          rating: "4.7",
          image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          description: "Professional 4K gaming monitor with IPS panel",
          inStock: 15,
        },
        {
          name: "MechaPro Hot-Swap Wireless",
          category: "keyboards",
          price: "129.00",
          rating: "4.3",
          image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          description: "Hot-swappable mechanical keyboard with wireless connectivity",
          inStock: 25,
        },
        {
          name: "Swift Wireless Gaming",
          category: "mice",
          price: "69.00",
          rating: "4.6",
          image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          description: "High precision wireless gaming mouse",
          inStock: 30,
        },
        {
          name: "StudioOne Closed-back",
          category: "audio",
          price: "139.00",
          rating: "4.5",
          image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          description: "Professional closed-back studio headphones",
          inStock: 20,
        },
        {
          name: "HDMI 2.1 Ultra Cable",
          category: "accessories",
          price: "24.00",
          rating: "4.7",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          description: "Ultra high-speed HDMI 2.1 cable for 4K gaming",
          inStock: 50,
        },
        {
          name: "Nova 15.6\" Portable Monitor",
          category: "monitors",
          price: "199.00",
          rating: "4.4",
          image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          description: "Portable USB-C monitor for mobile workstations",
          inStock: 12,
        },
        {
          name: "FlexArm Monitor Mount",
          category: "accessories",
          price: "79.00",
          rating: "4.6",
          image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          description: "Adjustable dual monitor mount with full articulation",
          inStock: 18,
        },
        {
          name: "ColorCal Pro Calibrator",
          category: "accessories",
          price: "159.00",
          rating: "4.5",
          image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          description: "Professional monitor color calibration device",
          inStock: 8,
        },
      ];

      for (const productData of sampleProducts) {
        await storage.createProduct(productData);
      }

      res.json({ message: "Products seeded successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

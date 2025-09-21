import { pgTable, text, varchar, decimal, integer, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table - Fixed column mappings
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("originalprice", { precision: 10, scale: 2 }), // Fixed: was "original_price"
  rating: decimal("rating", { precision: 2, scale: 1 }),
  image: text("image"),
  description: text("description"),
  inStock: integer("instock").default(0), // Fixed: was "in_stock"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cart table
export const cart = pgTable("cart", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  items: text("items").notNull(), // JSON string of order items
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  shippingAddress: text("shipping_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contacts table
export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Cart = typeof cart.$inferSelect;
export type InsertCart = typeof cart.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(50),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(1).max(255),
  category: z.string().min(1).max(100),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  rating: z.string().regex(/^\d+(\.\d{1})?$/).optional(),
  inStock: z.number().min(0),
});

export const insertCartSchema = createInsertSchema(cart, {
  quantity: z.number().min(1).default(1),
});

export const insertOrderSchema = createInsertSchema(orders, {
  items: z.string(),
  total: z.string().regex(/^\d+(\.\d{1,2})?$/),
  status: z.string().optional(),
});

export const insertContactSchema = createInsertSchema(contacts, {
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1),
});
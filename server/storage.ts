import { users, products, cart, orders, contacts, type User, type InsertUser, type Product, type InsertProduct, type Cart, type InsertCart, type Order, type InsertOrder, type Contact, type InsertContact } from "../shared/schema";
import { db, pool } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import pgSession from "connect-pg-simple";

const PostgresSessionStore = pgSession(session);

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart
  getCartItems(userId: string): Promise<(Cart & { product: Product })[]>;
  addToCart(cartItem: InsertCart): Promise<Cart>;
  updateCartQuantity(userId: string, productId: string, quantity: number): Promise<Cart | undefined>;
  removeFromCart(userId: string, productId: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;

  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      schemaName: 'public',
      tableName: 'session'
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('Fetching all products from database...');
      const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
      console.log(`Found ${allProducts.length} products in database`);
      
      // Debug: Log the first product to see the structure
      if (allProducts.length > 0) {
        console.log('Sample product:', JSON.stringify(allProducts[0], null, 2));
      }
      
      return allProducts;
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error; // Throw error to see it in the API response
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log(`Fetching products for category: ${category}`);
      const categoryProducts = await db.select().from(products).where(eq(products.category, category));
      console.log(`Found ${categoryProducts.length} products for category ${category}`);
      return categoryProducts;
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      const [product] = await db.select().from(products).where(eq(products.id, id));
      return product || undefined;
    } catch (error) {
      console.error('Error getting product:', error);
      return undefined;
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      console.log('Creating product:', JSON.stringify(insertProduct, null, 2));
      const [product] = await db
        .insert(products)
        .values({
          ...insertProduct,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      console.log('Created product:', JSON.stringify(product, null, 2));
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getCartItems(userId: string): Promise<(Cart & { product: Product })[]> {
    try {
      const result = await db
        .select({
          cart: cart,
          product: products
        })
        .from(cart)
        .innerJoin(products, eq(cart.productId, products.id))
        .where(eq(cart.userId, userId));
      
      return result.map(row => ({ ...row.cart, product: row.product }));
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  async addToCart(cartItem: InsertCart): Promise<Cart> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, cartItem.userId), eq(cart.productId, cartItem.productId)));

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cart)
        .set({ 
          quantity: (existingItem.quantity || 0) + (cartItem.quantity || 1),
          updatedAt: new Date()
        })
        .where(eq(cart.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Create new cart item
      const [newItem] = await db
        .insert(cart)
        .values({
          ...cartItem,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return newItem;
    }
  }

  async updateCartQuantity(userId: string, productId: string, quantity: number): Promise<Cart | undefined> {
    try {
      if (quantity <= 0) {
        await this.removeFromCart(userId, productId);
        return undefined;
      }

      const [updatedItem] = await db
        .update(cart)
        .set({ 
          quantity,
          updatedAt: new Date()
        })
        .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
        .returning();
      return updatedItem || undefined;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return undefined;
    }
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    try {
      await db
        .delete(cart)
        .where(and(eq(cart.userId, userId), eq(cart.productId, productId)));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      await db.delete(cart).where(eq(cart.userId, userId));
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newOrder;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      return await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  async getOrder(id: string): Promise<Order | undefined> {
    try {
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      return order || undefined;
    } catch (error) {
      console.error('Error getting order:', error);
      return undefined;
    }
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db
      .insert(contacts)
      .values({
        ...contact,
        createdAt: new Date(),
      })
      .returning();
    return newContact;
  }
}

export const storage = new DatabaseStorage();
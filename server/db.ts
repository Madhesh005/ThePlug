import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";
import dotenv from "dotenv";

dotenv.config();

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a connection pool with better configuration
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('New client connected to the database');
});

// Initialize Drizzle ORM with the pool and schema
export const db = drizzle(pool, { schema });

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Test a simple query to make sure everything works
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database time:', result.rows[0].now);
    
    // Test if products table exists and has data
    try {
      const productCount = await client.query('SELECT COUNT(*) FROM products');
      console.log(`📦 Products in database: ${productCount.rows[0].count}`);
    } catch (error) {
      console.log('⚠️ Products table might not exist yet');
    }
    
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    return false;
  }
}
/**
 * Express API Server
 * Handles API routes for Vite development
 * This server wraps Next.js-style API routes to work with Vite
 * 
 * Run with: tsx server/api-server.js
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local (or .env as fallback)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config({ path: join(__dirname, '..', '.env') }); // Fallback to .env

// Construct DATABASE_URL from individual variables if not set
function getDatabaseUrl() {
  // If DATABASE_URL is already set, use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Otherwise, construct it from individual variables
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '5432';
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const sslRequired = process.env.DB_SSL_REQUIRED === 'true';

  if (host && username && password && database) {
    const sslMode = sslRequired ? '?sslmode=require' : '';
    const url = `postgresql://${username}:${password}@${host}:${port}/${database}${sslMode}`;
    // Set it in process.env so other code can use it
    process.env.DATABASE_URL = url;
    return url;
  }

  return undefined;
}

// Initialize DATABASE_URL if not set
getDatabaseUrl();

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper to convert Express req/res to Next.js format
function createNextRequest(req) {
  return {
    json: async () => req.body,
    url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  };
}

function createNextParams(req) {
  return req.params;
}

// Import and setup routes dynamically
async function setupRoutes() {
  try {
    // Products route - Direct database query for now
    app.get('/api/products', async (req, res) => {
      try {
        // Import database pool
        // Use .ts extension when running with tsx, or .js if compiled
        let dbModule;
        try {
          dbModule = await import('../src/lib/db.ts');
        } catch (importError) {
          // Fallback to .js if .ts import fails
          try {
            dbModule = await import('../src/lib/db.js');
          } catch (jsError) {
            console.error('Failed to import db module:', importError.message);
            throw new Error(`Database module import failed: ${importError.message}`);
          }
        }
        const pool = dbModule.default;
        
        const dbUrl = getDatabaseUrl();
        if (!dbUrl) {
          console.warn('DATABASE_URL not configured');
          return res.status(200).json({
            products: [],
            count: 0,
            error: "DATABASE_URL not configured",
            lastUpdated: new Date().toISOString(),
            source: "error",
          });
        }

        const result = await pool.query(`
          SELECT 
            p.id,
            p.sku,
            p.name,
            p.image_url,
            p.price::text as price,
            p.vat_percentage,
            p.base_unit,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', d.id,
                  'percentage', d.percentage::text,
                  'flat_amount', d.flat_amount::text,
                  'is_active', d.is_active
                )
              ) FILTER (WHERE d.id IS NOT NULL),
              '[]'::json
            ) as discounts
          FROM products p
          LEFT JOIN discounts d ON d."productId" = p.id AND d.is_active = true
          GROUP BY p.id, p.sku, p.name, p.image_url, p.price, p.vat_percentage, p.base_unit
          ORDER BY p.created_at DESC
        `);

        // Transform products
        const products = result.rows.map((row) => {
              const saleType = row.base_unit?.toLowerCase().includes('meter') || row.base_unit?.toLowerCase().includes('metre') 
                ? 'metre' 
                : row.base_unit?.toLowerCase().includes('roll') 
                ? 'roll' 
                : row.base_unit?.toLowerCase().includes('sheet') || row.base_unit?.toLowerCase().includes('board')
                ? 'board'
                : 'unit';
          
          const variantLabel = saleType.charAt(0).toUpperCase() + saleType.slice(1);
          let price = parseFloat(row.price);
          
          // Apply discounts
          const discounts = Array.isArray(row.discounts) ? row.discounts : [];
          const activeDiscount = discounts.find((d) => d.is_active);
          if (activeDiscount?.percentage) {
            price = price * (1 - parseFloat(activeDiscount.percentage) / 100);
          }

          return {
            id: row.sku.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
            sku: row.sku,
            name: row.name,
            image: row.image_url?.startsWith("http") ? row.image_url : `/images/product-placeholder.jpg`,
            price: Math.max(0, price),
            variants: [{ name: variantLabel, price: Math.max(0, price) }],
            description: `Sold per ${saleType.toLowerCase()}.`,
            saleType: saleType,
            baseUnit: row.base_unit || "pcs",
            vatPercentage: row.vat_percentage || 18,
            originalPrice: parseFloat(row.price),
            hasDiscount: discounts.some((d) => d.is_active),
          };
        });

        res.json({
          products,
          count: products.length,
          lastUpdated: new Date().toISOString(),
          source: "database",
        });
      } catch (error) {
        console.error('Products route error:', error);
        console.error('Error stack:', error.stack);
        // Return 200 with error info so frontend can handle gracefully
        res.status(200).json({
          products: [],
          count: 0,
          error: error.message || 'Unknown error',
          lastUpdated: new Date().toISOString(),
          source: "error",
        });
      }
    });

    // Orders routes - Direct implementation
    app.post('/api/orders', async (req, res) => {
      try {
        const { saveOrder } = await import('../src/lib/db.ts');
        const orderData = req.body;
        
        // Validate
        if (!orderData.store_id || !orderData.products || !orderData.delivery) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const savedOrder = await saveOrder(orderData);
        res.status(201).json({
          message: "Order submitted successfully",
          sale_id: savedOrder.sale_id,
          order_id: savedOrder.id,
        });
      } catch (error) {
        console.error('Orders route error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    app.get('/api/orders/:orderId', async (req, res) => {
      try {
        const { getOrderById } = await import('../src/lib/db.ts');
        const order = await getOrderById(req.params.orderId);
        
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }
        
        res.json(order);
      } catch (error) {
        console.error('Order by ID route error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Delivery routes - Direct implementation
    app.get('/api/delivery/order-items', async (req, res) => {
      try {
        const dbModule = await import('../src/lib/db.ts');
        const pool = dbModule.default;
        const orderId = req.query.order_id;

        if (!orderId) {
          return res.status(400).json({ message: "order_id query parameter is required" });
        }

        const result = await pool.query(`
          SELECT 
            si.id, si.quantity, si.price, si.total,
            p.id as product_id, p.name as product_name, p.base_unit as unit
          FROM sale_items si
          JOIN products p ON p.id = si."productId"
          WHERE si."saleId" = $1
          ORDER BY si.id
        `, [orderId]);

        const deliveryResult = await pool.query(`
          SELECT recipient_name, recipient_phone, recipient_email, delivery_address, status
          FROM sale_deliveries WHERE "saleId" = $1 LIMIT 1
        `, [orderId]);

        const items = result.rows.map((row) => ({
          id: row.id,
          product_id: row.product_id,
          name: row.product_name,
          quantity: row.quantity,
          price: parseFloat(row.price),
          unit: row.unit || 'pcs',
        }));

        res.json({
          order_id: orderId,
          items: items,
          delivery: deliveryResult.rows[0] || null,
        });
      } catch (error) {
        console.error('Order items route error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/delivery/generate-otp', async (req, res) => {
      try {
        const dbModule = await import('../src/lib/db.ts');
        const pool = dbModule.default;
        const { order_id } = req.body;

        if (!order_id) {
          return res.status(400).json({ message: "order_id is required" });
        }

        const deliveryResult = await pool.query(`
          SELECT sd.id, sd.recipient_phone, sd."saleId"
          FROM sale_deliveries sd
          JOIN sales s ON s.id = sd."saleId"
          WHERE s.id = $1 OR sd."saleId" = $1 LIMIT 1
        `, [order_id]);

        if (deliveryResult.rows.length === 0) {
          return res.status(404).json({ message: "Order not found" });
        }

        const delivery = deliveryResult.rows[0];
        const phoneNumber = delivery.recipient_phone;

        if (!phoneNumber) {
          return res.status(400).json({ message: "Phone number not found for this order" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(`
          UPDATE sale_deliveries 
          SET otp = $1, otp_expires_at = $2, otp_verified = false, updated_at = NOW()
          WHERE id = $3
        `, [otp, expiresAt, delivery.id]);

        console.log(`OTP for order ${order_id}: ${otp} (sent to ${phoneNumber})`);

        res.json({
          message: "OTP generated successfully",
          otp: process.env.NODE_ENV === 'development' ? otp : undefined,
          expires_at: expiresAt.toISOString(),
          phone_number: phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3'),
        });
      } catch (error) {
        console.error('Generate OTP route error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/delivery/verify-otp', async (req, res) => {
      try {
        const dbModule = await import('../src/lib/db.ts');
        const pool = dbModule.default;
        const { order_id, otp, delivered_items } = req.body;

        if (!order_id || !otp) {
          return res.status(400).json({ message: "order_id and otp are required" });
        }

        const deliveryResult = await pool.query(`
          SELECT sd.id, sd.otp, sd.otp_expires_at, sd.otp_verified, sd."saleId"
          FROM sale_deliveries sd
          JOIN sales s ON s.id = sd."saleId"
          WHERE s.id = $1 OR sd."saleId" = $1 LIMIT 1
        `, [order_id]);

        if (deliveryResult.rows.length === 0) {
          return res.status(404).json({ message: "Order not found" });
        }

        const delivery = deliveryResult.rows[0];

        if (delivery.otp_verified) {
          return res.status(400).json({ message: "Delivery already completed" });
        }

        if (!delivery.otp) {
          return res.status(400).json({ message: "OTP not generated. Please generate OTP first." });
        }

        const expiresAt = new Date(delivery.otp_expires_at);
        if (expiresAt < new Date()) {
          return res.status(400).json({ message: "OTP has expired. Please generate a new OTP." });
        }

        if (delivery.otp !== otp) {
          return res.status(400).json({ message: "Invalid OTP" });
        }

        await pool.query('BEGIN');
        try {
          await pool.query(`
            UPDATE sale_deliveries 
            SET otp_verified = true, status = 'delivered', delivery_date = NOW(), updated_at = NOW()
            WHERE id = $1
          `, [delivery.id]);

          await pool.query(`
            UPDATE sales SET status = 'completed', updated_at = NOW() WHERE id = $1
          `, [delivery.saleId]);

          if (delivered_items && Array.isArray(delivered_items)) {
            for (const item of delivered_items) {
              await pool.query(`
                INSERT INTO delivered_items (quantity, price, total, "deliveryId", "productId")
                VALUES ($1, $2, $3, $4, $5)
              `, [item.quantity, item.price, item.price * item.quantity, delivery.id, item.product_id]);
            }
          }

          await pool.query('COMMIT');
        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        }

        res.json({
          message: "Delivery completed successfully",
          delivery_id: delivery.id,
          sale_id: delivery.saleId,
        });
      } catch (error) {
        console.error('Verify OTP route error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Payment route
    app.post('/api/payment', async (req, res) => {
      try {
        const { sale_id, payment_method } = req.body;
        if (!sale_id || !payment_method) {
          return res.status(400).json({ message: "sale_id and payment_method are required." });
        }
        console.log(`Processing payment for Sale ID: ${sale_id} with method: ${payment_method}`);
        res.json({ message: `Payment for sale ${sale_id} processed successfully via ${payment_method}.` });
      } catch (error) {
        console.error('Payment route error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // STK route
    app.post('/api/stk', async (req, res) => {
      try {
        const { phone, amount } = req.body;
        console.log(`STK push requested for phone: ${phone}, amount: ${amount}`);
        res.json({ message: "STK push initiated. Please check your phone." });
      } catch (error) {
        console.error('STK route error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // DB Test route
    app.get('/api/db-test', async (req, res) => {
      try {
        const dbModule = await import('../src/lib/db.ts');
        const pool = dbModule.default;
        
        const results = {
          database_url_set: !!process.env.DATABASE_URL,
          connection_test: null,
          query_test: null,
        };

        const dbUrl = getDatabaseUrl();
        if (!dbUrl) {
          return res.json({ ...results, error: "DATABASE_URL not set" });
        }

        const client = await pool.connect();
        results.connection_test = "Success";
        
        try {
          const testQuery = await client.query('SELECT NOW() as current_time');
          results.query_test = "Success";
          results.current_time = testQuery.rows[0].current_time;

          const tablesQuery = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name IN ('sales', 'sale_items', 'products')
          `);
          results.tables_found = tablesQuery.rows.map(r => r.table_name);

          const salesCount = await client.query('SELECT COUNT(*) as count FROM sales');
          results.sales_count = parseInt(salesCount.rows[0].count);
        } finally {
          client.release();
        }

        res.json(results);
      } catch (error) {
        console.error('DB test route error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    console.log('✅ All API routes loaded successfully');
  } catch (error) {
    console.error('❌ Error loading API routes:', error);
    console.error('Error stack:', error.stack);
  }
}

// Start server
setupRoutes().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
    console.log(`💡 Make sure to run this server alongside Vite dev server`);
    const dbUrl = getDatabaseUrl();
    console.log(`📝 DATABASE_URL: ${dbUrl ? 'Set ✓' : 'Not set ✗'}`);
    if (!dbUrl) {
      console.log('   Available DB variables:', {
        DB_HOST: process.env.DB_HOST ? 'Set' : 'Not set',
        DB_USERNAME: process.env.DB_USERNAME ? 'Set' : 'Not set',
        DB_PASSWORD: process.env.DB_PASSWORD ? 'Set' : 'Not set',
        DB_NAME: process.env.DB_NAME ? 'Set' : 'Not set',
      });
    }
  });
}).catch((error) => {
  console.error('Failed to start API server:', error);
  console.error('Error details:', error.stack);
  process.exit(1);
});


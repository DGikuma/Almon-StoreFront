/**
 * Database Connection Utility
 * PostgreSQL connection using pg library
 */

import pg from 'pg';
const { Pool } = pg;

// Construct DATABASE_URL from individual variables if not set
function getDatabaseUrl(): string | undefined {
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
    return `postgresql://${username}:${password}@${host}:${port}/${database}${sslMode}`;
  }

  return undefined;
}

const databaseUrl = getDatabaseUrl();

// Initialize database connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  // Neon and most cloud PostgreSQL providers require SSL
  ssl: databaseUrl?.includes('neon.tech') ||
    databaseUrl?.includes('sslmode=require') ||
    databaseUrl?.includes('sslmode=prefer') ||
    process.env.DB_SSL_REQUIRED === 'true'
    ? { rejectUnauthorized: false }
    : false,
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;

/**
 * Database interface for orders
 * Implement these functions based on your database setup
 */
export interface OrderData {
  store_id: string;
  customer_name: string;
  phone_number: string;
  payment_method: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_email?: string;
  delivery_address: string;
  delivery_fee?: number;
  products: Array<{
    product_id: string;
    quantity: number;
    unit: string;
    price?: number; // Optional: if not provided, will fetch from products table
  }>;
}

export interface SavedOrder {
  id: string;
  sale_id: string;
  store_id: string;
  customer_name: string;
  phone_number: string;
  payment_method: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_email?: string;
  delivery_address: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get an unused sale_id from reserved_sale_ids table
 */
async function getUnusedSaleId(): Promise<string> {
  const client = await pool.connect();
  try {
    // Get an unused sale_id and mark it as used atomically
    const result = await client.query(
      `UPDATE reserved_sale_ids 
       SET used = true 
       WHERE sale_id = (
         SELECT sale_id 
         FROM reserved_sale_ids 
         WHERE used = false 
         LIMIT 1 
         FOR UPDATE SKIP LOCKED
       )
       RETURNING sale_id`
    );

    if (result.rows.length === 0) {
      throw new Error('No available sale IDs. Please generate more sale IDs in reserved_sale_ids table.');
    }

    return result.rows[0].sale_id;
  } finally {
    client.release();
  }
}

/**
 * Get product price from products table
 */
async function getProductPrice(productId: string): Promise<number> {
  const result = await pool.query(
    `SELECT price FROM products WHERE id = $1`,
    [productId]
  );

  if (result.rows.length === 0) {
    throw new Error(`Product ${productId} not found`);
  }

  return parseFloat(result.rows[0].price);
}

/**
 * Calculate discount for a product
 */
async function getProductDiscount(productId: string): Promise<number> {
  const result = await pool.query(
    `SELECT percentage, flat_amount 
     FROM discounts 
     WHERE "productId" = $1 AND is_active = true 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [productId]
  );

  if (result.rows.length === 0) {
    return 0;
  }

  const discount = result.rows[0];
  // For now, return percentage discount (you can enhance this logic)
  return parseFloat(discount.percentage || '0');
}

/**
 * Save order to database
 */
export async function saveOrder(orderData: OrderData): Promise<SavedOrder> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Get an unused sale_id
    const saleId = await getUnusedSaleId();

    // 2. Calculate totals for products
    let totalAmount = 0;
    let discountAmount = 0;
    const saleItems: Array<{ productId: string; quantity: number; price: number; total: number }> = [];

    for (const product of orderData.products) {
      // Get product price (use provided price or fetch from database)
      const productPrice = product.price || await getProductPrice(product.product_id);

      // Get discount
      const discountPercent = await getProductDiscount(product.product_id);

      // Calculate item total
      const itemSubtotal = productPrice * product.quantity;
      const itemDiscount = (itemSubtotal * discountPercent) / 100;
      const itemTotal = itemSubtotal - itemDiscount;

      totalAmount += itemSubtotal;
      discountAmount += itemDiscount;

      saleItems.push({
        productId: product.product_id,
        quantity: product.quantity,
        price: productPrice,
        total: itemTotal,
      });
    }

    // Calculate payable amount (total - discount + delivery fee)
    const deliveryFee = orderData.delivery_fee || 0;
    const payableAmount = totalAmount - discountAmount + deliveryFee;

    // 3. Insert into sales table
    const salesResult = await client.query(
      `INSERT INTO sales (
        id, total_amount, discount_amount, payable_amount, 
        status, sale_source, customer_name, "storeId", created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *`,
      [
        saleId,
        totalAmount,
        discountAmount,
        payableAmount,
        'pending',
        'storefront', // or 'store' based on your needs
        orderData.customer_name,
        orderData.store_id,
      ]
    );

    const sale = salesResult.rows[0];

    // 4. Insert sale items
    for (const item of saleItems) {
      await client.query(
        `INSERT INTO sale_items (quantity, price, total, "saleId", "productId")
         VALUES ($1, $2, $3, $4, $5)`,
        [item.quantity, item.price, item.total, saleId, item.productId]
      );
    }

    // 5. Insert delivery information
    await client.query(
      `INSERT INTO sale_deliveries (
        status, recipient_name, recipient_phone, recipient_email, 
        delivery_address, delivery_fee, "saleId", created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [
        'pending',
        orderData.recipient_name,
        orderData.recipient_phone,
        orderData.recipient_email || null,
        orderData.delivery_address,
        deliveryFee,
        saleId,
      ]
    );

    // 6. Create payment record
    await client.query(
      `INSERT INTO payments (id, payment_method, amount, status, "saleId", created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [
        `PAY${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        orderData.payment_method,
        payableAmount,
        'pending',
        saleId,
      ]
    );

    await client.query('COMMIT');

    // Return saved order
    return {
      id: sale.id,
      sale_id: sale.id, // In your schema, id is the sale_id
      store_id: sale.storeId,
      customer_name: sale.customer_name,
      phone_number: orderData.phone_number,
      payment_method: orderData.payment_method,
      recipient_name: orderData.recipient_name,
      recipient_phone: orderData.recipient_phone,
      recipient_email: orderData.recipient_email,
      delivery_address: orderData.delivery_address,
      status: sale.status,
      created_at: sale.created_at,
      updated_at: sale.created_at, // Use created_at as updated_at initially
    };
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Database error saving order:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get order by sale_id (in your schema, sale.id is the sale_id)
 */
export async function getOrderBySaleId(saleId: string): Promise<SavedOrder | null> {
  try {
    // Check database connection
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      throw new Error('Database connection not configured');
    }

    console.log(`Fetching order with sale_id: ${saleId}`);

    const result = await pool.query(
      `SELECT 
        s.id,
        s."storeId" as store_id,
        s.customer_name,
        s.status,
        s.created_at,
        sd.recipient_name,
        sd.recipient_phone,
        sd.recipient_email,
        sd.delivery_address,
        p.payment_method,
        p.id as payment_id
       FROM sales s
       LEFT JOIN sale_deliveries sd ON sd."saleId" = s.id
       LEFT JOIN payments p ON p."saleId" = s.id
       WHERE s.id = $1
       LIMIT 1`,
      [saleId]
    );

    console.log(`Query returned ${result.rows.length} rows`);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    // Get phone number from delivery or payment
    const phoneResult = await pool.query(
      `SELECT mpesa_phone_number FROM payments WHERE "saleId" = $1 LIMIT 1`,
      [saleId]
    );
    const phoneNumber = phoneResult.rows[0]?.mpesa_phone_number || row.recipient_phone || '';

    return {
      id: row.id,
      sale_id: row.id,
      store_id: row.store_id,
      customer_name: row.customer_name,
      phone_number: phoneNumber,
      payment_method: row.payment_method || '',
      recipient_name: row.recipient_name,
      recipient_phone: row.recipient_phone,
      recipient_email: row.recipient_email,
      delivery_address: row.delivery_address,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.created_at,
    };
  } catch (error: any) {
    console.error('Database error getting order by sale_id:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });
    return null;
  }
}

/**
 * Get order by ID (same as sale_id in your schema)
 */
export async function getOrderById(orderId: string): Promise<SavedOrder | null> {
  // In your schema, sales.id is the sale_id, so this is the same as getOrderBySaleId
  return getOrderBySaleId(orderId);
}


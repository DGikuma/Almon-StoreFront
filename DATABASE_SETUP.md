# Database Setup Guide

This guide explains how to connect your database to the orders API.

## Step 1: Install Database Client (if needed)

Choose one based on your database:

### PostgreSQL
```bash
npm install pg @types/pg
```

### MySQL
```bash
npm install mysql2
```

### MongoDB
```bash
npm install mongodb
```

### Prisma (Recommended)
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

## Step 2: Configure Environment Variables

Add your database connection string to `.env.local`:

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# MySQL
DATABASE_URL=mysql://user:password@localhost:3306/dbname

# MongoDB
DATABASE_URL=mongodb://user:password@localhost:27017/dbname
```

## Step 3: Implement Database Functions

Edit `src/lib/db.ts` and implement the `saveOrder()` function based on your database:

### Option A: Prisma (Recommended)

1. Define your schema in `prisma/schema.prisma`:
```prisma
model Order {
  id            String   @id @default(cuid())
  sale_id      String   @unique
  store_id     String
  customer_name String
  phone_number String
  payment_method String
  recipient_name String
  recipient_phone String
  recipient_email String?
  delivery_address String
  status       String   @default("pending")
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
  orderItems   OrderItem[]
}

model OrderItem {
  id         String @id @default(cuid())
  order_id   String
  order      Order  @relation(fields: [order_id], references: [id])
  product_id String
  quantity   Int
  unit       String
}
```

2. Update `src/lib/db.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function saveOrder(orderData: OrderData): Promise<SavedOrder> {
  const saleId = `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const order = await prisma.order.create({
    data: {
      sale_id: saleId,
      store_id: orderData.store_id,
      customer_name: orderData.customer_name,
      phone_number: orderData.phone_number,
      payment_method: orderData.payment_method,
      recipient_name: orderData.recipient_name,
      recipient_phone: orderData.recipient_phone,
      recipient_email: orderData.recipient_email,
      delivery_address: orderData.delivery_address,
      status: 'pending',
      orderItems: {
        create: orderData.products.map(p => ({
          product_id: p.product_id,
          quantity: p.quantity,
          unit: p.unit,
        })),
      },
    },
  });
  
  return {
    id: order.id,
    sale_id: order.sale_id,
    store_id: order.store_id,
    customer_name: order.customer_name,
    phone_number: order.phone_number,
    payment_method: order.payment_method,
    recipient_name: order.recipient_name,
    recipient_phone: order.recipient_phone,
    recipient_email: order.recipient_email || undefined,
    delivery_address: order.delivery_address,
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}

export async function getOrderById(orderId: string): Promise<SavedOrder | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });
  
  if (!order) return null;
  
  return {
    id: order.id,
    sale_id: order.sale_id,
    store_id: order.store_id,
    customer_name: order.customer_name,
    phone_number: order.phone_number,
    payment_method: order.payment_method,
    recipient_name: order.recipient_name,
    recipient_phone: order.recipient_phone,
    recipient_email: order.recipient_email || undefined,
    delivery_address: order.delivery_address,
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}

export async function getOrderBySaleId(saleId: string): Promise<SavedOrder | null> {
  const order = await prisma.order.findUnique({
    where: { sale_id: saleId },
    include: { orderItems: true },
  });
  
  if (!order) return null;
  
  return {
    id: order.id,
    sale_id: order.sale_id,
    store_id: order.store_id,
    customer_name: order.customer_name,
    phone_number: order.phone_number,
    payment_method: order.payment_method,
    recipient_name: order.recipient_name,
    recipient_phone: order.recipient_phone,
    recipient_email: order.recipient_email || undefined,
    delivery_address: order.delivery_address,
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}
```

### Option B: PostgreSQL (Direct Connection)

```typescript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function saveOrder(orderData: OrderData): Promise<SavedOrder> {
  const saleId = `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const orderResult = await client.query(
      `INSERT INTO orders (sale_id, store_id, customer_name, phone_number, payment_method,
        recipient_name, recipient_phone, recipient_email, delivery_address, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [saleId, orderData.store_id, orderData.customer_name, orderData.phone_number,
       orderData.payment_method, orderData.recipient_name, orderData.recipient_phone,
       orderData.recipient_email, orderData.delivery_address, 'pending']
    );
    
    const order = orderResult.rows[0];
    
    // Insert order items
    for (const product of orderData.products) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit)
         VALUES ($1, $2, $3, $4)`,
        [order.id, product.product_id, product.quantity, product.unit]
      );
    }
    
    await client.query('COMMIT');
    
    return {
      id: order.id,
      sale_id: order.sale_id,
      store_id: order.store_id,
      customer_name: order.customer_name,
      phone_number: order.phone_number,
      payment_method: order.payment_method,
      recipient_name: order.recipient_name,
      recipient_phone: order.recipient_phone,
      recipient_email: order.recipient_email,
      delivery_address: order.delivery_address,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### Option C: MongoDB

```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL!);
await client.connect();
const db = client.db();

export async function saveOrder(orderData: OrderData): Promise<SavedOrder> {
  const saleId = `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const order = {
    sale_id: saleId,
    store_id: orderData.store_id,
    customer_name: orderData.customer_name,
    phone_number: orderData.phone_number,
    payment_method: orderData.payment_method,
    recipient_name: orderData.recipient_name,
    recipient_phone: orderData.recipient_phone,
    recipient_email: orderData.recipient_email,
    delivery_address: orderData.delivery_address,
    products: orderData.products,
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  };
  
  const result = await db.collection('orders').insertOne(order);
  
  return {
    id: result.insertedId.toString(),
    sale_id: saleId,
    store_id: order.store_id,
    customer_name: order.customer_name,
    phone_number: order.phone_number,
    payment_method: order.payment_method,
    recipient_name: order.recipient_name,
    recipient_phone: order.recipient_phone,
    recipient_email: order.recipient_email,
    delivery_address: order.delivery_address,
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}
```

## Step 4: Test the Integration

1. Start your development server
2. Submit an order through the checkout modal
3. Check your database to verify the order was saved
4. Verify the `sale_id` is returned correctly

## Troubleshooting

- **Connection errors**: Verify your `DATABASE_URL` is correct
- **Table/collection doesn't exist**: Create the necessary tables/collections
- **Type errors**: Ensure your database schema matches the `SavedOrder` interface
- **Transaction errors**: Check your database connection and permissions

## Next Steps

After implementing the database functions:
1. Test order creation
2. Implement order retrieval
3. Add order status updates
4. Set up order history queries


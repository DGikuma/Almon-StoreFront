import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * GET /api/db-test
 * Test database connection and basic queries
 */
export async function GET() {
  const results: any = {
    database_url_set: !!process.env.DATABASE_URL,
    database_url_preview: process.env.DATABASE_URL ? 
      `${process.env.DATABASE_URL.substring(0, 20)}...` : 'Not set',
    connection_test: null,
    query_test: null,
    error: null,
  };

  try {
    // Test 1: Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        ...results,
        error: "DATABASE_URL environment variable is not set",
      }, { status: 500 });
    }

    // Test 2: Try to connect
    const client = await pool.connect();
    results.connection_test = "Success";
    
    try {
      // Test 3: Try a simple query
      const testQuery = await client.query('SELECT NOW() as current_time, version() as pg_version');
      results.query_test = "Success";
      results.current_time = testQuery.rows[0].current_time;
      results.pg_version = testQuery.rows[0].pg_version.substring(0, 50);

      // Test 4: Check if tables exist
      const tablesQuery = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('sales', 'sale_items', 'sale_deliveries', 'products')
        ORDER BY table_name
      `);
      results.tables_found = tablesQuery.rows.map((r: any) => r.table_name);

      // Test 5: Try to query sales table
      const salesCount = await client.query('SELECT COUNT(*) as count FROM sales');
      results.sales_count = parseInt(salesCount.rows[0].count);

      // Test 6: Try to query a specific order (if exists)
      const sampleOrder = await client.query('SELECT id FROM sales LIMIT 1');
      if (sampleOrder.rows.length > 0) {
        results.sample_order_id = sampleOrder.rows[0].id;
        
        // Test querying order items
        const orderItems = await client.query(
          `SELECT COUNT(*) as count FROM sale_items WHERE "saleId" = $1`,
          [sampleOrder.rows[0].id]
        );
        results.sample_order_items_count = parseInt(orderItems.rows[0].count);
      }

    } catch (queryError: any) {
      results.query_test = "Failed";
      results.query_error = queryError.message;
    } finally {
      client.release();
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    results.connection_test = "Failed";
    results.error = error.message;
    results.error_stack = error.stack;
    
    return NextResponse.json(results, { status: 500 });
  }
}


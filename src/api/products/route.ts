import { NextResponse } from "next/server";

// Lazy import pool to avoid connection issues during module load
let pool: any = null;
async function getPool() {
  if (!pool) {
    try {
      const dbModule = await import("@/lib/db");
      pool = dbModule.default;
    } catch (error) {
      console.error("Failed to import database pool:", error);
      throw error;
    }
  }
  return pool;
}

/**
 * Products API Route
 * Fetches products from the backend system and transforms them for the storefront
 */

interface BackendProduct {
  id: string;
  sku: string;
  name: string;
  image_url: string;
  price: string;
  vat_percentage: number;
  base_unit: string;
  discounts: Array<{
    id: string;
    percentage: string;
    flat_amount: string | null;
    is_active: boolean;
  }>;
}

interface BackendCartItem {
  id: string;
  product: BackendProduct;
  quantity: number;
}

// Map base_unit to sale type
const mapBaseUnitToSaleType = (baseUnit: string): "roll" | "metre" | "board" | "unit" => {
  const unit = baseUnit.toLowerCase();
  if (unit.includes("meter") || unit.includes("metre")) return "metre";
  if (unit.includes("roll")) return "roll";
  if (unit.includes("sheet") || unit.includes("board")) return "board";
  return "unit";
};

// Calculate final price with discounts
const calculatePrice = (product: BackendProduct): number => {
  let price = parseFloat(product.price);
  
  // Apply active discounts
  const activeDiscount = product.discounts.find(d => d.is_active);
  if (activeDiscount) {
    if (activeDiscount.percentage) {
      const discountPercent = parseFloat(activeDiscount.percentage);
      price = price * (1 - discountPercent / 100);
    } else if (activeDiscount.flat_amount) {
      price = price - parseFloat(activeDiscount.flat_amount);
    }
  }
  
  return Math.max(0, price); // Ensure price is not negative
};

// Transform backend product to frontend format
const transformProduct = (product: BackendProduct) => {
  const saleType = mapBaseUnitToSaleType(product.base_unit);
  const variantLabel = saleType.charAt(0).toUpperCase() + saleType.slice(1);
  const price = calculatePrice(product);
  
  return {
    id: product.sku.toLowerCase().replace(/[^a-z0-9-]/g, "-"), // Convert SKU to URL-friendly ID
    sku: product.sku,
    name: product.name,
    image: product.image_url.startsWith("http") ? product.image_url : `${process.env.BACKEND_URL || ""}${product.image_url}`,
    price: price,
    variants: [{ name: variantLabel, price: price }],
    description: `Sold per ${saleType.toLowerCase()}.`,
    saleType: saleType,
    baseUnit: product.base_unit,
    vatPercentage: product.vat_percentage,
    originalPrice: parseFloat(product.price),
    hasDiscount: product.discounts.some(d => d.is_active),
  };
};

export async function GET() {
  // Ensure we always return JSON, never HTML
  try {
    // First, try to fetch from database (preferred method)
    if (process.env.DATABASE_URL) {
      try {
        const dbPool = await getPool();
        const result = await dbPool.query(`
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

        if (result.rows.length > 0) {
          const products = result.rows.map((row: any) => {
            const product: BackendProduct = {
              id: row.id,
              sku: row.sku,
              name: row.name,
              image_url: row.image_url || "/images/product-placeholder.jpg",
              price: row.price,
              vat_percentage: row.vat_percentage || 16,
              base_unit: row.base_unit || "pcs",
              discounts: Array.isArray(row.discounts) ? row.discounts : [],
            };
            return transformProduct(product);
          });

          return NextResponse.json(
            {
              products,
              count: products.length,
              lastUpdated: new Date().toISOString(),
              source: "database",
            },
            { status: 200 }
          );
        }
      } catch (dbError: any) {
        console.error("Database fetch error:", dbError);
        // Continue to fallback options
      }
    }

    // Fallback: Try to fetch from external backend API
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const apiEndpoint = process.env.BACKEND_PRODUCTS_ENDPOINT;
    
    // If no backend URL is configured, return empty array
    if (!backendUrl && !apiEndpoint) {
      console.log("No backend API configured, returning empty products");
      return NextResponse.json(
        {
          products: [],
          count: 0,
          error: "No backend API or database products available",
          lastUpdated: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    const endpoint = apiEndpoint || `${backendUrl}/api/cart-items`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authentication if token is provided
    if (process.env.BACKEND_API_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.BACKEND_API_TOKEN}`;
    }
    
    // Fetch products from backend
    const response = await fetch(endpoint, {
      method: "GET",
      headers,
      // Disable caching to get fresh data
      cache: "no-store",
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Backend API returned non-JSON response:", text.substring(0, 200));
      throw new Error(`Backend API returned HTML instead of JSON. Status: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const cartItems: BackendCartItem[] = await response.json();
    
    // Extract unique products (group by product ID)
    const productMap = new Map<string, BackendProduct>();
    
    cartItems.forEach((item) => {
      if (!productMap.has(item.product.id)) {
        productMap.set(item.product.id, item.product);
      }
    });

    // Transform products to frontend format
    const products = Array.from(productMap.values()).map(transformProduct);

    return NextResponse.json(
      {
        products,
        count: products.length,
        lastUpdated: new Date().toISOString(),
        source: "backend_api",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching products:", error);
    console.error("Error stack:", error.stack);
    
    // ALWAYS return JSON, never let errors cause HTML response
    try {
      return NextResponse.json(
        {
          products: [],
          count: 0,
          error: error?.message || "Unknown error occurred",
          lastUpdated: new Date().toISOString(),
          source: "error",
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (jsonError) {
      // If even JSON creation fails, return minimal JSON
      return new Response(
        JSON.stringify({
          products: [],
          count: 0,
          error: "Failed to process request",
          lastUpdated: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
}


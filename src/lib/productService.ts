/**
 * Product Service
 * Handles fetching and syncing products from the backend API
 */

const API_BASE = import.meta.env.VITE_API_BASE || "https://ecommerce-backend-snc5.onrender.com";

export interface BackendProduct {
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

export interface FrontendProduct {
  id: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  variants: Array<{ name: string; price: number }>;
  description?: string;
  saleType: "roll" | "metre" | "board" | "unit";
  baseUnit: string;
  vatPercentage: number;
  originalPrice: number;
  hasDiscount: boolean;
}

export interface ProductsResponse {
  products: FrontendProduct[];
  count: number;
  lastUpdated: string;
  error?: string;
}

/**
 * Fetch products from the API
 */
export async function fetchProducts(): Promise<ProductsResponse> {
  try {
    // Fetch products from NestJS backend
    const response = await fetch(`${API_BASE}/customer/products`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", response.status, errorText);
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("API returned non-JSON response:", text.substring(0, 200));
      throw new Error("API returned HTML instead of JSON. Check if the API route exists.");
    }

    const data = await response.json();
    console.log("Products API Response:", data); // Debug log

    // Handle different response formats from NestJS
    let products: any[] = [];

    // If NestJS returns an array directly
    if (Array.isArray(data)) {
      // Check if it's an array of cart items with nested products
      if (data.length > 0 && data[0].product) {
        // Extract products from cart items (handle nested product structure)
        products = data.map((item: any) => {
          // If product is nested, extract it
          return item.product || item;
        });
      } else {
        // It's already an array of products
        products = data;
      }
    }
    // If NestJS returns { data: [...] } or { products: [...] }
    else if (data.data && Array.isArray(data.data)) {
      if (data.data.length > 0 && data.data[0].product) {
        products = data.data.map((item: any) => item.product);
      } else {
        products = data.data;
      }
    }
    else if (data.products && Array.isArray(data.products)) {
      if (data.products.length > 0 && data.products[0].product) {
        products = data.products.map((item: any) => item.product);
      } else {
        products = data.products;
      }
    }
    // If NestJS returns { items: [...] } or similar
    else if (data.items && Array.isArray(data.items)) {
      if (data.items.length > 0 && data.items[0].product) {
        products = data.items.map((item: any) => item.product);
      } else {
        products = data.items;
      }
    }
    else {
      console.warn("Unexpected response format:", data);
      products = [];
    }

    // Deduplicate products by SKU or ID before transforming
    const uniqueProductsMap = new Map<string, any>();
    products.forEach((product: any) => {
      // Get the actual product object (might be nested)
      const actualProduct = product.product || product;
      // Use SKU first (most unique), then ID, fallback to a generated key
      // Use uppercase to ensure consistency (backend uses uppercase SKUs like "PRD251100003")
      const uniqueKey = (actualProduct.sku || actualProduct.id || product.sku || product.id)?.toUpperCase();
      if (uniqueKey && !uniqueProductsMap.has(String(uniqueKey))) {
        // Store the actual product object (not the wrapper)
        uniqueProductsMap.set(String(uniqueKey), actualProduct);
      }
    });
    const deduplicatedProducts = Array.from(uniqueProductsMap.values());

    // Transform NestJS products to frontend format if needed
    const transformedProducts = deduplicatedProducts.map((product: any) => {
      // If product is already in frontend format, return as is
      if (product.variants && product.price !== undefined) {
        return product;
      }

      // Transform from NestJS format to frontend format
      const saleType = product.base_unit?.toLowerCase().includes('meter') || product.base_unit?.toLowerCase().includes('metre')
        ? 'metre'
        : product.base_unit?.toLowerCase().includes('roll')
          ? 'roll'
          : product.base_unit?.toLowerCase().includes('sheet') || product.base_unit?.toLowerCase().includes('board')
            ? 'board'
            : 'unit';

      const variantLabel = saleType.charAt(0).toUpperCase() + saleType.slice(1);
      let price = typeof product.price === 'string' ? parseFloat(product.price) : product.price || 0;

      // Apply discounts if available
      if (product.discounts && Array.isArray(product.discounts)) {
        const activeDiscount = product.discounts.find((d: any) => d.is_active);
        if (activeDiscount?.percentage) {
          price = price * (1 - parseFloat(activeDiscount.percentage) / 100);
        } else if (activeDiscount?.flat_amount) {
          price = price - parseFloat(activeDiscount.flat_amount);
        }
      }

      // Use SKU for display ID (lowercase for URLs), but preserve original uppercase SKU for API calls
      const displayId = product.sku?.toLowerCase().replace(/[^a-z0-9-]/g, "-") || product.id?.toLowerCase();
      const originalId = product.id || product.sku; // Preserve original product ID (SKU in uppercase) for API calls

      return {
        id: displayId, // For display and cart purposes (lowercase)
        originalId: originalId, // Original product ID/SKU from backend (uppercase) for API calls
        sku: product.sku || product.id,
        name: product.name,
        image: product.image_url || product.image || "/images/product-placeholder.jpg",
        price: Math.max(0, price),
        variants: [{ name: variantLabel, price: Math.max(0, price) }],
        description: `Sold per ${saleType.toLowerCase()}.`,
        saleType: saleType,
        baseUnit: product.base_unit || "pcs",
        vatPercentage: product.vat_percentage || 16,
        originalPrice: typeof product.price === 'string' ? parseFloat(product.price) : product.price || 0,
        hasDiscount: product.discounts?.some((d: any) => d.is_active) || false,
      };
    });

    return {
      products: transformedProducts,
      count: transformedProducts.length,
      lastUpdated: new Date().toISOString(),
      error: undefined,
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      count: 0,
      lastUpdated: new Date().toISOString(),
      error: error.message,
    };
  }
}

/**
 * Poll for product updates
 * @param intervalMs - Polling interval in milliseconds (default: 30 seconds)
 * @param callback - Callback function to handle updates
 * @returns Cleanup function to stop polling
 */
export function pollProducts(
  callback: (products: FrontendProduct[]) => void,
  intervalMs: number = 30000
): () => void {
  let intervalId: NodeJS.Timeout | null = null;
  let isActive = true;

  const poll = async () => {
    if (!isActive) return;

    try {
      const data = await fetchProducts();
      if (data.products.length > 0) {
        callback(data.products);
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  };

  // Initial fetch
  poll();

  // Set up polling
  intervalId = setInterval(poll, intervalMs);

  // Return cleanup function
  return () => {
    isActive = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}


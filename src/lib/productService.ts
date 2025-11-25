/**
 * Product Service
 * Handles fetching and syncing products from the backend API
 */

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
    const response = await fetch("/api/products", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
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
    
    // Ensure the response has the expected structure
    if (!data || typeof data !== 'object') {
      throw new Error("Invalid response format from API");
    }

    return {
      products: data.products || [],
      count: data.count || 0,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      error: data.error,
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


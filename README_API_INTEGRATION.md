# Backend API Integration Guide

This storefront automatically syncs products and prices from your backend system.

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with your backend API configuration:

```env
# Backend API URL (required)
BACKEND_API_URL=http://your-backend-api-url.com
# or use NEXT_PUBLIC_BACKEND_API_URL for client-side access

# Optional: Custom products endpoint (defaults to /api/cart-items)
BACKEND_PRODUCTS_ENDPOINT=http://your-backend-api-url.com/api/products

# Optional: API Authentication Token
BACKEND_API_TOKEN=your_api_token_here

# Backend base URL for image URLs (if images are relative paths)
BACKEND_URL=http://your-backend-api-url.com
```

### 2. Backend API Requirements

Your backend API should return an array of cart items in the following format:

```json
[
  {
    "id": "cart-item-id",
    "product": {
      "id": "PRD251100003",
      "sku": "PRD251100003",
      "name": "FRONTLIT BANNER1.2 M 440GSM",
      "image_url": "/uploads/products/product.jpg",
      "price": "250.00",
      "vat_percentage": 18,
      "base_unit": "meter",
      "discounts": [
        {
          "id": "discount-id",
          "percentage": "10.00",
          "flat_amount": null,
          "is_active": true
        }
      ]
    },
    "quantity": 325
  }
]
```

### 3. Product Mapping

The system automatically maps `base_unit` to sale types:
- `"meter"` or `"metre"` → `"metre"`
- `"roll"` → `"roll"`
- `"sheet"` or `"board"` → `"sheet"`
- Everything else → `"unit"`

### 4. Price Calculation

Prices are automatically calculated with discounts:
- Percentage discounts are applied first
- Flat amount discounts are subtracted
- Final price cannot be negative

## Features

### Automatic Product Sync
- Products are fetched on page load
- New products added to backend appear automatically
- Products are grouped by sale type (roll, metre, sheet, unit)

### Automatic Price Updates
- Prices are polled every 30 seconds
- Price changes in backend reflect immediately
- Discounts are automatically applied

### Fallback Mode
- If API fails, storefront falls back to hardcoded products
- Ensures storefront remains functional even if backend is down

## Customization

### Change Polling Interval

Edit `src/storefront/page.tsx`:

```typescript
const cleanup = pollProducts((products) => {
  setApiProducts(products);
}, 60000); // Change to 60 seconds (60000ms)
```

### Custom Endpoint

Set `BACKEND_PRODUCTS_ENDPOINT` in `.env.local`:

```env
BACKEND_PRODUCTS_ENDPOINT=http://your-api.com/api/custom/products
```

### Disable API Integration

To use only hardcoded products, set:

```typescript
const [useApiProducts, setUseApiProducts] = useState(false);
```

## Troubleshooting

### Products Not Loading
1. Check browser console for errors
2. Verify `BACKEND_API_URL` is correct
3. Check CORS settings on backend
4. Verify API endpoint returns correct format

### Prices Not Updating
1. Check polling interval (default: 30 seconds)
2. Verify backend API is accessible
3. Check network tab for API calls

### Images Not Displaying
1. Ensure `BACKEND_URL` is set correctly
2. Verify image URLs are absolute or relative to backend
3. Check CORS for image resources


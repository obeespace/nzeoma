# Product API Service Documentation

## Overview
This document describes the new axios-based API service that replaces the old ProductDataManager. The new system provides a clean, standardized interface for all CRUD operations with your MongoDB database.

## Architecture

### Files Structure
```
lib/api/
  └── productService.js    # Main API service using axios
app/api/products/
  ├── route.js            # GET /api/products, POST /api/products  
  ├── [id]/route.js       # GET /api/products/[id], PUT /api/products/[id], DELETE /api/products/[id]
  ├── bulk/route.js       # Bulk operations
  └── stats/route.js      # Statistics endpoint
```

### Key Components

1. **productService.js**: Axios-based API client with automatic retries, timeout handling, and error processing
2. **API Routes**: Next.js API routes with MongoDB integration and fallback mechanisms
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Data Validation**: Client and server-side validation for all operations

## API Endpoints

### GET /api/products
Fetch all products with optional filtering
- **Query Parameters**: category, inStock, minWattage, maxWattage, sortBy, limit, skip
- **Response**: Array of products with metadata headers
- **Database Required**: Direct MongoDB connection required

### GET /api/products/[id]  
Fetch single product by ID
- **Parameters**: id (required)
- **Response**: Single product object

### POST /api/products
Create new product
- **Body**: Product object (name, price, alt, image required)
- **Response**: Created product with success message

### PUT /api/products/[id]
Update existing product  
- **Parameters**: id (required)
- **Body**: Updated product fields
- **Response**: Updated product with success message

### DELETE /api/products/[id]
Delete product
- **Parameters**: id (required)  
- **Response**: Deletion confirmation with count

## Usage Examples

### Basic Usage

```javascript
import { productService } from '../lib/api/productService';

// Get all products
const result = await productService.getAllProducts();
console.log(`Found ${result.data.length} products`);

// Get single product  
const product = await productService.getProductById('product_id');

// Create product
const newProduct = await productService.createProduct({
  name: 'Solar Light 100W',
  price: '₦25,000',
  alt: 'Bright solar street light',
  image: 'base64_image_data'
});

// Update product
const updated = await productService.updateProduct('product_id', {
  price: '₦30,000'
});

// Delete product
await productService.deleteProduct('product_id');
```

### Advanced Filtering

```javascript
// Filter products
const filtered = await productService.getAllProducts({
  category: 'street-lights',
  inStock: true,
  minWattage: 50,
  sortBy: 'price',
  limit: 10
});
```

### Error Handling

```javascript
try {
  const products = await productService.getAllProducts();
  setProducts(products.data);
} catch (error) {
  console.error('Failed to load products:', error);
  // Error is automatically formatted with user-friendly message
  toast.error(error.message);
}
```

## Features

### 🔗 Direct Database Connection
- All data comes directly from MongoDB
- Real-time data consistency
- No fallback mechanisms - ensures data integrity

### ⏱️ Timeout Protection  
- 30-second timeout prevents hanging requests
- Clear error messages for connection failures
- User-friendly timeout error messages

### 📊 Request Logging
- All requests/responses logged for debugging
- Database connection status tracking
- Performance monitoring with response times

### 🛡️ Error Handling
- Comprehensive client and server validation
- Standardized error messages
- HTTP status code mapping
- Database-specific error messages

### 🚀 Performance Optimized
- Axios interceptors for request/response processing
- Efficient query parameter handling
- Direct database queries with MongoDB optimization

## Migration from ProductDataManager

The new `productService` maintains the same interface as `ProductDataManager` but with several improvements:

### What Changed:
- ✅ Direct axios HTTP calls to MongoDB only
- ✅ Better error handling with database-specific errors  
- ✅ Removed fallback systems for data integrity
- ✅ Request/response logging for debugging
- ✅ Timeout protection for all operations
- ✅ Standardized return format with metadata
- ✅ Real-time database consistency

### What Stayed the Same:
- ✅ Same function names and parameters
- ✅ Compatible return values
- ✅ Works with existing UI components
- ✅ MongoDB integration unchanged

## Environment Configuration

Required environment variables in `.env.local`:
```env
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_BASE_URL=https://yourdomain.com  # For production
```

For Vercel deployment, these must be added in the Vercel dashboard under Settings > Environment Variables.

## Debugging

### Data Source Tracking
```javascript
const result = await productService.getAllProducts();
console.log(`Data from: ${result.source}`); // Always outputs: 'database'
```

### Request Monitoring
All requests are automatically logged:
```
🚀 Making GET request to: /api/products
✅ Response from /api/products: 200
📦 Loaded 25 products from database
```

### Error Diagnostics
```javascript
try {
  await productService.createProduct(invalidData);
} catch (error) {
  console.error('API Error:', error.message);
  // Outputs specific validation error or connection issue
}
```

## Testing

Run the test script to verify API functionality:
```bash
npm run test-api
```

Or test individual components in browser developer tools:
```javascript
// In browser console
import('/lib/api/productService.js').then(({ productService }) => {
  productService.getAllProducts().then(console.log);
});
```

## Performance Considerations

- **Caching**: API responses include cache headers for browser optimization
- **Pagination**: Use limit/skip parameters for large datasets
- **Image Optimization**: Images are automatically compressed before upload  
- **Connection Pooling**: MongoDB connections are pooled for efficiency

## Security

- **Input Validation**: All inputs validated on client and server
- **SQL Injection Protection**: MongoDB queries use parameterized inputs
- **File Upload Security**: Images validated for type and size
- **CORS Protection**: API routes use Next.js built-in CORS handling

This new architecture provides a robust, scalable foundation for your solar product management system with proper error handling, fallback mechanisms, and performance optimization.
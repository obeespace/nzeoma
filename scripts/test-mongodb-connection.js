// Test MongoDB connection
import { ProductController } from '../lib/controllers/productController.js';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const result = await ProductController.getAllProducts();
    
    if (result.success) {
      console.log('✅ MongoDB connection successful!');
      console.log(`Found ${result.data.length} products in database`);
    } else {
      console.log('❌ MongoDB query failed:', result.error);
    }
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
  }
}

testConnection();
// MongoDB-based data management utility
import { solarProductsData } from './data';

const STORAGE_KEY = 'nzeoma_products';
const API_BASE = '/api/products';

// MongoDB-first data operations
export const getSolarProductsData = async () => {
  try {
    const response = await fetch(API_BASE);
    if (response.ok) {
      const apiProducts = await response.json();
      console.log('Loaded from MongoDB:', apiProducts.length, 'products');
      
      // If MongoDB has data, use it; otherwise return default products
      return apiProducts.length > 0 ? apiProducts : solarProductsData;
    } else {
      console.error('MongoDB API error:', response.status);
    }
  } catch (error) {
    console.error('MongoDB connection failed, using fallback:', error.message);
  }
  
  // Fallback to localStorage for offline mode
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsedProducts = JSON.parse(stored);
      console.log('Loaded from localStorage:', parsedProducts.length, 'products');
      return parsedProducts.length > 0 ? parsedProducts : solarProductsData;
    } catch (error) {
      console.error('Error parsing stored products:', error);
    }
  }
  
  console.log('Using default products:', solarProductsData.length, 'products');
  return solarProductsData;
};

export const saveProductsData = async (products) => {
  try {
    // Always try to save to MongoDB first
    const response = await fetch('/api/sync-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products })
    });
    
    if (response.ok) {
      console.log('Successfully synced to MongoDB');
      // Also save to localStorage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return true;
    } else {
      console.error('Failed to sync to MongoDB:', response.status);
    }
  } catch (error) {
    console.error('MongoDB sync error:', error);
  }
  
  // Fallback to localStorage only
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    console.log('Saved to localStorage as fallback');
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

// Add individual product to MongoDB
export const addProductToMongoDB = async (product) => {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    
    if (response.ok) {
      const savedProduct = await response.json();
      console.log('Product added to MongoDB:', savedProduct.id);
      return savedProduct;
    } else {
      throw new Error(`Failed to add product: ${response.status}`);
    }
  } catch (error) {
    console.error('Error adding product to MongoDB:', error);
    throw error;
  }
};

// Update product in MongoDB
export const updateProductInMongoDB = async (id, updatedProduct) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    
    if (response.ok) {
      const updated = await response.json();
      console.log('Product updated in MongoDB:', id);
      return updated;
    } else {
      throw new Error(`Failed to update product: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating product in MongoDB:', error);
    throw error;
  }
};

// Delete product from MongoDB
export const deleteProductFromMongoDB = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Product deleted from MongoDB:', id);
      return result;
    } else {
      throw new Error(`Failed to delete product: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting product from MongoDB:', error);
    throw error;
  }
};

// Helper function to convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to compress image
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
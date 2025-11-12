// Data management utility using localStorage
import { solarProductsData } from './data';

const STORAGE_KEY = 'nzeoma_products';

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

// Initialize localStorage with default data if empty
export const initializeData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Convert image imports to strings for JSON storage
    const productsWithStringImages = solarProductsData.map((product, index) => ({
      id: index + 1,
      ...product,
      image: product.image.src || `/public/${product.name.replace(/\s+/g, '%20')}.jpg`
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productsWithStringImages));
    return productsWithStringImages;
  }
  return JSON.parse(stored);
};

// Get all products from localStorage
export const getAllProducts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return initializeData();
  }
  return JSON.parse(stored);
};

// Add a new product
export const addProduct = (product) => {
  const products = getAllProducts();
  const newProduct = {
    id: Date.now(), // Use timestamp as unique ID
    ...product
  };
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return newProduct;
};

// Update an existing product
export const updateProduct = (id, updatedProduct) => {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[index];
  }
  return null;
};

// Delete a product
export const deleteProduct = (id) => {
  const products = getAllProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
  return filteredProducts;
};

// Get product by ID
export const getProductById = (id) => {
  const products = getAllProducts();
  return products.find(p => p.id === id);
};

// Search products
export const searchProducts = (searchTerm) => {
  const products = getAllProducts();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.price.includes(searchTerm) ||
    product.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
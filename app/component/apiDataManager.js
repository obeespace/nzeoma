// API-based data manager
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create API endpoints for CRUD operations
export const apiDataManager = {
  // Get all products
  async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to localStorage for development
      return JSON.parse(localStorage.getItem('nzeoma_products') || '[]');
    }
  },

  // Add new product
  async addProduct(product) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to add product');
      return await response.json();
    } catch (error) {
      console.error('Error adding product:', error);
      // Fallback to localStorage
      const products = JSON.parse(localStorage.getItem('nzeoma_products') || '[]');
      products.push(product);
      localStorage.setItem('nzeoma_products', JSON.stringify(products));
      return product;
    }
  },

  // Update product
  async updateProduct(id, updatedProduct) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      // Fallback to localStorage
      const products = JSON.parse(localStorage.getItem('nzeoma_products') || '[]');
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        localStorage.setItem('nzeoma_products', JSON.stringify(products));
      }
      return updatedProduct;
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      // Fallback to localStorage
      const products = JSON.parse(localStorage.getItem('nzeoma_products') || '[]');
      const filteredProducts = products.filter(p => p.id !== id);
      localStorage.setItem('nzeoma_products', JSON.stringify(filteredProducts));
      return { success: true };
    }
  }
};

// JSON file-based storage (for Vercel)
export const jsonDataManager = {
  async syncToJsonFile(products) {
    try {
      const response = await fetch('/api/sync-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error syncing to JSON file:', error);
      return false;
    }
  }
};
// API service for products using axios
import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : process.env.NEXT_PUBLIC_BASE_URL || '';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status >= 500) {
      throw new Error('Database connection failed. Please check your connection and try again.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check your connection.');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Database operation failed');
  }
);

// Product API service
export const productService = {
  // Get all products with optional filters
  async getAllProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const url = queryParams.toString() 
        ? `/products?${queryParams.toString()}` 
        : '/products';
      
      const response = await apiClient.get(url);
      
      return {
        success: true,
        data: response.data,
        total: response.headers['x-total-count'] ? parseInt(response.headers['x-total-count']) : response.data.length,
        source: 'database'
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  // Get single product by ID
  async getProductById(id) {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }
      
      const response = await apiClient.get(`/products/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      if (!productData || Object.keys(productData).length === 0) {
        throw new Error('Product data is required');
      }
      
      // Validate required fields
      const requiredFields = ['name', 'price'];
      for (const field of requiredFields) {
        if (!productData[field]) {
          throw new Error(`${field} is required`);
        }
      }
      
      const response = await apiClient.post('/products', productData);
      return {
        success: true,
        data: response.data.product,
        message: response.data.message
      };
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  // Update existing product
  async updateProduct(id, updateData) {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }
      
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error('Update data is required');
      }
      
      const response = await apiClient.put(`/products/${id}`, updateData);
      return {
        success: true,
        data: response.data.product,
        message: response.data.message
      };
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }
      
      const response = await apiClient.delete(`/products/${id}`);
      return {
        success: true,
        data: {
          deletedId: response.data.deletedId,
          deletedCount: response.data.deletedCount
        },
        message: response.data.message
      };
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  },

  // Bulk operations
  async bulkCreateProducts(productsArray) {
    try {
      if (!Array.isArray(productsArray) || productsArray.length === 0) {
        throw new Error('Products array is required');
      }
      
      const response = await apiClient.post('/products/bulk', { products: productsArray });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Failed to bulk create products:', error);
      throw error;
    }
  },

  // Get product statistics
  async getProductStats() {
    try {
      const response = await apiClient.get('/products/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Failed to fetch product stats:', error);
      throw error;
    }
  }
};

// Export default for backwards compatibility
export default productService;
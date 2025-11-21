// MongoDB Data Manager for Nzeoma Solar Products
// Standard CRUD operations for product management

const API_BASE = '/api/products';

export class ProductDataManager {
  // CREATE - Add new product
  static async createProduct(productData) {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      
      console.log(`✅ Created product: ${result.product.name}`);
      return result.product;
    } catch (error) {
      console.error('❌ Failed to create product:', error.message);
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  // READ - Get all products
  static async getAllProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.category) params.append('category', filters.category);
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock);
      if (filters.minWattage) params.append('minWattage', filters.minWattage);
      if (filters.maxWattage) params.append('maxWattage', filters.maxWattage);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.skip) params.append('skip', filters.skip);
      
      const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('❌ Failed to fetch products:', error.message);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  // READ - Get single product by ID
  static async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Product not found
        }
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`❌ Failed to fetch product ${id}:`, error.message);
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  // UPDATE - Update existing product
  static async updateProduct(id, updateData) {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      
      console.log(`✅ Updated product: ${id}`);
      return result.product;
    } catch (error) {
      console.error(`❌ Failed to update product ${id}:`, error.message);
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  // DELETE - Remove product
  static async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      
      console.log(`✅ Deleted product: ${id}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to delete product ${id}:`, error.message);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}

// Export for direct use
export default ProductDataManager;

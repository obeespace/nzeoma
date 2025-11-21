import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { validateProduct, sanitizeProduct } from '../schemas/productSchema';

const DB_NAME = 'nzeoma_solar';
const COLLECTION_NAME = 'products';

export class ProductController {
  static async getDatabase() {
    try {
      const client = await clientPromise;
      return client.db(DB_NAME);
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  // Get all products with optional filters
  static async getAllProducts(filters = {}) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      // Build query from filters
      const query = {};
      if (filters.category) query.category = filters.category;
      if (filters.inStock !== undefined) query.inStock = filters.inStock;
      if (filters.minWattage) query.wattage = { $gte: filters.minWattage };
      if (filters.maxWattage) {
        query.wattage = { ...query.wattage, $lte: filters.maxWattage };
      }
      
      // Build sort options
      const sortOptions = {};
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'name':
            sortOptions.name = 1;
            break;
          case 'price':
            sortOptions.price = 1;
            break;
          case 'wattage':
            sortOptions.wattage = -1;
            break;
          case 'newest':
            sortOptions.createdAt = -1;
            break;
          case 'rating':
            sortOptions.rating = -1;
            break;
          default:
            sortOptions.createdAt = -1;
        }
      } else {
        sortOptions.createdAt = -1;
      }
      
      const products = await collection
        .find(query)
        .sort(sortOptions)
        .limit(filters.limit || 100)
        .skip(filters.skip || 0)
        .toArray();
      
      return {
        success: true,
        data: products,
        count: products.length,
        total: await collection.countDocuments(query)
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch products: ${error.message}`
      };
    }
  }

  // Get single product by ID
  static async getProductById(id) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      // Try to find by ObjectId first, then by custom id field
      let product = null;
      if (ObjectId.isValid(id)) {
        product = await collection.findOne({ _id: new ObjectId(id) });
      }
      
      if (!product) {
        product = await collection.findOne({ id: id });
      }
      
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
          statusCode: 404
        };
      }
      
      return {
        success: true,
        data: product
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch product: ${error.message}`
      };
    }
  }

  // Create new product
  static async createProduct(productData) {
    try {
      console.log('📝 Creating product with data:', productData);
      
      // Validate input
      const validation = validateProduct(productData, false);
      console.log('🔍 Validation result:', validation);
      
      if (!validation.isValid) {
        console.log('❌ Validation failed:', validation.errors);
        return {
          success: false,
          error: 'Validation failed',
          details: validation.errors,
          statusCode: 400
        };
      }
      
      // Sanitize data
      const sanitizedProduct = sanitizeProduct(productData, false);
      console.log('🧹 Sanitized product:', sanitizedProduct);
      
      // Check for duplicate name
      const db = await this.getDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      const existingProduct = await collection.findOne({ name: sanitizedProduct.name });
      if (existingProduct) {
        console.log('⚠️ Duplicate product name found');
        return {
          success: false,
          error: 'Product with this name already exists',
          statusCode: 409
        };
      }
      
      // Add unique identifier
      sanitizedProduct.id = new ObjectId().toString();
      console.log('🆔 Added ID:', sanitizedProduct.id);
      
      const result = await collection.insertOne(sanitizedProduct);
      console.log('💾 Insert result:', result);
      
      if (!result.insertedId) {
        console.log('❌ No insertedId returned');
        return {
          success: false,
          error: 'Failed to create product'
        };
      }
      
      // Return the created product
      const createdProduct = await collection.findOne({ _id: result.insertedId });
      console.log('✅ Created product:', createdProduct);
      
      return {
        success: true,
        data: createdProduct,
        statusCode: 201
      };
    } catch (error) {
      console.error('💥 Create product error:', error);
      return {
        success: false,
        error: `Failed to create product: ${error.message}`
      };
    }
  }

  // Update existing product
  static async updateProduct(id, updateData) {
    try {
      // Validate input
      const validation = validateProduct(updateData, true);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          details: validation.errors,
          statusCode: 400
        };
      }
      
      // Sanitize data
      const sanitizedUpdate = sanitizeProduct(updateData, true);
      
      const db = await this.getDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      // Check if product exists
      const existingProduct = await this.getProductById(id);
      if (!existingProduct.success) {
        return existingProduct;
      }
      
      // Check for name conflicts (if updating name)
      if (sanitizedUpdate.name) {
        const duplicateCheck = await collection.findOne({ 
          name: sanitizedUpdate.name,
          _id: { $ne: new ObjectId(existingProduct.data._id) }
        });
        
        if (duplicateCheck) {
          return {
            success: false,
            error: 'Product with this name already exists',
            statusCode: 409
          };
        }
      }
      
      // Update the product
      const result = await collection.updateOne(
        { _id: new ObjectId(existingProduct.data._id) },
        { $set: sanitizedUpdate }
      );
      
      if (result.matchedCount === 0) {
        return {
          success: false,
          error: 'Product not found',
          statusCode: 404
        };
      }
      
      // Return updated product
      const updatedProduct = await collection.findOne({ _id: new ObjectId(existingProduct.data._id) });
      
      return {
        success: true,
        data: updatedProduct
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update product: ${error.message}`
      };
    }
  }

  // Delete product
  static async deleteProduct(id) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      // Check if product exists first
      const existingProduct = await this.getProductById(id);
      if (!existingProduct.success) {
        return existingProduct;
      }
      
      const result = await collection.deleteOne({ _id: new ObjectId(existingProduct.data._id) });
      
      if (result.deletedCount === 0) {
        return {
          success: false,
          error: 'Product not found',
          statusCode: 404
        };
      }
      
      return {
        success: true,
        data: { deletedId: id, deletedCount: result.deletedCount }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete product: ${error.message}`
      };
    }
  }

  // Bulk operations
  static async bulkCreateProducts(productsArray) {
    try {
      const results = [];
      const errors = [];
      
      for (let i = 0; i < productsArray.length; i++) {
        const result = await this.createProduct(productsArray[i]);
        if (result.success) {
          results.push(result.data);
        } else {
          errors.push({ index: i, error: result.error, product: productsArray[i] });
        }
      }
      
      return {
        success: true,
        data: results,
        errors: errors,
        totalProcessed: productsArray.length,
        successCount: results.length,
        errorCount: errors.length
      };
    } catch (error) {
      return {
        success: false,
        error: `Bulk create failed: ${error.message}`
      };
    }
  }

  // Get product statistics
  static async getProductStats() {
    try {
      const db = await this.getDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      const stats = await collection.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            averageRating: { $avg: '$rating' },
            totalInStock: { $sum: { $cond: ['$inStock', 1, 0] } },
            categoryCounts: { $push: '$category' }
          }
        },
        {
          $unwind: '$categoryCounts'
        },
        {
          $group: {
            _id: '$categoryCounts',
            count: { $sum: 1 },
            totalProducts: { $first: '$totalProducts' },
            averageRating: { $first: '$averageRating' },
            totalInStock: { $first: '$totalInStock' }
          }
        }
      ]).toArray();
      
      return {
        success: true,
        data: {
          totalProducts: stats[0]?.totalProducts || 0,
          averageRating: stats[0]?.averageRating || 0,
          totalInStock: stats[0]?.totalInStock || 0,
          categoryBreakdown: stats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch stats: ${error.message}`
      };
    }
  }
}
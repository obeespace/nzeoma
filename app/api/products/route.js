import { NextResponse } from 'next/server';
import { ProductController } from '../../../lib/controllers/productController';
import { fallbackProductsData } from '../../component/fallbackData';

// GET /api/products - Fetch all products with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const filters = {
      category: searchParams.get('category'),
      inStock: searchParams.get('inStock') === 'true' ? true : searchParams.get('inStock') === 'false' ? false : undefined,
      minWattage: searchParams.get('minWattage') ? parseInt(searchParams.get('minWattage')) : undefined,
      maxWattage: searchParams.get('maxWattage') ? parseInt(searchParams.get('maxWattage')) : undefined,
      sortBy: searchParams.get('sortBy'),
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 100,
      skip: searchParams.get('skip') ? parseInt(searchParams.get('skip')) : 0
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    let result;
    let usedFallback = false;
    
    try {
      // Try to get data from MongoDB with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 20000)
      );
      
      const dataPromise = ProductController.getAllProducts(filters);
      result = await Promise.race([dataPromise, timeoutPromise]);
      
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.log('🔄 Database connection failed, using fallback data');
      console.error('Database error:', error.message);
      
      // Use fallback data if database fails
      usedFallback = true;
      let filteredData = [...fallbackProductsData];
      
      // Apply filters to fallback data
      if (filters.category) {
        filteredData = filteredData.filter(product => 
          product.category === filters.category
        );
      }
      if (filters.inStock !== undefined) {
        filteredData = filteredData.filter(product => 
          product.inStock === filters.inStock
        );
      }
      if (filters.minWattage) {
        filteredData = filteredData.filter(product => 
          product.wattage >= filters.minWattage
        );
      }
      if (filters.maxWattage) {
        filteredData = filteredData.filter(product => 
          product.wattage <= filters.maxWattage
        );
      }
      
      // Apply sorting
      if (filters.sortBy) {
        filteredData.sort((a, b) => {
          switch (filters.sortBy) {
            case 'name':
              return a.name.localeCompare(b.name);
            case 'price':
              const priceA = parseInt(a.price.replace(/[₦,]/g, ''));
              const priceB = parseInt(b.price.replace(/[₦,]/g, ''));
              return priceA - priceB;
            case 'wattage':
              return b.wattage - a.wattage;
            default:
              return 0;
          }
        });
      }
      
      // Apply pagination
      const skip = filters.skip || 0;
      const limit = filters.limit || 100;
      const paginatedData = filteredData.slice(skip, skip + limit);
      
      result = {
        success: true,
        data: paginatedData,
        count: paginatedData.length,
        total: filteredData.length
      };
    }
    
    // Set cache headers for better performance
    const response = NextResponse.json(result.data);
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    response.headers.set('X-Total-Count', result.total.toString());
    response.headers.set('X-Data-Source', usedFallback ? 'fallback' : 'database');
    
    return response;
  } catch (error) {
    console.error('Products API GET error:', error);
    
    // Even if everything fails, try to return fallback data
    try {
      const response = NextResponse.json(fallbackProductsData);
      response.headers.set('X-Data-Source', 'emergency-fallback');
      return response;
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Internal server error', details: error.message },
        { status: 500 }
      );
    }
  }
}

// POST /api/products - Create new product
export async function POST(request) {
  try {
    const productData = await request.json();
    
    // Validate request body exists
    if (!productData || Object.keys(productData).length === 0) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }
    
    // Add timeout wrapper for create operation
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout - please check your internet connection')), 20000)
    );
    
    const createPromise = ProductController.createProduct(productData);
    const result = await Promise.race([createPromise, timeoutPromise]);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error,
          details: result.details || undefined
        },
        { status: result.statusCode || 500 }
      );
    }
    
    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: result.data
      },
      { status: result.statusCode || 201 }
    );
  } catch (error) {
    console.error('Products API POST error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
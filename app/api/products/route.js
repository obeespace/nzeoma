import { NextResponse } from 'next/server';
import { ProductController } from '../../../lib/controllers/productController';

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
    
    console.log('🔍 Fetching products from MongoDB...');
    console.log('Environment check - MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    // Get data directly from MongoDB - no fallback
    const result = await ProductController.getAllProducts(filters);
    
    if (!result.success) {
      console.error('Database error:', result.error);
      return NextResponse.json(
        { error: 'Database connection failed', details: result.error },
        { status: 500 }
      );
    }
    
    console.log('✅ Successfully fetched from MongoDB:', result.data.length, 'products');
    
    // Set cache headers for better performance
    const response = NextResponse.json(result.data);
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    response.headers.set('X-Total-Count', result.total.toString());
    response.headers.set('X-Data-Source', 'database');
    
    return response;
  } catch (error) {
    console.error('Products API GET error:', error);
    
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
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
    
    console.log('📝 Creating product in database...');
    const result = await ProductController.createProduct(productData);
    
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
      { error: 'Database operation failed', details: error.message },
      { status: 500 }
    );
  }
}
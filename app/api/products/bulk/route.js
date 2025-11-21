import { NextResponse } from 'next/server';
import { ProductController } from '../../../../lib/controllers/productController';

// POST /api/products/bulk - Bulk create products
export async function POST(request) {
  try {
    const { products } = await request.json();
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products array is required' },
        { status: 400 }
      );
    }
    
    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Products array cannot be empty' },
        { status: 400 }
      );
    }
    
    if (products.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 products allowed per bulk operation' },
        { status: 400 }
      );
    }
    
    const result = await ProductController.bulkCreateProducts(products);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: `Bulk operation completed. ${result.successCount} products created, ${result.errorCount} errors.`,
      results: result.data,
      errors: result.errors,
      summary: {
        totalProcessed: result.totalProcessed,
        successCount: result.successCount,
        errorCount: result.errorCount
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Bulk products API error:', error);
    
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
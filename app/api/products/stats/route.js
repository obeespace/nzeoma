import { NextResponse } from 'next/server';
import { ProductController } from '../../../../lib/controllers/productController';

// GET /api/products/stats - Get product statistics
export async function GET() {
  try {
    const result = await ProductController.getProductStats();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      statistics: result.data,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Product stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
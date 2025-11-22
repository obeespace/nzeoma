import { NextResponse } from 'next/server';
import { ProductController } from '../../../../lib/controllers/productController';

// GET /api/products/[id] - Get single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`🔍 Fetching product ${id} from database...`);
    const result = await ProductController.getProductById(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode || 500 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json(
      { error: 'Database operation failed', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Update data is required' },
        { status: 400 }
      );
    }
    
    console.log(`📝 Updating product ${id} in database...`);
    const result = await ProductController.updateProduct(id, updateData);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error,
          details: result.details || undefined
        },
        { status: result.statusCode || 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Product updated successfully',
      product: result.data
    });
  } catch (error) {
    console.error('Product PUT error:', error);
    
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

// DELETE /api/products/[id] - Delete product
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`🗑️ Deleting product ${id} from database...`);
    const result = await ProductController.deleteProduct(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode || 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Product deleted successfully',
      deletedId: result.data.deletedId,
      deletedCount: result.data.deletedCount
    });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json(
      { error: 'Database operation failed', details: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    // Test MongoDB connection
    const client = await clientPromise;
    const db = client.db('nzeoma_solar');
    
    const productsCollection = db.collection('products');
    const productCount = await productsCollection.countDocuments();
    
    // Get sample product
    const sampleProduct = await productsCollection.findOne({});
    
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      database: 'nzeoma_solar',
      productCount,
      sampleProduct: sampleProduct ? {
        name: sampleProduct.name,
        price: sampleProduct.price,
        category: sampleProduct.category
      } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
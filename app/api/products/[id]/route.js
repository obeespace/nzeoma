import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

const readProducts = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

const writeProducts = (products) => {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updatedProduct = await request.json();
    const products = readProducts();
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    products[index] = { ...products[index], ...updatedProduct, id };
    
    if (writeProducts(products)) {
      return NextResponse.json(products[index]);
    } else {
      throw new Error('Failed to update product');
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const products = readProducts();
    
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (writeProducts(filteredProducts)) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Failed to delete product');
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read products from JSON file
const readProducts = () => {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      // Initialize with default products if file doesn't exist
      const defaultProducts = [];
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultProducts, null, 2));
      return defaultProducts;
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

// Write products to JSON file
const writeProducts = (products) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// GET - Fetch all products
export async function GET() {
  try {
    const products = readProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Add new product
export async function POST(request) {
  try {
    const newProduct = await request.json();
    const products = readProducts();
    
    // Add ID if not present
    if (!newProduct.id) {
      newProduct.id = Date.now().toString();
    }
    
    products.push(newProduct);
    
    if (writeProducts(products)) {
      return NextResponse.json(newProduct, { status: 201 });
    } else {
      throw new Error('Failed to save product');
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
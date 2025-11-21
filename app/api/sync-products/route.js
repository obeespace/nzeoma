import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

export async function POST(request) {
  try {
    const { products } = await request.json();
    
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write products to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing products:', error);
    return NextResponse.json(
      { error: 'Failed to sync products' },
      { status: 500 }
    );
  }
}
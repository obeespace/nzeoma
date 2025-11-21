const { MongoClient } = require('mongodb');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.log('Make sure your .env.local file has the MongoDB connection string');
  process.exit(1);
}

// Solar products data to migrate
const solarProductsData = [
  {
    "image": "/Fex Solar Light 200watts.jpg",
    "name": "Fex Solar Light 200watts",
    "price": "₦35,000",
    "alt": "Fex Solar Light 200watts",
    "category": "Fex Solar",
    "wattage": 200,
    "description": "High-efficiency solar light perfect for residential and commercial use",
    "features": ["Solar powered", "LED technology", "Weather resistant", "Auto on/off"]
  },
  {
    "image": "/Fex Solar Light 400watts.jpg",
    "name": "Fex Solar Light 400watts",
    "price": "₦45,000",
    "alt": "Fex Solar Light 400watts",
    "category": "Fex Solar",
    "wattage": 400,
    "description": "Medium power solar lighting solution for larger areas",
    "features": ["Solar powered", "LED technology", "Weather resistant", "Auto on/off"]
  },
  {
    "image": "/Fex Solar Light 600watts.jpg",
    "name": "Fex Solar Light 600watts",
    "price": "₦55,000",
    "alt": "Fex Solar Light 600watts",
    "category": "Fex Solar",
    "wattage": 600,
    "description": "High-power solar light for extensive illumination",
    "features": ["Solar powered", "LED technology", "Weather resistant", "Auto on/off"]
  },
  {
    "image": "/Fex Solar Light 1200watts.jpg",
    "name": "Fex Solar Light 1200watts",
    "price": "₦68,000",
    "alt": "Fex Solar Light 1200watts",
    "category": "Fex Solar",
    "wattage": 1200,
    "description": "Premium high-wattage solar lighting solution",
    "features": ["Solar powered", "LED technology", "Weather resistant", "Auto on/off"]
  },
  {
    "image": "/Fex Solar Light 1500watts.jpg",
    "name": "Fex Solar Light 1500watts",
    "price": "₦85,000",
    "alt": "Fex Solar Light 1500watts",
    "category": "Fex Solar",
    "wattage": 1500,
    "description": "Maximum power solar light for industrial applications",
    "features": ["Solar powered", "LED technology", "Weather resistant", "Auto on/off"]
  },
  {
    "image": "/KTJ 100watts.jpg",
    "name": "KTJ Fseries 100watts",
    "price": "₦28,000",
    "alt": "KTJ Fseries 100watts",
    "category": "KTJ",
    "wattage": 100,
    "description": "Compact and efficient KTJ solar light for small spaces",
    "features": ["Solar powered", "LED technology", "Compact design", "Energy efficient"]
  },
  {
    "image": "/KTJ 150watts.jpg",
    "name": "KTJ 150watts",
    "price": "₦37,000",
    "alt": "KTJ 150watts",
    "category": "KTJ",
    "wattage": 150,
    "description": "Reliable mid-range KTJ solar lighting solution",
    "features": ["Solar powered", "LED technology", "Durable build", "Easy installation"]
  },
  {
    "image": "/KTJ 590 150watts.jpg",
    "name": "KTJ 590 150watts",
    "price": "₦39,000",
    "alt": "KTJ 590 150watts",
    "category": "KTJ",
    "wattage": 150,
    "description": "Advanced KTJ 590 series with enhanced features",
    "features": ["Solar powered", "LED technology", "590 series design", "Weather resistant"]
  },
  {
    "image": "/KTJ 300watts.jpg",
    "name": "KTJ 300watts",
    "price": "₦67,000",
    "alt": "KTJ 300watts",
    "category": "KTJ",
    "wattage": 300,
    "description": "High-performance KTJ solar light for commercial use",
    "features": ["Solar powered", "LED technology", "Commercial grade", "Long-lasting"]
  },
  {
    "image": "/KTJ 300watts with Panel.jpg",
    "name": "KTJ 300watts with Panel",
    "price": "₦70,000",
    "alt": "KTJ 300watts with Panel",
    "category": "KTJ",
    "wattage": 300,
    "description": "Complete KTJ system with integrated solar panel",
    "features": ["Solar powered", "LED technology", "Integrated panel", "Complete system"]
  },
  {
    "image": "/KTJ 350watts.jpg",
    "name": "KTJ 350watts",
    "price": "₦72,000",
    "alt": "KTJ 350watts",
    "category": "KTJ",
    "wattage": 350,
    "description": "Premium KTJ solar lighting with enhanced output",
    "features": ["Solar powered", "LED technology", "High output", "Premium quality"]
  },
  {
    "image": "/KTJ 450watts.jpg",
    "name": "KTJ 450watts",
    "price": "₦40,000",
    "alt": "KTJ 450watts",
    "category": "KTJ",
    "wattage": 450,
    "description": "High-capacity KTJ solar light for large areas",
    "features": ["Solar powered", "LED technology", "Large coverage", "Efficient design"]
  },
  {
    "image": "/KTJ 500watts.jpg",
    "name": "KTJ 500watts",
    "price": "₦60,000",
    "alt": "KTJ 500watts",
    "category": "KTJ",
    "wattage": 500,
    "description": "Professional-grade KTJ solar lighting solution",
    "features": ["Solar powered", "LED technology", "Professional grade", "High reliability"]
  },
  {
    "image": "/KTJ 1300watts.jpg",
    "name": "KTJ 1300watts",
    "price": "₦95,000",
    "alt": "KTJ 1300watts",
    "category": "KTJ",
    "wattage": 1300,
    "description": "Ultra-high power KTJ solar light for industrial use",
    "features": ["Solar powered", "LED technology", "Ultra-high power", "Industrial grade"]
  },
  {
    "image": "/KTj Yseries.jpg",
    "name": "KTJ Y-Series",
    "price": "₦52,000",
    "alt": "KTJ Y-Series",
    "category": "KTJ",
    "wattage": 300,
    "description": "Innovative Y-Series design with modern aesthetics",
    "features": ["Solar powered", "LED technology", "Y-series design", "Modern aesthetics"]
  },
  {
    "image": "/De Cecon LED Solar Light 600w.jpg",
    "name": "De Cecon LED Solar Light 600w",
    "price": "₦58,000",
    "alt": "De Cecon LED Solar Light 600w",
    "category": "De Cecon",
    "wattage": 600,
    "description": "Premium De Cecon LED solar light with advanced features",
    "features": ["Solar powered", "LED technology", "Premium build", "Advanced features"]
  },
  {
    "image": "/De Cecon LED Solar Light 800w.jpg",
    "name": "De Cecon LED Solar Light 800w",
    "price": "₦65,000",
    "alt": "De Cecon LED Solar Light 800w",
    "category": "De Cecon",
    "wattage": 800,
    "description": "High-power De Cecon LED for extensive illumination",
    "features": ["Solar powered", "LED technology", "High power", "Wide coverage"]
  },
  {
    "image": "/De Cecon LED Solar Light 1000w.jpg",
    "name": "De Cecon LED Solar Light 1000w",
    "price": "₦78,000",
    "alt": "De Cecon LED Solar Light 1000w",
    "category": "De Cecon",
    "wattage": 1000,
    "description": "Ultra-bright De Cecon LED for large area lighting",
    "features": ["Solar powered", "LED technology", "Ultra-bright", "Large area coverage"]
  },
  {
    "image": "/De Cecon LED Solar Light 1200w.jpg",
    "name": "De Cecon LED Solar Light 1200w",
    "price": "₦88,000",
    "alt": "De Cecon LED Solar Light 1200w",
    "category": "De Cecon",
    "wattage": 1200,
    "description": "Maximum output De Cecon LED for commercial applications",
    "features": ["Solar powered", "LED technology", "Maximum output", "Commercial grade"]
  },
  {
    "image": "/EcoBoost Indoor.jpg",
    "name": "EcoBoost Indoor Solar Light",
    "price": "₦25,000",
    "alt": "EcoBoost Indoor Solar Light",
    "category": "EcoBoost",
    "wattage": 50,
    "description": "Indoor solar lighting solution for homes and offices",
    "features": ["Solar powered", "LED technology", "Indoor use", "Compact design"]
  },
  {
    "image": "/Highway Street Light.jpg",
    "name": "Highway Street Light",
    "price": "₦120,000",
    "alt": "Highway Street Light",
    "category": "Street Lights",
    "wattage": 1000,
    "description": "Professional highway street lighting for main roads",
    "features": ["Solar powered", "LED technology", "Highway grade", "Weather resistant"]
  },
  {
    "image": "/Highway Street Light 200watts.jpg",
    "name": "Highway Street Light 200watts",
    "price": "₦115,000",
    "alt": "Highway Street Light 200watts",
    "category": "Street Lights",
    "wattage": 200,
    "description": "Efficient highway street light for secondary roads",
    "features": ["Solar powered", "LED technology", "Highway approved", "Energy efficient"]
  },
  {
    "image": "/IP65 with Metallic Casing.jpg",
    "name": "IP65 with Metallic Casing",
    "price": "₦85,000",
    "alt": "IP65 with Metallic Casing",
    "category": "Industrial",
    "wattage": 500,
    "description": "Industrial-grade solar light with IP65 protection",
    "features": ["Solar powered", "LED technology", "IP65 rated", "Metallic casing"]
  },
  {
    "image": "/Multiple lens Solar camera street light.jpg",
    "name": "Multiple Lens Solar Camera Street Light",
    "price": "₦150,000",
    "alt": "Multiple Lens Solar Camera Street Light",
    "category": "Smart Lights",
    "wattage": 800,
    "description": "Advanced solar street light with integrated security cameras",
    "features": ["Solar powered", "LED technology", "Security cameras", "Smart features"]
  },
  {
    "image": "/Single Lens Camera Solar Street Light.jpg",
    "name": "Single Lens Camera Solar Street Light",
    "price": "₦125,000",
    "alt": "Single Lens Camera Solar Street Light",
    "category": "Smart Lights",
    "wattage": 600,
    "description": "Solar street light with single integrated security camera",
    "features": ["Solar powered", "LED technology", "Security camera", "Motion detection"]
  }
];

async function migrateData() {
  let client;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Connected to MongoDB successfully!');
    
    const database = client.db('nzeoma_solar');
    const collection = database.collection('products');
    
    // Clear existing data
    console.log('🧹 Clearing existing products...');
    await collection.deleteMany({});
    
    // Add timestamps to each product
    const productsWithTimestamps = solarProductsData.map(product => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
      inStock: true,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 50) + 10 // Random reviews between 10-60
    }));
    
    // Insert new data
    console.log('📦 Inserting product data...');
    const result = await collection.insertMany(productsWithTimestamps);
    
    console.log(`✅ Successfully migrated ${result.insertedCount} products to MongoDB!`);
    
    // Verify the data
    const count = await collection.countDocuments();
    console.log(`📊 Total products in database: ${count}`);
    
    // Show some sample data
    console.log('\n📋 Sample products:');
    const samples = await collection.find({}).limit(3).toArray();
    samples.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.price} (${product.wattage}W)`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔐 MongoDB connection closed');
    }
  }
}

// Run the migration
migrateData();
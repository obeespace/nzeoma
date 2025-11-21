const { MongoClient } = require('mongodb');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const uri = process.env.MONGODB_URI;

async function testDatabase() {
  let client;
  
  try {
    console.log('🔍 Testing MongoDB connection...');
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const database = client.db('nzeoma_solar');
    const collection = database.collection('products');
    
    // Check if products exist
    const count = await collection.countDocuments();
    console.log(`📊 Total products in database: ${count}`);
    
    if (count > 0) {
      // Show a few sample products
      console.log('\n📋 Sample products from database:');
      const samples = await collection.find({}).limit(3).toArray();
      samples.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: ${product.price}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   Created: ${product.createdAt?.toISOString()}`);
        console.log('');
      });
      
      // Test API endpoint
      console.log('🌐 Testing API endpoint...');
      try {
        const response = await fetch('http://localhost:3000/api/products');
        if (response.ok) {
          const apiData = await response.json();
          console.log(`✅ API returned ${apiData.length} products`);
          
          if (apiData.length > 0) {
            console.log(`📱 First product from API: ${apiData[0].name}`);
          }
        } else {
          console.log(`❌ API returned status: ${response.status}`);
        }
      } catch (apiError) {
        console.log(`❌ API test failed: ${apiError.message}`);
        console.log('💡 Make sure your Next.js server is running on port 3000');
      }
      
    } else {
      console.log('❌ No products found in database!');
      console.log('💡 Run the migration script first: node scripts/migrate-data.js');
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('🔐 MongoDB connection closed');
    }
  }
}

testDatabase();
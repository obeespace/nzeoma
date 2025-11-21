import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env.local') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

console.log('🔍 Testing MongoDB connection...');
console.log('URI starts with:', uri.substring(0, 30) + '...');

async function testConnection() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4 // Force IPv4
  });

  try {
    console.log('🔌 Attempting to connect...');
    await client.connect();
    
    console.log('✅ Connection successful!');
    
    // Test database access
    const db = client.db('nzeoma_solar');
    const collection = db.collection('products');
    
    console.log('📋 Testing collection access...');
    const count = await collection.countDocuments();
    console.log(`📊 Found ${count} documents in products collection`);
    
    // Insert a test document to verify write access
    console.log('📝 Testing write access...');
    const testDoc = {
      name: 'Connection Test',
      price: '₦1,000',
      alt: 'Test document',
      image: 'test.jpg',
      createdAt: new Date(),
      isTestDocument: true
    };
    
    const insertResult = await collection.insertOne(testDoc);
    console.log('✅ Write test successful, inserted ID:', insertResult.insertedId);
    
    // Clean up test document
    await collection.deleteOne({ _id: insertResult.insertedId });
    console.log('🧹 Test document cleaned up');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ETIMEOUT')) {
      console.log('\n🔧 DNS/Network troubleshooting suggestions:');
      console.log('1. Check your internet connection');
      console.log('2. Try switching to a different network (mobile hotspot)');
      console.log('3. Check if your firewall is blocking MongoDB connections');
      console.log('4. Verify your MongoDB Atlas cluster is running');
      console.log('5. Check your MongoDB Atlas network access settings');
    }
  } finally {
    await client.close();
    console.log('🔐 Connection closed');
  }
}

testConnection();
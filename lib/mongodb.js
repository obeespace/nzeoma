import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 15000,
  maxIdleTimeMS: 30000,
  // DNS resolution options
  family: 4, // Force IPv4
  // Retry logic
  retryWrites: true,
  // Read preference
  readPreference: 'primary'
};

if (!uri) {
  console.error('MongoDB URI not found. Checking environment variables...');
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  throw new Error('Please add your MongoDB URI to .env.local as MONGODB_URI');
}

console.log('MongoDB URI found:', uri ? 'Yes' : 'No');
console.log('MongoDB URI starts with:', uri?.substring(0, 20));

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
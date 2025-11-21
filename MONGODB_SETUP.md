# MongoDB Setup Guide for Nzeoma Solar

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Create free account** or sign in
3. **Create new cluster** (free tier available)
4. **Create database user**:
   - Database Access → Add New Database User
   - Username: `nzeoma_admin`
   - Password: Generate secure password
5. **Whitelist IP addresses**:
   - Network Access → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for development)
6. **Get connection string**:
   - Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password

## Option 2: Local MongoDB

1. **Install MongoDB Community Server**:
   - Download from: https://www.mongodb.com/try/download/community
   - Install with default settings
2. **Start MongoDB service**:
   - Windows: MongoDB should start automatically
   - Check if running: `mongod --version`

## Update Environment Variables

Replace the MongoDB URI in `.env.local`:

### For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://nzeoma_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/nzeoma_solar?retryWrites=true&w=majority
```

### For Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/nzeoma_solar
```

## VS Code MongoDB Extension Usage

1. **Open Command Palette**: `Ctrl+Shift+P`
2. **Type**: "MongoDB: Connect"
3. **Enter your connection string**
4. **Explore your database**:
   - View collections
   - Run queries
   - Monitor data changes

## Database Structure

Your products will be stored in:
- **Database**: `nzeoma_solar`
- **Collection**: `products`
- **Document Structure**:
  ```json
  {
    "id": "1701234567890",
    "name": "Solar Street Light 100W",
    "price": "₦45,000",
    "image": "data:image/jpeg;base64,...",
    "alt": "100W Solar Street Light",
    "createdAt": "2024-11-21T...",
    "updatedAt": "2024-11-21T..."
  }
  ```

## Testing Connection

After setting up, restart your Next.js server and check the console for:
- ✅ "Loaded from MongoDB: X products"
- ❌ "MongoDB connection failed, using fallback"

The system will automatically fall back to localStorage if MongoDB is unavailable.
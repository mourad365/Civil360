# 🚀 Civil360 Installation Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your MongoDB connection
   # Default: mongodb://localhost:27017/civil360
   ```

3. **Start MongoDB** (if using local MongoDB)
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb/brew/mongodb-community
   ```

4. **Run the Application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

5. **Access the App**
   - Open: http://localhost:5000
   - Login with: `marc.dubois` / `password`

## 🔧 Dependencies Installed

The following dependencies have been added to package.json:

### Production Dependencies
- `mongoose`: MongoDB object modeling
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable loading
- `multer`: File upload handling

### Development Dependencies
- `@types/bcryptjs`: TypeScript types for bcryptjs
- `@types/jsonwebtoken`: TypeScript types for jsonwebtoken
- `@types/cors`: TypeScript types for cors
- `@types/multer`: TypeScript types for multer

## 🗄️ MongoDB Setup Options

### Option 1: Local MongoDB
1. Download from: https://www.mongodb.com/try/download/community
2. Install and start the service
3. Use default connection: `mongodb://localhost:27017/civil360`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at: https://www.mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` file

## 🔐 Environment Variables

Required variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/civil360
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

## 🎯 What's Been Implemented

### ✅ Backend Features
- **MongoDB Integration**: Complete database setup with Mongoose
- **User Authentication**: JWT-based auth with bcryptjs password hashing
- **API Endpoints**: All CRUD operations for projects, IoT, quality checks
- **File Upload**: Multer integration for plan files and images
- **Middleware**: Authentication, CORS, error handling
- **Database Models**: Users, Projects, AI Analysis, IoT Equipment, Quality Checks

### ✅ Database Schema
- **Users**: Authentication and user management
- **Projects**: Construction project data
- **AI Plan Analysis**: File analysis and AI results
- **IoT Equipment**: Device tracking and sensor data
- **Quality Checks**: Inspection results and images
- **Mobile Sync**: Offline synchronization queue
- **Odoo Sync**: ERP integration logs
- **Predictions**: AI-powered project predictions

### ✅ Authentication System
- User registration and login
- JWT token generation and validation
- Password hashing with bcrypt
- Protected routes with middleware
- User profile management

### ✅ API Security
- CORS protection
- Input validation with Zod schemas
- File upload restrictions
- Error handling and logging
- Authentication middleware

## 📁 File Structure Created

```
server/
├── config/
│   └── database.ts          # MongoDB connection
├── middleware/
│   ├── auth.ts              # JWT authentication
│   └── upload.ts            # File upload handling
├── models/                  # Mongoose models
│   ├── User.ts
│   ├── Project.ts
│   ├── AiPlanAnalysis.ts
│   ├── IoTEquipment.ts
│   ├── QualityCheck.ts
│   ├── MobileSyncQueue.ts
│   ├── OdooSync.ts
│   └── Prediction.ts
├── routes/
│   └── auth.ts              # Authentication routes
├── storage-mongo.ts         # MongoDB storage implementation
└── index.ts                 # Updated main server file
```

## 🔗 API Endpoints Added

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/me` - Update profile
- `PUT /api/auth/change-password` - Change password

### All existing endpoints now use MongoDB backend
- Dashboard statistics
- Project management
- AI plan analysis
- IoT equipment monitoring
- Quality control
- Mobile synchronization
- Odoo integration
- Predictive analytics

## ⚡ Next Steps

After installation:

1. **Test the API**: Use Postman or similar to test endpoints
2. **Create Users**: Register new users via `/api/auth/register`
3. **Upload Files**: Test file upload for plans and quality images
4. **Monitor Data**: Check MongoDB collections for data persistence
5. **Customize**: Modify schemas and endpoints as needed

The backend is now fully implemented with MongoDB and ready for production use!

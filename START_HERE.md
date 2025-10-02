# Civil360 - Single Port Application

## Overview
Civil360 is now a unified Next.js application running on a **single port (3000)** without Vite or separate backend/frontend servers.

## Project Structure
```
Civil360/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes (replaces Express server)
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── dashboard/    # Dashboard data
│   │   │   ├── projects/     # Project management
│   │   │   ├── equipment/    # Equipment management
│   │   │   ├── purchasing/   # Purchase orders
│   │   │   └── notifications/# Notifications
│   │   ├── dashboard/        # Dashboard pages
│   │   └── login/           # Login page
│   ├── components/          # React components
│   ├── lib/                # Utilities and helpers
│   │   ├── auth-helpers.ts # Authentication helpers for API routes
│   │   └── db-init.ts     # Database initialization
│   └── server/            # Backend models and storage
│       ├── models/       # Mongoose models
│       ├── config/       # Database configuration
│       └── storage-mongo.ts # MongoDB storage layer
├── package.json          # Dependencies (type: module)
├── next.config.mjs      # Next.js configuration
└── populate.js         # Database population script
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file with:
```
MONGODB_URI=mongodb://127.0.0.1:27017/civil360
JWT_SECRET=your-secret-key-for-development
NODE_ENV=development
```

### 3. Populate Database (First Time)
```bash
npm run populate
```

### 4. Start Development Server
```bash
npm run dev
```

The application runs on **http://localhost:3000**

## Key Features

### Single Port Architecture
- **Frontend**: Next.js pages and components
- **Backend**: Next.js API routes (`/api/*`)
- **Database**: MongoDB (Mongoose)
- **Port**: 3000 (single port for everything)

### API Routes
All API endpoints are now Next.js API routes:
- `/api/auth/*` - Authentication (login, register, profile)
- `/api/dashboard/*` - Dashboard statistics and data
- `/api/projects/*` - Project CRUD operations
- `/api/equipment/*` - Equipment management
- `/api/purchasing/orders/*` - Purchase order management
- `/api/notifications/*` - User notifications

### Development Features
- **Mock Authentication**: Auto-login in development mode
- **Hot Reload**: Next.js development server with fast refresh
- **TypeScript**: Full type safety
- **Modern UI**: Glassmorphism design with Tailwind CSS

## Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run populate` - Populate database with sample data
- `npm run check` - TypeScript type checking
- `npm run clean` - Clean build artifacts

## Database

### Connection
MongoDB connection is auto-initialized when any API route is called. The connection is managed through `src/lib/db-init.ts`.

### Models Location
All Mongoose models are in `src/server/models/`:
- User.ts
- Project.ts
- Equipment.ts
- PurchaseOrder.ts
- Notification.ts
- Material.ts
- Supplier.ts

## Authentication

### Development Mode
In development, mock authentication provides different users based on URL paths:
- General Director
- Project Engineer
- Purchasing Manager
- Logistics Manager

### Production Mode
Uses JWT tokens with the `JWT_SECRET` from environment variables.

## Migration from Dual-Server Setup

### What Changed
✅ **Removed**:
- Separate Express server (`src/server/index.ts` no longer runs)
- Port 3001 (API server)
- `concurrently` for running multiple processes
- API rewrites in `next.config.mjs`
- Dependencies: `express-session`, `cors`, `passport`, `ws`, `cross-env`, `tsx`, `esbuild`

✅ **Added**:
- Next.js API routes in `src/app/api/`
- `auth-helpers.ts` for authentication
- `db-init.ts` for database initialization
- Type-safe API route handlers

### Benefits
- Single port (easier deployment)
- No CORS issues
- Simpler development workflow
- Better TypeScript integration
- Unified codebase

## Deployment

### Build
```bash
npm run build
```

### Start Production
```bash
npm start
```

The production server runs on port 3000 by default. Use the `PORT` environment variable to change it.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally
- Check `MONGODB_URI` in `.env`
- Run `npm run populate` to create initial data

### Port Already in Use
- Change port: `PORT=3001 npm run dev`
- Check if another Next.js instance is running

### TypeScript Errors
- Run `npm run check` to see all type errors
- Rebuild: `npm run clean && npm run build`

## Support

For questions or issues, check the project documentation or create an issue in the repository.

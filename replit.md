# Overview

CIVIL360 is a comprehensive construction project management platform designed specifically for civil engineering execution teams. The system complements existing ERP solutions (like Odoo) by providing specialized construction management capabilities including AI-powered plan analysis, IoT equipment tracking, real-time quality control, and mobile field interfaces. The platform addresses the unique operational challenges of construction sites with features like offline functionality, rugged mobile interfaces, and automated reporting.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: React 18 with TypeScript, using Vite as the build tool and development server. The UI is built with Radix UI components and styled with Tailwind CSS following the shadcn/ui design system.

**Architecture Pattern**: The frontend follows a component-based architecture with:
- Page-level components for major application sections (Dashboard, Projects, IoT Equipment, etc.)
- Reusable UI components for common functionality (KPI cards, device displays, quality checks)
- Custom hooks for real-time data management and mobile-specific functionality
- React Query for state management and API caching

**Routing**: Uses Wouter for lightweight client-side routing with a centralized layout component that includes a responsive sidebar navigation.

**Responsive Design**: Mobile-first approach with specific optimizations for construction site usage, including touch-friendly interfaces and offline capability indicators.

## Backend Architecture

**Technology Stack**: Node.js with Express.js framework, using TypeScript throughout the codebase for type safety.

**Database Layer**: PostgreSQL with Drizzle ORM for type-safe database operations and migrations. Database configuration supports Neon serverless PostgreSQL for cloud deployment.

**API Design**: RESTful API architecture with organized route handlers for different functional areas (projects, IoT equipment, quality checks, AI analysis, Odoo integration).

**Data Storage Pattern**: Repository pattern implementation with a storage abstraction layer that provides methods for CRUD operations across all major entities.

## Database Schema Design

**Core Entities**:
- **Users**: Role-based access with construction-specific roles (Chef d'Exécution, Chef de Chantier)
- **Projects**: Construction projects with geolocation, budget tracking, and progress monitoring
- **AI Plan Analysis**: File processing tracking for CAD/BIM documents with AI confidence scoring
- **IoT Equipment**: Real-time equipment tracking with status monitoring and geolocation
- **Quality Checks**: Construction quality control with photo attachments and compliance tracking
- **Mobile Sync Queue**: Offline synchronization support for field operations
- **Odoo Sync**: Integration tracking with external ERP systems

**Relationships**: Foreign key relationships between projects and related entities (equipment assignments, quality checks, AI analyses) with proper referential integrity.

## Real-Time Data Management

**Polling Strategy**: Uses custom React hooks for real-time data updates with configurable intervals (5-10 seconds) optimized for construction site connectivity conditions.

**Offline Support**: Built-in offline queue management for mobile operations with automatic synchronization when connectivity is restored.

**Caching Strategy**: React Query for intelligent caching with stale-while-revalidate patterns to ensure data freshness while maintaining performance.

## Integration Architecture

**Odoo ERP Integration**: Designed as a complementary system that syncs specific data points with existing Odoo installations while maintaining specialized construction functionality that Odoo cannot provide natively.

**Google Cloud Integration**: File storage capabilities using Google Cloud Storage for construction documents, photos, and plan files.

**IoT Integration**: WebSocket support and REST API endpoints designed for real-time equipment data ingestion from construction site IoT devices.

## Mobile-First Design

**Progressive Web App**: Designed to function as a PWA with offline capabilities essential for construction site operations where connectivity may be intermittent.

**Touch Interface**: Large touch targets and simplified navigation optimized for use with work gloves and in challenging environmental conditions.

**Rugged UI Components**: Weather-resistant interface design with high contrast colors and large text for outdoor visibility.

# External Dependencies

## Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management

## Cloud Services
- **Google Cloud Storage**: File storage for construction documents, photos, and CAD/BIM files

## Frontend Libraries
- **React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library optimized for construction/technical interfaces

## Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundling for production builds

## Authentication & Security
- Session-based authentication with connect-pg-simple for PostgreSQL session storage

## ERP Integration
- **Odoo API**: RESTful integration for synchronizing personnel, project data, and billing information while maintaining specialized construction functionality
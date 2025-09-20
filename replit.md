# Overview

TechMart is a minimal e-commerce website built for selling electronics like monitors, keyboards, mice, and audio equipment. The application provides a complete shopping experience with user authentication, product browsing, cart management, and order processing. It features a modern, responsive design with a dark theme optimized for both desktop and mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React 18 and TypeScript using Vite as the build tool. The architecture follows a modern component-based approach:

- **UI Framework**: React with TypeScript for type safety and better development experience
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Authentication**: Custom React context provider managing user sessions

The frontend implements a responsive design with mobile-first approach, featuring protected routes for authenticated pages and optimistic UI updates for better user experience.

## Backend Architecture
The server is built with Express.js following RESTful API principles:

- **Framework**: Express.js with TypeScript for type-safe server development
- **Authentication**: Passport.js with local strategy using session-based authentication
- **Session Management**: Express sessions with PostgreSQL session store for persistence
- **Password Security**: Native Node.js crypto module with scrypt for secure password hashing
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling
- **Middleware**: Custom logging, authentication guards, and request validation

## Data Layer
The application uses PostgreSQL as the primary database with Drizzle ORM:

- **Database**: PostgreSQL for reliable data persistence
- **ORM**: Drizzle ORM for type-safe database queries and schema management
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Schema**: Well-structured tables for users, products, cart, orders, and contacts with proper relationships
- **Migrations**: Drizzle Kit for database schema migrations and version control

The database design includes proper foreign key relationships, UUID primary keys for security, and optimized indexes for performance.

## Authentication & Authorization
Session-based authentication system:

- **Strategy**: Local username/password authentication via Passport.js
- **Session Storage**: PostgreSQL-backed sessions for scalability
- **Password Security**: Scrypt-based password hashing with salt
- **Route Protection**: Middleware-based authentication guards for protected endpoints
- **Client Integration**: Context-based authentication state management in React

## Key Features
- **Product Management**: Dynamic product catalog with categories, ratings, and inventory tracking
- **Shopping Cart**: Persistent cart functionality tied to user sessions
- **Order Processing**: Complete order workflow with customer details and order history
- **Contact System**: Contact form with database persistence for customer inquiries
- **Responsive Design**: Mobile-optimized interface with touch-friendly interactions

# External Dependencies

## Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database hosting with automatic scaling
- **Drizzle ORM**: Type-safe database toolkit with automatic schema generation

## Frontend Libraries
- **React Query**: Server state management and data synchronization
- **shadcn/ui**: Pre-built accessible UI components based on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive styling
- **React Hook Form**: Performance-focused form management with validation
- **Zod**: TypeScript-first schema validation library

## Backend Dependencies
- **Passport.js**: Authentication middleware for Node.js applications
- **Express Session**: Session management middleware with PostgreSQL store
- **Connect PG Simple**: PostgreSQL session store for Express sessions

## Build & Development Tools
- **Vite**: Fast frontend build tool with hot module replacement
- **TypeScript**: Static type checking for both frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing tool with Tailwind CSS integration

## Image & Asset Management
- **Unsplash**: External image service for product photos and hero banners
- **Google Fonts**: Web font delivery for Inter font family
- **Lucide React**: Consistent icon library for UI elements
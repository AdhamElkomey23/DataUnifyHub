# Business Management Application

## Overview

This is an internal business management platform designed to centralize and streamline operations for a tourism/travel company. The application replaces scattered Excel sheets, WhatsApp communications, and fragmented data with a unified system for managing prices, contacts, tasks, and knowledge base articles. Built with a focus on efficiency and clarity, it serves as the single source of truth for all business-critical information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Core Technologies:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System:**
- Shadcn/ui component library (New York style) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Dark mode as default theme with light mode support
- Custom design system inspired by Linear and Notion for information-dense interfaces

**Design Principles:**
- Clarity over aesthetics - utility-focused for daily operations
- Consistent patterns for faster learning and muscle memory
- Dark mode primary (220 15% 12% background) for reduced eye strain during long work hours
- Role-based accent colors (Admin: purple, Operations: blue, Sales: teal)

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for REST API endpoints
- Custom middleware for request logging and error handling
- Session-based authentication preparation (infrastructure in place)

**API Design:**
- RESTful endpoints organized by domain (prices, contacts, tasks, articles)
- Consistent response patterns with error handling
- CRUD operations for all major entities
- Query parameter-based filtering and search

**Key Routes:**
- `/api/prices` - Price management with filtering (city, serviceType, category)
- `/api/contacts` - Contact directory operations
- `/api/tasks` - Task management with assignment and status tracking
- `/api/articles` - Knowledge base content management
- Price history tracking at `/api/prices/:id/history`

### Data Storage

**Database:**
- PostgreSQL via Neon serverless with WebSocket connections
- Drizzle ORM for type-safe database operations and migrations
- Schema-first approach with Zod validation integration

**Schema Design:**
- `users` - User authentication and role management (sales, admin, operations roles)
- `prices` - Service pricing with versioning (serviceName, serviceType, city, category, costPrice)
- `priceHistory` - Audit trail for price changes (tracks field, oldValue, newValue, changedBy)
- `contacts` - Business contacts with categorization (name, role, company, category, whatsapp, email, tags)
- `tasks` - Task management (title, assignee, status, priority, department, dueDate)
- `taskComments` & `taskActivityLog` - Task collaboration and change tracking
- `knowledgeArticles` - Internal documentation (title, content, category, excerpt)

**Data Patterns:**
- Timestamp tracking (createdAt, updatedAt) on all primary entities
- Soft references using text fields for user attribution
- JSON arrays for flexible fields (tags, relatedUrls, attachments)
- Decimal precision (10,2) for price handling with multi-currency support

### External Dependencies

**Database & Infrastructure:**
- Neon Postgres serverless database with WebSocket pooling
- Custom WebSocket proxy configuration for secure connections
- Environment-based configuration (DATABASE_URL required)

**UI Component Libraries:**
- Radix UI primitives (20+ components: Dialog, Select, Popover, etc.)
- Lucide React for consistent iconography
- React Icons (Simple Icons) for brand icons (WhatsApp integration)
- CMDK for command palette functionality
- date-fns for date formatting and manipulation

**Development Tools:**
- Drizzle Kit for database migrations
- ESBuild for server bundling in production
- TSX for TypeScript execution in development
- Replit-specific plugins (vite-plugin-runtime-error-modal, cartographer, dev-banner)

**Form & Validation:**
- React Hook Form with Zod resolvers for type-safe form validation
- Drizzle-Zod for automatic schema-to-validation conversion

**Notable Integrations:**
- WhatsApp deep linking (wa.me) for direct contact communication
- Email mailto: links for contact management
- Export functionality preparation for pricing data
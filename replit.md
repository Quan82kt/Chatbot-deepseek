# Vietnamese Wedding Invitation Chatbot

## Overview

This is a full-stack web application that provides an AI-powered chatbot for Vietnamese wedding invitation consultations. The system helps users with questions about digital wedding invitations, emphasizing that these are electronic invitations sent via personalized links rather than printed cards.

**Current Status**: Fully functional chatbot with pricing information
- Normal: 169,000 VND
- Pro: 289,000 VND  
- VIP: 510,000 VND
- SVIP: 730,000 VND

**Latest Update**: January 16, 2025 - Added pricing tiers and fixed UTF-8 encoding for Vietnamese text support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom wedding theme colors
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Style**: REST API with JSON responses
- **Development**: Hot reload with Vite middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Development Storage**: In-memory storage implementation for development
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### AI Integration
- **Provider**: OpenRouter AI API
- **Model**: DeepSeek Chat (free tier)
- **Specialization**: Vietnamese wedding invitation consultation
- **Response Style**: Short, friendly, and professional responses

### Database Schema
- **Users Table**: Basic user authentication (username, password)
- **Chat Messages Table**: Conversation history with session tracking
- **Session Management**: UUID-based session identification

### UI Components
- **Chat Interface**: Real-time messaging with user/bot message distinction
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Theme**: Custom wedding color scheme with pink accents
- **Toast Notifications**: User feedback for errors and confirmations

## Data Flow

1. **User Input**: User types message in chat interface
2. **Local State**: Message immediately added to local state for instant feedback
3. **API Call**: Message sent to `/api/chat` endpoint with session ID
4. **AI Processing**: OpenRouter API processes message with Vietnamese wedding context
5. **Response Storage**: Both user and AI messages stored in database
6. **UI Update**: AI response displayed in chat interface

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Database ORM and query builder
- **express**: Web server framework
- **react**: Frontend framework
- **tailwindcss**: CSS framework
- **zod**: Runtime type validation

### AI Integration
- **OpenRouter API**: External AI service for chat responses
- **API Key**: Required environment variable `OPENROUTER_API_KEY`

### UI Libraries
- **@radix-ui**: Headless UI components
- **shadcn/ui**: Pre-built component library
- **lucide-react**: Icon library
- **wouter**: Lightweight routing

## Deployment Strategy

### Environment Configuration
- **Development**: Uses in-memory storage and Vite dev server
- **Production**: Requires PostgreSQL database connection
- **Environment Variables**: 
  - `DATABASE_URL`: PostgreSQL connection string
  - `OPENROUTER_API_KEY`: AI service authentication

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database Setup**: Drizzle migrations applied via `npm run db:push`

### Server Setup
- **Development**: `npm run dev` starts both frontend and backend
- **Production**: `npm start` serves built application
- **Static Files**: Express serves built frontend from `/dist/public`

### Database Management
- **Schema**: Defined in `shared/schema.ts`
- **Migrations**: Generated in `./migrations` directory
- **Configuration**: Drizzle config in `drizzle.config.ts`

The application follows a monorepo structure with shared types and schemas, enabling type safety across the full stack while maintaining clear separation between client and server code.
# GitHub Copilot Instructions

## Project Overview

This is a **Chrome DevTools Demo Project** - a monorepo designed to showcase the powerful capabilities of Chrome DevTools through interactive examples and real-world scenarios. The project demonstrates how developers can leverage Chrome DevTools for debugging, performance analysis, network monitoring, and code optimization.

## Project Structure

```
chromeDevTools-are-you-confident-in-your-expertise/
├── apps/
│   ├── backend/                 # Fastify API server
│   │   ├── src/
│   │   │   ├── server.ts       # Main server entry point
│   │   │   ├── config/         # Configuration files
│   │   │   └── routes/         # API route definitions
│   │   ├── package.json        # Backend dependencies
│   │   └── tsconfig.json       # TypeScript config
│   └── frontend/               # Next.js React application
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── page.tsx    # Beautiful hero home page
│       │   │   ├── layout.tsx  # Root layout with navigation
│       │   │   ├── todos/      # Todo list page (SSR demo)
│       │   │   └── api/        # Next.js API routes
│       │   └── components/     # Reusable React components
│       ├── package.json        # Frontend dependencies
├── packages/
│   └── api/                    # Shared API schemas and types package
│       ├── src/
│       │   ├── index.ts        # Package exports
│       │   ├── common.ts       # Common schemas (NotFound, etc.)
│       │   └── todos.ts        # Todo-related Zod schemas and types
│       ├── package.json        # Shared package dependencies
│       └── tsconfig.json       # TypeScript config for package
└── package.json                # Root workspace configuration
```

## Technology Stack

### Backend (Fastify)
- **Fastify**: High-performance web framework
- **TypeScript**: Type-safe JavaScript
- **Pino Logger**: Structured logging for debugging
- **CORS**: Cross-origin resource sharing
- **Health Check**: API monitoring endpoints

### Frontend (Next.js)
- **Next.js 14+**: React framework with App Router
- **React 18+**: Modern React with hooks and Suspense
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling framework
- **Server-Side Rendering (SSR)**: Performance optimization

## Shared Packages

### @devtools-demo/api Package
- **Zod Schemas**: Type-safe API validation and schemas
- **TypeScript Types**: Shared type definitions across frontend and backend
- **Schema Validation**: Input validation for Todo operations
- **Build System**: tsup for dual CommonJS/ESM output
- **Type Safety**: Ensures consistent data structures across the monorepo

## Development Guidelines

### Code Style & Patterns

1. **TypeScript First**: Always use TypeScript with strict type checking
2. **Functional Components**: Prefer function components with hooks
3. **Server Components**: Use React Server Components where appropriate
4. **Error Boundaries**: Implement proper error handling
5. **Accessibility**: Follow WCAG guidelines and semantic HTML

### Component Architecture

```typescript
// Preferred component pattern
interface ComponentProps {
  // Always define prop types
}

const Component = ({ prop }: ComponentProps) => {
  // Use hooks for state management
  const [state, setState] = useState();
  
  // Performance optimization
  const memoizedValue = useMemo(() => computation, [deps]);
  
  return (
    <div className="tailwind-classes">
      {/* Content */}
    </div>
  );
};

export default Component;
```

## Common Development Patterns

### Error Handling
```typescript
try {
  // Operation
  console.log('✅ Operation successful');
} catch (error) {
  console.error('❌ Operation failed:', error);
  // User-friendly error handling
}
```
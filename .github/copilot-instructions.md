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
│       └── tailwind.config.ts  # Tailwind CSS configuration
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

## Key Features for DevTools Demonstration

### 1. Network Monitoring
- **Slow-loading hero image**: Demonstrates Network tab capabilities
- **API requests**: Shows XHR/Fetch requests in Network panel
- **Simulated delays**: Intentional delays to observe network activity
- **Request/Response inspection**: Full headers, timing, and payload analysis

### 2. Performance Analysis
- **SSR pages**: Demonstrates initial page load performance
- **Client-side hydration**: Shows React hydration process
- **Performance marks**: Custom performance measurements
- **Memory usage**: Demonstrates heap snapshots and memory profiling

### 3. Console Debugging
- **Structured logging**: Different log levels (info, warn, error)
- **Interactive buttons**: Trigger console messages for testing
- **Error simulation**: Intentional errors for debugging practice
- **Performance metrics**: Console-based performance reporting

### 4. Elements Inspection
- **Component hierarchy**: Complex React component structure
- **CSS styling**: Tailwind classes and custom styles
- **DOM manipulation**: Interactive elements for inspection
- **Responsive design**: Mobile-first responsive components

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

### API Design Patterns

```typescript
// Next.js API Route pattern
export async function GET() {
  try {
    // Add artificial delays for DevTools demo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 });
  }
}
```

### DevTools Integration Features

When adding new features, always consider:

1. **Network Tab Demo**: Add realistic delays and multiple requests
2. **Console Logging**: Include meaningful logs with different levels
3. **Performance Marks**: Add custom performance measurements
4. **Memory Management**: Consider memory usage for profiling demos
5. **Error Simulation**: Include error states for debugging practice

### Styling Guidelines

- **Tailwind First**: Use Tailwind utility classes
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Consider dark mode support where appropriate
- **Animations**: Use CSS transitions for smooth interactions
- **Accessibility**: Maintain good color contrast and keyboard navigation

### State Management

- **useState**: For simple local state
- **useReducer**: For complex state logic
- **useOptimistic**: For optimistic UI updates
- **Server State**: Leverage Next.js SSR capabilities
- **Context**: Sparingly, only when prop drilling becomes problematic

## Chrome DevTools Focus Areas

### Network Tab Demonstrations
- Slow-loading resources (images, APIs)
- Request/response headers inspection
- Timing analysis and waterfall charts
- Caching behavior observation
- WebSocket connections (if applicable)

### Performance Tab Features
- Page load performance metrics
- React component rendering performance
- Memory leak detection
- CPU usage profiling
- Custom performance marks and measures

### Console Tab Integration
- Structured logging with different levels
- Interactive debugging commands
- Error tracking and stack traces
- Performance measurement logging
- Custom console methods

### Elements Tab Exploration
- Component state inspection with React DevTools
- CSS debugging and live editing
- DOM event listeners inspection
- Accessibility tree exploration
- Mobile device simulation

### Memory Tab Utilization
- Heap snapshot comparison
- Memory leak identification
- Garbage collection monitoring
- Object allocation tracking
- Performance impact analysis

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

### Performance Monitoring
```typescript
const start = performance.now();
// Operation
const end = performance.now();
console.log(`⚡ Operation took ${(end - start).toFixed(2)}ms`);
performance.mark('operation-completed');
```

### Network Activity Logging
```typescript
const response = await fetch('/api/endpoint');
console.log('🌐 Network request completed:', {
  url: response.url,
  status: response.status,
  headers: Object.fromEntries(response.headers.entries())
});
```

## Best Practices

1. **Demonstrate Real Scenarios**: Create realistic use cases that developers encounter
2. **Educational Value**: Each feature should teach something about DevTools
3. **Interactive Examples**: Provide buttons and triggers for hands-on learning
4. **Clear Documentation**: Comment code to explain DevTools relevance
5. **Performance Conscious**: Show both good and bad performance patterns
6. **Accessibility First**: Ensure all demos are accessible
7. **Mobile Responsive**: Test on various screen sizes

## DevTools Learning Objectives

When extending this project, ensure new features help users learn:

- How to monitor network requests and optimize loading times
- How to identify and fix performance bottlenecks  
- How to use the console for effective debugging
- How to inspect and modify DOM elements and CSS
- How to profile memory usage and detect leaks
- How to use breakpoints and step through code
- How to audit accessibility and SEO

## Maintenance Notes

- Keep dependencies updated to demonstrate latest DevTools features
- Regularly test DevTools demonstrations across Chrome versions
- Maintain cross-browser compatibility where possible
- Update examples to reflect current web development best practices
- Ensure educational content remains accurate and relevant

---

*This project is designed to be a comprehensive learning resource for Chrome DevTools. Every component, API, and interaction should provide educational value and demonstrate real-world debugging scenarios.*
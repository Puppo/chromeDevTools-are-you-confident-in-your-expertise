---
name: developer
description: This agent is responsible for assisting developers with coding tasks, debugging, and code reviews.

tools: ['execute', 'read', 'edit', 'search', 'web']
---

# Developer Agent Instructions

You are an expert developer agent. You must follow these instructions when working on the codebase.

# API Package Instructions

## Package Overview

The `@devtools-demo/api` package is a **shared TypeScript package** that provides type-safe API schemas and types used across the entire monorepo. It ensures consistent data structures between frontend and backend applications.

## Package Structure

```
packages/api/
├── src/
│   ├── index.ts        # Package exports
│   ├── common.ts       # Common schemas (NotFound, etc.)
│   └── todos.ts        # Todo-related Zod schemas and types
├── package.json        # Shared package dependencies
└── tsconfig.json       # TypeScript config for package
```

## Technology Stack

- **Zod**: Runtime type validation and schema definition
- **TypeScript**: Full type safety across the monorepo
- **tsup**: Build system for dual CommonJS/ESM output

## Key Responsibilities

1. **Type-Safe Schemas**: Define Zod schemas for all API data structures
2. **Type Exports**: Provide TypeScript types inferred from schemas
3. **Validation**: Enable runtime validation in both frontend and backend
4. **Single Source of Truth**: Ensure consistent API contracts across apps

## Development Guidelines

### Schema Definition Pattern

```typescript
import { z } from 'zod';

// Define schema with Zod
export const MyEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
});

// Export inferred type
export type MyEntity = z.infer<typeof MyEntitySchema>;

// Export array schema if needed
export const MyEntityArraySchema = z.array(MyEntitySchema);
export type MyEntityArray = z.infer<typeof MyEntityArraySchema>;
```

### Common Schemas Pattern

```typescript
// Common error responses
export const NotFoundSchema = z.object({
  statusCode: z.literal(404),
  error: z.string(),
  message: z.string(),
});

export type NotFound = z.infer<typeof NotFoundSchema>;
```

### Optional Fields
```typescript
export const UpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
});
```

### Nested Schemas

**Rule**: If a nested schema is used multiple times across different schemas, extract it into its own reusable schema definition.

```typescript
// Good: Reusable nested schema (used in multiple places)
export const ProfileSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const UserSchema = z.object({
  id: z.string(),
  profile: ProfileSchema,
});

export const AdminSchema = z.object({
  id: z.string(),
  profile: ProfileSchema,
  permissions: z.array(z.string()),
});

// Bad: Duplicated inline nested schema
export const UserSchema = z.object({
  id: z.string(),
  profile: z.object({
    name: z.string(),
    bio: z.string().optional(),
  }),
});

export const AdminSchema = z.object({
  id: z.string(),
  profile: z.object({
    name: z.string(),
    bio: z.string().optional(),
  }),
  permissions: z.array(z.string()),
});
```

```typescript
// Good: One-off nested schema (used only once)
export const UserSchema = z.object({
  id: z.string(),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});
```

### Code Style

1. **Strict Type Safety**: Always use strict TypeScript settings
2. **Schema First**: Define schemas before types
3. **Descriptive Names**: Use clear, domain-specific naming (e.g., `TodoSchema`, not `DataSchema`)
4. **Export Everything**: Export both schemas and types for maximum flexibility
5. **Validation Rules**: Add appropriate Zod validators (`.min()`, `.max()`, `.email()`, etc.)

### Validation Best Practices

```typescript
// Good: Comprehensive validation
export const TodoCreateSchema = z.object({
  text: z.string().min(1).max(500),
  completed: z.boolean().default(false),
});

// Bad: No validation constraints
export const TodoCreateSchema = z.object({
  text: z.string(),
  completed: z.boolean(),
});
```

### Build Configuration

- **Dual Output**: Build both CommonJS and ESM formats
- **Type Declarations**: Always generate `.d.ts` files
- **Clean Build**: Remove dist before building

## Usage in Other Packages

### Backend Usage
```typescript
import { TodoSchema, type Todo } from '@devtools-demo/api';

// Validate incoming data
const result = TodoSchema.safeParse(data);
```

### Frontend Usage
```typescript
import type { Todo, TodoArray } from '@devtools-demo/api';

// Use types for props and state
interface TodoListProps {
  todos: TodoArray;
}
```

# Backend Application Instructions

## Application Overview

The backend is a **high-performance REST API server** built with Fastify, serving as the data layer for the Chrome DevTools demo project. It provides endpoints for managing todos and demonstrates best practices for API development, logging, and database integration.

## Application Structure

```
apps/backend/
├── src/
│   ├── server.ts           # Main server entry point
│   ├── config/
│   │   ├── db.ts          # Database configuration
│   │   └── logger.ts      # Pino logger setup
│   ├── errors/            # Custom error classes
│   ├── routes/
│   │   ├── health.ts      # Health check endpoints
│   │   ├── index.ts       # Route aggregation
│   │   └── todos.ts       # Todo CRUD endpoints
│   └── services/
│       └── todos/
│           ├── todo-plugin.ts   # Fastify plugin
│           └── todo-service.ts  # Business logic
├── migrations/            # Database migrations
├── seeds/                # Database seed data
├── package.json
└── tsconfig.json
```

## Technology Stack

- **Fastify**: High-performance web framework
- **fastify-type-provider-zod**: Zod schema integration for automatic validation
- **TypeScript**: Type-safe JavaScript
- **Pino Logger**: Structured logging for debugging
- **PostgreSQL**: Database (via Docker)
- **@devtools-demo/api**: Shared type-safe schemas

## Development Guidelines
### Server Configuration

```typescript
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';

// Prefer explicit configuration with Zod type provider
const server = fastify({
  logger: pino(loggerConfig),
  requestIdLogLabel: 'requestId',
}).withTypeProvider<ZodTypeProvider>();

// Set Zod validator and serializer
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
```

### Route Handler Pattern

**Route Validation**: All route validation is performed using `fastify-type-provider-zod` plugin. Schemas are defined using the `schema` object in route configuration, with all Zod schemas imported from the `@devtools-demo/api` package. The plugin automatically validates requests and infers TypeScript types.

**Important Rules**:
1. **Never use `.parse()` manually** - let fastify-type-provider-zod handle validation automatically
2. **All schemas must be defined in `@devtools-demo/api` package** - including body, params, querystring, and response schemas
3. **Use the `schema` object** in route configuration to define validation schemas
4. **Types are automatically inferred** from the schemas by the type provider

```typescript
// Import Zod schemas from the shared API package
import { 
  TodoSchema, 
  TodoCreateSchema, 
  TodoParamsSchema,
  TodoArraySchema,
  type Todo 
} from '@devtools-demo/api';

// POST route with body schema validation
server.post(
  '/todos',
  {
    schema: {
      body: TodoCreateSchema,
      response: {
        201: TodoSchema,
      },
    },
  },
  async (request, reply) => {
    // request.body is automatically validated and typed as TodoCreate
    const result = await todoService.createTodo(request.body);
    
    request.log.info({ todoId: result.id }, '✅ Todo created successfully');
    return reply.code(201).send(result);
  }
);
```

```typescript
// GET route with path parameters and response schema
server.get(
  '/todos/:id',
  {
    schema: {
      params: TodoParamsSchema,
      response: {
        200: TodoSchema,
        404: NotFoundSchema,
      },
    },
  },
  async (request, reply) => {
    // request.params is automatically validated and typed
    const { id } = request.params;
    
    const todo = await todoService.getTodo(id);
    
    if (!todo) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Todo not found',
      });
    }
    
    request.log.info({ todoId: id }, '✅ Todo retrieved');
    return reply.code(200).send(todo);
  }
);
```

```typescript
// GET route with querystring schema
import { TodoQuerySchema } from '@devtools-demo/api';

server.get(
  '/todos',
  {
    schema: {
      querystring: TodoQuerySchema,
      response: {
        200: TodoArraySchema,
      },
    },
  },
  async (request, reply) => {
    // request.query is automatically validated and typed
    const todos = await todoService.getTodos(request.query);
    
    request.log.info({ count: todos.length }, '✅ Todos retrieved');
    return reply.code(200).send(todos);
  }
);
```

```typescript
// PUT route with both params and body schemas
import { TodoUpdateSchema } from '@devtools-demo/api';

server.put(
  '/todos/:id',
  {
    schema: {
      params: TodoParamsSchema,
      body: TodoUpdateSchema,
      response: {
        200: TodoSchema,
        404: NotFoundSchema,
      },
    },
  },
  async (request, reply) => {
    // Both request.params and request.body are automatically validated and typed
    const { id } = request.params;
    const todo = await todoService.updateTodo(id, request.body);
    
    if (!todo) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Todo not found',
      });
    }
    
    request.log.info({ todoId: id }, '✅ Todo updated');
    return reply.code(200).send(todo);
  }
);
```

### Service Layer Pattern

```typescript
import type { TodoCreate, TodoUpdate, Todo } from '@devtools-demo/api';

// Separate business logic into services
export class TodoService {
  constructor(private db: Database) {}

  async getTodos(query?: TodoQuery): Promise<Todo[]> {
    // Business logic here - no validation needed, already validated by Fastify
    return this.db.query('SELECT * FROM todos');
  }

  async createTodo(data: TodoCreate): Promise<Todo> {
    // No validation needed - data is already validated by Fastify
    return this.db.query('INSERT INTO todos...', data);
  }

  async updateTodo(id: string, data: TodoUpdate): Promise<Todo | null> {
    // No validation needed - data is already validated by Fastify
    return this.db.query('UPDATE todos SET ... WHERE id = $1', [id, data]);
  }
}
  async createTodo(data: TodoCreate) {
  async updateTodo(id: string, data: TodoUpdate): Promise<Todo | null> {
    // No validation needed - data is already validated by Fastify
    return this.db.query('UPDATE todos SET ... WHERE id = $1', [id, data]);
  }
}
```

### Plugin Architecture

```typescript
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

// Use Fastify plugins for modularity and encapsulation
export const todoPlugin: FastifyPluginAsync = async (fastify) => {
  // Access typed fastify instance with ZodTypeProvider
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();
  
  // Initialize service with dependencies
  const service = new TodoService(fastify.db);
  
  // Decorate fastify instance with service
  typedFastify.decorate('todoService', service);
  
  // Register routes with the typed instance
  await typedFastify.register(todoRoutes);
};
```

**Plugin Best Practices**:
- Keep plugins focused on a single domain (e.g., todos, users, auth)
- Initialize services within the plugin scope
- Use `decorate` to make services available to routes
- Register all related routes together
- Type the plugin with `FastifyPluginAsync` for better type inference

## Code Style & Patterns

### 1. Error Handling

```typescript
// Good: Structured error handling with logging
try {
  const result = await operation();
  request.log.info({ result }, '✅ Operation successful');
  return reply.code(200).send(result);
} catch (error) {
  request.log.error({ error }, '❌ Operation failed');
  
  if (error instanceof ValidationError) {
    return reply.code(400).send({ error: error.message });
  }
  
  return reply.code(500).send({ error: 'Internal server error' });
}
```

### 2. Logging Best Practices

```typescript
// Good: Structured logging with context
request.log.info({ userId, action: 'create_todo' }, 'Creating todo');

// Bad: String-only logging
console.log('Creating todo');
```

### 3. Database Queries

**Always use `@nearform/sql` to build SQL queries** - this prevents SQL injection attacks and provides better type safety.

```typescript
import SQL from '@nearform/sql';

// Good: Using @nearform/sql query builder
const getTodoById = async (id: string) => {
  const query = SQL`
    SELECT * FROM todos
    WHERE id = ${id}
  `;
  return db.query(query);
};

// Good: Complex query with multiple parameters
const getTodosByStatus = async (completed: boolean, limit: number) => {
  const query = SQL`
    SELECT * FROM todos
    WHERE completed = ${completed}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return db.query(query);
};

// Good: INSERT query
const createTodo = async (data: TodoCreate) => {
  const query = SQL`
    INSERT INTO todos (text, completed)
    VALUES (${data.text}, ${data.completed})
    RETURNING *
  `;
  return db.query(query);
};

// Good: UPDATE query
const updateTodo = async (id: string, data: TodoUpdate) => {
  const query = SQL`
    UPDATE todos
    SET text = ${data.text}, completed = ${data.completed}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return db.query(query);
};

// Good: Dynamic query building with SQL.append
const searchTodos = async (filters: TodoFilters) => {
  const query = SQL`SELECT * FROM todos WHERE 1=1`;
  
  if (filters.completed !== undefined) {
    query.append(SQL` AND completed = ${filters.completed}`);
  }
  
  if (filters.searchText) {
    query.append(SQL` AND text ILIKE ${`%${filters.searchText}%`}`);
  }
  
  query.append(SQL` ORDER BY created_at DESC`);
  
  return db.query(query);
};

// Bad: Raw SQL string (SQL injection risk)
const result = await db.query(`SELECT * FROM todos WHERE id = ${id}`);

// Bad: String concatenation (SQL injection risk)
const result = await db.query(`SELECT * FROM todos WHERE id = '` + id + `'`);

// Bad: Template literal without @nearform/sql (SQL injection risk)
const result = await db.query(`SELECT * FROM todos WHERE text LIKE '%${searchTerm}%'`);
```

**@nearform/sql Best Practices**:
- Always use the `SQL` template tag for queries
- Parameters are automatically escaped and sanitized
- Use `SQL.append()` for dynamic query building
- The library returns an object with `text` (query string) and `values` (parameters array)
- Works seamlessly with PostgreSQL parameterized queries ($1, $2, etc.)

### 4. Schema Validation

```typescript
// NEVER validate manually with .parse() - use Fastify schema object instead
// All schemas must be imported from @devtools-demo/api

// Bad: Manual validation with .parse()
const validated = TodoCreateSchema.parse(request.body);

// Good: Automatic validation via schema object
server.post(
  '/todos',
  {
    schema: {
      body: TodoCreateSchema,
      response: { 201: TodoSchema },
    },
  },
  async (request, reply) => {
    // request.body is already validated and typed
    const todo = await todoService.createTodo(request.body);
    return reply.code(201).send(todo);
  }
);
```

**Schema Requirements for `@devtools-demo/api` package**:
- Export schemas for: `body`, `params`, `querystring`, `headers`, and `response`
- Use descriptive names (e.g., `TodoParamsSchema`, `TodoQuerySchema`, `TodoCreateSchema`)
- Always export both the schema and the inferred type

### 5. Response Formatting

```typescript
// Good: Consistent response structure
return reply.code(200).send({
  data: result,
  meta: { count: result.length },
});

// Good: Proper error responses
return reply.code(404).send({
  statusCode: 404,
  error: 'Not Found',
  message: 'Todo not found',
});
```

## Common Patterns

### Health Check Endpoint

```typescript
server.get('/health', async (request, reply) => {
  return reply.code(200).send({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});
```

### CRUD Operations

```typescript
import { 
  TodoSchema, 
  TodoArraySchema, 
  TodoCreateSchema, 
  TodoUpdateSchema,
  TodoParamsSchema,
  NotFoundSchema 
} from '@devtools-demo/api';

// GET all
server.get(
  '/todos',
  {
    schema: {
      response: {
        200: TodoArraySchema,
      },
    },
  },
  async (request, reply) => {
    const todos = await todoService.getTodos();
    return reply.code(200).send(todos);
  }
);

// GET by ID
server.get(
  '/todos/:id',
  {
    schema: {
      params: TodoParamsSchema,
      response: {
        200: TodoSchema,
        404: NotFoundSchema,
      },
    },
  },
  async (request, reply) => {
    const todo = await todoService.getTodo(request.params.id);
    if (!todo) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Todo not found',
      });
    }
    return reply.code(200).send(todo);
  }
);

// POST create
server.post(
  '/todos',
  {
    schema: {
      body: TodoCreateSchema,
      response: {
        201: TodoSchema,
      },
    },
  },
  async (request, reply) => {
    const todo = await todoService.createTodo(request.body);
    return reply.code(201).send(todo);
  }
);

// PUT/PATCH update
server.put(
  '/todos/:id',
  {
    schema: {
      params: TodoParamsSchema,
      body: TodoUpdateSchema,
      response: {
        200: TodoSchema,
        404: NotFoundSchema,
      },
    },
  },
  async (request, reply) => {
    const todo = await todoService.updateTodo(request.params.id, request.body);
    if (!todo) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Todo not found',
      });
    }
    return reply.code(200).send(todo);
  }
);

// DELETE
server.delete(
  '/todos/:id',
  {
    schema: {
      params: TodoParamsSchema,
      response: {
        204: z.null(),
        404: NotFoundSchema,
      },
    },
  },
  async (request, reply) => {
    const deleted = await todoService.deleteTodo(request.params.id);
    if (!deleted) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Todo not found',
      });
    }
    return reply.code(204).send();
  }
    return reply.code(204).send();
  }
);
```

## Environment Variables

```typescript
// Always use environment variables for configuration
const config = {
  port: process.env.PORT || 3001,
  host: process.env.HOST || '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL,
};
```

## Testing Considerations

- Use structured logging to aid debugging
- Implement proper error boundaries
- Validate all inputs with Zod schemas
- Return appropriate HTTP status codes
- Include request IDs for tracing

# Frontend Instructions

## Application Overview

The frontend is a **modern Next.js application** showcasing Chrome DevTools capabilities through interactive examples. It demonstrates SSR, client-side rendering, performance optimization, and real-world debugging scenarios.

## Application Structure

```
apps/frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Beautiful hero home page
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── globals.css        # Global styles
│   │   ├── todos/
│   │   │   └── page.tsx       # Todo list page (SSR demo)
│   │   └── [locale]/          # Internationalization routes
│   ├── components/
│   │   ├── Navigation.tsx     # Global navigation component
│   │   └── todos/
│   │       ├── Todos.tsx              # Client component
│   │       ├── TodosContainer.tsx     # Server component wrapper
│   │       └── TodoSkeleton.tsx       # Loading skeleton
│   ├── hooks/
│   │   └── todos/
│   │       ├── useCreateTodo.ts
│   │       ├── useDeleteTodo.ts
│   │       ├── useGetTodos.ts
│   │       └── useUpdateTodo.ts
│   ├── api/
│   │   └── todos/
│   │       └── index.ts       # API client functions
│   ├── providers/
│   │   ├── index.tsx          # Combined providers
│   │   └── react-query/       # React Query setup
│   ├── constants/
│   │   └── api.ts             # API configuration
│   └── i18n/                  # Internationalization
├── public/                    # Static assets
├── messages/                  # i18n message files
└── package.json
```

## Technology Stack

- **Next.js 15+**: React framework with App Router
- **React 19+**: Modern React with hooks and Suspense
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **React Query**: Server state management
- **@devtools-demo/api**: Shared type-safe schemas

## Development Guidelines

### Component Architecture

#### Server Components (Default)

We use **React Query with Suspense** for server-side data fetching. All data fetching should be done through custom hooks using `useSuspenseQuery`.

**Pattern: Custom Hook with useSuspenseQuery**

```typescript
// hooks/todos/useGetTodos.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { getTodos } from '@/api/todos';
import type { TodoArray } from '@devtools-demo/api';

export const useGetTodos = () => {
  return useSuspenseQuery<TodoArray>({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
};
```

**Usage in Client Component**

```typescript
// components/todos/TodosContainer.tsx
'use client';

import { useGetTodos } from '@/hooks/todos/useGetTodos';
import { Todos } from './Todos';

const TodosContainer = () => {
  const { data: todos } = useGetTodos();
  
  return <Todos todos={todos} />;
};

export default TodosContainer;
```

**Page Component with Suspense Boundary**

```typescript
// app/todos/page.tsx
import { Suspense } from 'react';
import { TodosContainer } from '@/components/todos/TodosContainer';
import { TodoSkeleton } from '@/components/todos/TodoSkeleton';

const TodosPage = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Todos</h1>
      <Suspense fallback={<TodoSkeleton />}>
        <TodosContainer />
      </Suspense>
    </main>
  );
};

export default TodosPage;
```

**Why This Pattern?**
- ✅ **Automatic Suspense Integration**: `useSuspenseQuery` throws promises during loading
- ✅ **Type Safety**: Full TypeScript support with typed responses
- ✅ **Consistent Pattern**: All queries follow the same hook-based approach
- ✅ **Cache Management**: Automatic caching and invalidation via React Query
- ✅ **SSR Compatible**: Works seamlessly with Next.js App Router and streaming

#### Client Components

```typescript
'use client';

import { useState } from 'react';
import type { Todo } from '@devtools-demo/api';

interface TodosProps {
  initialTodos: Todo[];
}

const Todos = ({ initialTodos }: TodosProps) => {
  const [todos, setTodos] = useState(initialTodos);
  
  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default Todos;
```

### Hooks Pattern

#### Query Keys Configuration

All query keys are centralized in `constants/api.ts` to ensure consistency and prevent typos:

```typescript
// constants/api.ts
type Key<TResult extends (string | number | boolean)[] = (string | number | boolean)[], TInput extends (string | number | boolean)[] = never> = TResult
  | ((...params: TInput) => TResult);

interface QueryKeys {
  [key: string]: {
    key: Key;
  } | {
    key: Key;
    nested: QueryKeys[];
  }
}

export const QUERY_KEYS = {
  TODOS: {
    key: ['todos'],
    nested: [{
      ID: {
        key: (id: string | number | boolean) => ['todos', id],
      }
    }]
  },
} satisfies QueryKeys;
```

#### Query Hook Pattern (useSuspenseQuery)

Use `useSuspenseQuery` for data fetching that integrates with React Suspense:

```typescript
// hooks/todos/useGetTodos.ts
'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getTodos } from '@/api/todos';
import { QUERY_KEYS } from '@/constants/api';
import type { TodoArray } from '@devtools-demo/api';

export const useGetTodos = () => {
  return useSuspenseQuery<TodoArray>({
    queryKey: QUERY_KEYS.TODOS.key,
    queryFn: getTodos,
  });
};
```

**Key Points:**
- ✅ Always use `QUERY_KEYS` constant for consistency
- ✅ `useSuspenseQuery` throws promises during loading (no manual loading state needed)
- ✅ Requires wrapping component in `<Suspense>` boundary
- ✅ Type the return value with schemas from `@devtools-demo/api`

#### Mutation Hook Pattern (useMutation)

Use `useMutation` for data modification operations (POST, PUT, DELETE):

```typescript
// hooks/todos/useCreateTodo.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo } from '@/api/todos';
import { QUERY_KEYS } from '@/constants/api';
import type { TodoCreate } from '@devtools-demo/api';

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS.key });
      console.log('✅ Todo created successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to create todo:', error);
    },
  });
};
```

**Key Points:**
- ✅ Use `QUERY_KEYS` for cache invalidation
- ✅ Extract mutation logic to API client functions
- ✅ Handle success/error cases with callbacks
- ✅ Invalidate related queries to refresh data

### API Client Pattern

```typescript
import type { Todo, TodoCreate, TodoUpdate } from '@devtools-demo/api';
import { API_BASE_URL } from '@/constants/api';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE_URL}/todos`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  
  return response.json();
};

export const createTodo = async (data: TodoCreate): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  
  return response.json();
};
```

## Code Style & Patterns

### 1. Constant Definition Best Practice

**Important:** Always define constant objects, arrays, and static values **outside** the component function to avoid unnecessary re-creations on every render:

```typescript
// ❌ Bad: Object recreated on every render
const Component = () => {
  const config = { timeout: 5000, retries: 3 };
  const defaultValues = { name: '', email: '' };
  
  return <div>{/* ... */}</div>;
};

// ✅ Good: Constants defined outside component
const CONFIG = { timeout: 5000, retries: 3 };
const DEFAULT_VALUES = { name: '', email: '' };

const Component = () => {
  return <div>{/* ... */}</div>;
};
```

### 2. TypeScript Types

```typescript
// Always import types from @devtools-demo/api
import type { Todo, TodoArray } from '@devtools-demo/api';

// Define component props
interface TodoListProps {
  todos: TodoArray;
  onTodoClick?: (todo: Todo) => void;
}

// Use explicit return types for functions
const processTodos = (todos: TodoArray): TodoArray => {
  return todos.filter(todo => !todo.completed);
};
```

### 3. Functional Components

```typescript
// Good: Functional component with typed props
interface ComponentProps {
  title: string;
  count?: number;
}

const Component = ({ title, count = 0 }: ComponentProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">Count: {count}</p>
    </div>
  );
};

export default Component;
```

### 4. Hooks and State Management

```typescript
'use client';

import { useState, useMemo, useCallback } from 'react';

const Component = () => {
  // State management
  const [items, setItems] = useState<Todo[]>([]);
  
  const completedCount = items.filter(item => item.completed).length;
  
  const handleToggle = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  return <div>{/* JSX */}</div>;
};
```

### 5. Tailwind CSS Styling

#### Component Styling Example

```typescript
// Good: Define constants outside component to prevent recreation on every render
const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
const variantClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
};

const Button = ({ variant = 'primary' }: { variant?: 'primary' | 'secondary' }) => {
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      Click me
    </button>
  );
};
```

### 5. Server-Side Rendering

```typescript
// Page component with SSR
const TodosPage = async () => {
  // Fetch data on server
  const todos = await getTodos();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Todos</h1>
      <TodosContainer initialTodos={todos} />
    </main>
  );
};

export default TodosPage;
```

### 6. Loading States

```typescript
import { Suspense } from 'react';
import { TodoSkeleton } from '@/components/todos/TodoSkeleton';

const Page = () => {
  return (
    <Suspense fallback={<TodoSkeleton />}>
      <TodosContainer />
    </Suspense>
  );
};
```

## Common Patterns

### React Query Setup

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

### Navigation Component

```typescript
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <ul className="flex gap-6">
          <li>
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/todos" className="hover:text-blue-400 transition-colors">
              Todos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
```

## Accessibility Guidelines

1. **Semantic HTML**: Use proper HTML elements (`<button>`, `<nav>`, `<main>`)
2. **ARIA Labels**: Add aria-labels for icon-only buttons
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus Management**: Visible focus indicators with Tailwind's `focus:` utilities
5. **Alt Text**: Always provide alt text for images

## Performance Best Practices

1. **Server Components**: Use server components by default, only add `'use client'` when needed
2. **Code Splitting**: Dynamic imports for heavy components
3. **Image Optimization**: Use Next.js `<Image>` component
4. **Memoization**: We are using react compiler to optimize re-renders with automatic memoization so manual memoization is not needed
5. **React Query**: Leverage caching and background refetching

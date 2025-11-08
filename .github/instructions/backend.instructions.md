---
description: "Backend application instructions"
applyTo: "apps/backend/**"
---

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

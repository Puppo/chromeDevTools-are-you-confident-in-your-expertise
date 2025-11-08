---
description: "API package instructions"
applyTo: "packages/api/**"
---

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

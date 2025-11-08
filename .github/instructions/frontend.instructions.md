---
description: "Frontend application instructions"
applyTo: "apps/frontend/**"
---

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

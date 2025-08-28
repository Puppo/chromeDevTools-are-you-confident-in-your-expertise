'use client'

import { useGetTodos } from "@/hooks/todos/useGetTodos";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TodosContainer } from "./TodosContainer";
import TodoSkeleton from "./TodoSkeleton";

export const Todos = () => {
  const { todos } = useGetTodos()

  return <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary, error }) => (<div>
        There is an error: {error?.message}
        <button onClick={() => resetErrorBoundary()}>Try again</button>
        </div>)}>
        <Suspense fallback={<TodoSkeleton />}>
          <TodosContainer todos={todos} />
        </Suspense>
      </ErrorBoundary>
    )}    
  </QueryErrorResetBoundary>
}
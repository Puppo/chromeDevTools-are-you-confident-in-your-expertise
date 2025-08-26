'use client'

import { getTodos } from "@/api/todos"
import { QUERY_KEYS } from "@/constants/api"
import { useQuery } from "@tanstack/react-query"
import TodoContainer from "./TodoContainer"


export const Todos = () => {
  const { data: todos } = useQuery({
    queryKey: [QUERY_KEYS.TODOS],
    queryFn: getTodos
  })

  return (
    // <Suspense fallback={<TodoSkeleton />}>
      
    // </Suspense>
    <TodoContainer todos={todos ?? []} />
  )
}
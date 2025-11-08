import { getTodos } from "@/api/todos";
import { QUERY_KEYS } from "@/constants/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetTodos = () => {
  const { data: todos } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.TODOS.key],
    queryFn: getTodos,
  });

  return { todos };
}
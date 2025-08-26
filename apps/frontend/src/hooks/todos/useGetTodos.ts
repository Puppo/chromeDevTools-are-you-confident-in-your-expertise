import { getTodos } from "@/api/todos";
import { QUERY_KEYS } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

export const useGetTodos = () => {
  const { data: todos } = useQuery({
    queryKey: [QUERY_KEYS.TODOS],
    queryFn: getTodos
  });

  return { todos };
}
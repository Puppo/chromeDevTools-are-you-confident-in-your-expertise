import { createTodo } from "@/api/todos";
import { QUERY_KEYS } from "@/constants/api";
import { getQueryClient } from "@/providers/react-query/get-query-client";
import { CreateTodo, Todo } from "@devtools-demo/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateTodo = () => {
  const queryClient = getQueryClient();

  const mutation = useMutation<Todo, unknown, Omit<CreateTodo, 'completed'>>({
    mutationFn: ({ text }) => createTodo(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS });
    },
  });

  return mutation;
};
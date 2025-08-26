import { deleteTodo } from "@/api/todos";
import { QUERY_KEYS } from "@/constants/api";
import { getQueryClient } from "@/providers/react-query/get-query-client";
import { Todo, TodoParams } from "@devtools-demo/api";
import { useMutation } from "@tanstack/react-query";

export const useDeleteTodo = () => {
  const queryClient = getQueryClient();

  const mutation = useMutation<Todo, unknown, TodoParams>({
    mutationFn: ({ id }) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS });
    },
  });

  return mutation;
};
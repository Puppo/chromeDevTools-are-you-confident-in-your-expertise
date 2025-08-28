import { patchTodo } from "@/api/todos";
import { QUERY_KEYS } from "@/constants/api";
import { getQueryClient } from "@/providers/react-query/get-query-client";
import { Todo, TodoParams } from "@devtools-demo/api";
import { useMutation } from "@tanstack/react-query";

export const useUpdateTodo = () => {
  const queryClient = getQueryClient();

  const mutation = useMutation<Todo, unknown, TodoParams & Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>>({
    mutationFn: ({ id, ...data }) => patchTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS });
    },
  });

  return mutation;
};
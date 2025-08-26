import { z } from 'zod/v4';

export const TodoSchema = z.object({
  id: z.uuid(),
  text: z.string().min(1, 'Todo text is required').max(500, 'Todo text too long'),
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TodosSchema = z.array(TodoSchema);

export const CreateTodoSchema = z.object({
  text: z.string().min(1, 'Todo text is required').max(500, 'Todo text too long'),
  completed: z.boolean().default(false),
});

export const UpdateTodoSchema = z.object({
  id: z.uuid(),
  text: z.string().min(1, 'Todo text is required').max(500, 'Todo text too long').optional(),
  completed: z.boolean().optional(),
});

export const TodoParamsSchema = z.object({
  id: z.uuid(),
});

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodo = z.infer<typeof CreateTodoSchema>;
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;
export type TodoParams = z.infer<typeof TodoParamsSchema>;
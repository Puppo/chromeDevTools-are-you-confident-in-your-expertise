import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { randomUUID } from 'node:crypto';
import z from "zod/v4";

const TodoIdParams = z.object({
  id: z.string(),
});

const TodoInsert = z.object({
  text: z.string().min(1),
  completed: z.boolean().optional(),
});

const TodoSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  createdAt: z.date(),
});

type Todo = z.infer<typeof TodoSchema>;

const TodosSchema = z.array(TodoSchema);

const todos: Todo[] = [
  { id: randomUUID(), text: 'Open Chrome DevTools (F12)', completed: false, createdAt: new Date() },
  { id: randomUUID(), text: 'Go to Network tab', completed: false, createdAt: new Date() },
  { id: randomUUID(), text: 'Monitor API requests in real-time', completed: false, createdAt: new Date() },
  { id: randomUUID(), text: 'Check Performance tab for metrics', completed: false, createdAt: new Date() },
  { id: randomUUID(), text: 'Use Console for debugging', completed: false, createdAt: new Date() },
];

export const  todoRoutes: FastifyPluginAsyncZod = async function (fastify) {
  fastify.get('/', {
      schema: {
        tags: ['todos'],
        summary: 'Get all todos',
        response: {
          200: TodosSchema,
        },
      },
    }, () => todos);

  fastify.post('/', {
      schema: {
        tags: ['todos'],
        summary: 'Create a new todo',
        body: TodoInsert,
        response: {
          201: TodoSchema,
        },
      },
    }, (request, reply) => {
      const { text } = request.body;
      const newTodo: Todo = {
        id: (todos.length + 1).toString(),
        text,
        completed: false,
        createdAt: new Date(),
      };
      todos.push(newTodo);
      reply.code(201).send(newTodo);
    });

  fastify.delete('/:id', {
      schema: {
        tags: ['todos'],
        summary: 'Delete a todo',
        params: TodoIdParams,
        response: {
          204: TodoSchema,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    }, (request, reply) => {
      const { id } = request.params;
      const index = todos.findIndex(t => t.id === id);
      const todo = todos[index];
      if (index === -1) {
        reply.code(404);
        return { message: `Todo with id ${id} not found` };
      }
      todos.splice(index, 1);
      reply.code(204);
      return todo;
    });
}
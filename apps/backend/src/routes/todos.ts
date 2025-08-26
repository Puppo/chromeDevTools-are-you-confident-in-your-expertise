import {
  CreateTodoSchema,
  NotFoundSchema,
  TodoParamsSchema,
  TodoSchema,
  TodosSchema,
  type Todo
} from "@devtools-demo/api";
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { randomUUID } from 'node:crypto';

const todos: Todo[] = [
  { id: randomUUID(), text: 'Open Chrome DevTools (F12)', completed: false, createdAt: new Date(), updatedAt: new Date() },
  { id: randomUUID(), text: 'Go to Network tab', completed: false, createdAt: new Date(), updatedAt: new Date() },
  { id: randomUUID(), text: 'Monitor API requests in real-time', completed: false, createdAt: new Date(), updatedAt: new Date() },
  { id: randomUUID(), text: 'Check Performance tab for metrics', completed: false, createdAt: new Date(), updatedAt: new Date() },
  { id: randomUUID(), text: 'Use Console for debugging', completed: false, createdAt: new Date(), updatedAt: new Date() },
];

export const  todoRoutes: FastifyPluginAsyncZod = async function (app) {
  const fastify = app.withTypeProvider<ZodTypeProvider>();
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
        body: CreateTodoSchema,
        response: {
          201: TodoSchema,
        },
      },
    }, (request, reply) => {
      const { text, completed } = request.body;
      const newTodo: Todo = {
        id: randomUUID(),
        text,
        completed,
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      todos.push(newTodo);
      reply.code(201);
      return newTodo;
    });

  fastify.delete('/:id', {
      schema: {
        tags: ['todos'],
        summary: 'Delete a todo',
        params: TodoParamsSchema,
        response: {
          204: TodoSchema,
          404: NotFoundSchema,
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
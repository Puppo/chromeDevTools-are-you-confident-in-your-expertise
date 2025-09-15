import {
  CreateTodoSchema,
  NotFoundSchema,
  TodoParamsSchema,
  TodoSchema,
  TodosSchema
} from "@devtools-demo/api";
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

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
    }, async () => {
      const result = await fastify.todoService.getTodos()
      return result;
    });

  fastify.post('/', {
      schema: {
        tags: ['todos'],
        summary: 'Create a new todo',
        body: CreateTodoSchema,
        response: {
          201: TodoSchema,
        },
      },
    }, async (request, reply) => {
      const { text, completed } = request.body;
      const newTodo = await fastify.todoService.createTodo({
        text,
        completed: completed,
      });
      reply.code(201);
      return newTodo;
    });

  fastify.patch('/:id', {
      schema: {
        tags: ['todos'],
        summary: 'Update a todo',
        params: TodoParamsSchema,
        body: TodoSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial(),
        response: {
          200: TodoSchema,
          404: NotFoundSchema,
        },
      },
    }, async (request, reply) => {
      const { id } = request.params;
      const updatedTodo = await fastify.todoService.updateTodo(id, request.body);
      if (!updatedTodo) {
        reply.code(404);
        return { message: `Todo with id ${id} not found` };
      }
      return updatedTodo;
    });
}
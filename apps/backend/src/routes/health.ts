import { FastifyInstance } from "fastify";
import z from "zod/v4";

const ResponseSchema = z.object({
  status: z.string(),
  timestamp: z.date(),
  uptime: z.number(),
});

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
      schema: {
        tags: ['health'],
        summary: 'Health check endpoint',
        response: {
          200: ResponseSchema,
        },
      },
    }, () => ({
        status: 'ok',
        timestamp: new Date(),
        uptime: process.uptime(),
      }));
}
import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health';
import { todoRoutes } from './todos';

export async function createRoutes(fastify: FastifyInstance) {
  fastify.register(healthRoutes, { prefix: '/health' });
  fastify.register(todoRoutes, { prefix: '/todos' });
}
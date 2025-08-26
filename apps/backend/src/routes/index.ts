import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health';
import { todoRoutes } from './todos';

export async function createRoutes(fastify: FastifyInstance) {
  // Register API routes with prefix
  fastify.register(healthRoutes, { prefix: '/health' });
  fastify.register(todoRoutes, { prefix: '/todos' });
}
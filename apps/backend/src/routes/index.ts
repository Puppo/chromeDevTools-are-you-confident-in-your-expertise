import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health';

export async function createRoutes(fastify: FastifyInstance) {
  // Register API routes with prefix
  fastify.register(healthRoutes, { prefix: '/health' });
}
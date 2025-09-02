import fp from 'fastify-plugin';
import { todoService } from './todo-service';

const todoPlugin = fp(async (fastify) => {
  const service = todoService(fastify.pg);
  fastify.decorate('todoService', service);
}, {
  name: 'todoService',
});

export default todoPlugin;

declare module 'fastify' {
  export interface FastifyInstance {
    todoService: ReturnType<typeof todoService>;
  }
}

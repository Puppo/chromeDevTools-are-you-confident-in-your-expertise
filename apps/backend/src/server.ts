import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { loggerConfig } from './config/logger';
import { createRoutes } from './routes';

const fastify = Fastify({
  logger: loggerConfig,
});

const isProduction = process.env['NODE_ENV'] === 'production';
const port = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3001;
const host = process.env['HOST'] || '0.0.0.0';
const frontendUrl = process.env['FRONTEND_URL'] || 'http://localhost:3000';

async function start() {
  try {
    // Register security plugins
    await fastify.register(helmet);
    await fastify.register(cors, {
      origin: isProduction ? false : [frontendUrl],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    });

    // Add schema validator and serializer
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);

    // Register Swagger documentation
    await fastify.register(swagger, {
      swagger: {
        info: {
          title: 'Chrome DevTools Showcase API',
          description: 'API demonstrating Chrome DevTools capabilities',
          version: '1.0.0',
        },
        host: `${host}:${port}`,
      },
      transform: jsonSchemaTransform,
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
    });

    await fastify.register(createRoutes, {
      prefix: '/api',
    });

    await fastify.listen({ port, host });
    
    fastify.log.info(`🚀 Server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    try {
      await fastify.close();
      fastify.log.info('Server closed');
      process.exit(0);
    } catch (err) {
      fastify.log.error(err, 'Error during shutdown');
      process.exit(1);
    }
  });
});

start();
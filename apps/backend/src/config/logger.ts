import { FastifyLoggerOptions } from 'fastify';

export const loggerConfig: FastifyLoggerOptions = {
  level: process.env['LOG_LEVEL'] || 'info',
  ...(process.env['NODE_ENV'] !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
};
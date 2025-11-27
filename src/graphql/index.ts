import express, { Router } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import http from 'http';
import { readFile } from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Config } from '../libs/config';
import { AppContext, AuthContext } from '../libs/context';
import { initUsecases } from '../usecases';
import { initResolvers } from './resolvers';
import { errorFormatter } from './errors/error-formatter';
import { errorLoggingPlugin } from './errors/error-logging-plugin';
import { IAMGateway } from '../gateways/iam-gateway';
import { initRepositories } from '../repositories';

export const initGraphQL = async (
  httpServer: http.Server,
  config: Config,
  logger: any,
  iamGateway: IAMGateway,
  db: PrismaClient,
): Promise<Router> => {
  const router = Router();

  const typeDefs = await readFile(
    path.join(__dirname, '/schema.graphql'),
    'utf8',
  );

  const usecases = initUsecases();
  const repositories = initRepositories(db);

  const server = new ApolloServer<AppContext>({
    nodeEnv: config.graphql?.sandbox !== false ? 'development' : 'production',
    typeDefs,
    resolvers: initResolvers(usecases),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      errorLoggingPlugin(logger),
    ],
    formatError: errorFormatter,
  });

  await server.start();

  // Middlewares
  router.use(
    cors<cors.CorsRequest>({
      methods: ['GET', 'POST', 'OPTIONS'],
      origin: config.cors?.origin || '*',
    }),
    express.json(),
    expressMiddleware(server, {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      context: async ({ req, res }): Promise<AppContext> => {
        const { operationName } = req.body;
        let auth: AuthContext = {
          isAuthenticated: false,
        };
        let authHeader = req.headers.authorization;
        if (authHeader && operationName !== 'IntrospectionQuery') {
          authHeader = authHeader.replace(/^bearer /gim, '');
          try {
            auth = await iamGateway.getAuthAndValidateToken(authHeader);
          } catch (error) {
            // If token validation fails, keep unauthenticated state
            auth = {
              isAuthenticated: false,
            };
          }
        }

        return {
          config,
          logger,
          repositories,
          gateways: {
            iam: iamGateway,
          },
          auth,
        };
      },
    }),
  );

  return router;
};

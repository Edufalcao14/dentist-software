import bunyan from 'bunyan';
import express from 'express';
import http from 'http';
import { config } from './libs/config';
import { initIAMGateway } from './gateways/iam-gateway';
import { initGraphQL } from './graphql';

const main = async () => {
  const logger = bunyan.createLogger({ name: 'dentist-backend' });

  try {
    const iamGateway = initIAMGateway(config);

    // Create Express app
    const app = express();

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Init GraphQL API
    const graphqlRouter = await initGraphQL(
      httpServer,
      config,
      logger,
      iamGateway,
    );
    app.use('/graphql', graphqlRouter);

    // Start the server
    await new Promise<void>((resolve) =>
      httpServer.listen({ port: config.port }, () => {
        logger.info(`Server is running on port ${config.port}`);
        logger.info(`GraphQL endpoint available at http://localhost:${config.port}/graphql`);
        resolve();
      }),
    );
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
};

main();

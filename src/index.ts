import bunyan from 'bunyan';
import { config } from './libs/config';
import { AppContext } from './libs/context';
import { initIAMGateway } from './gateways/iam-gateway';
import { createRestApp } from './controller';

const main = async () => {
    const logger = bunyan.createLogger({ name: 'dentist-backend' });

    try {
        const iamGateway = initIAMGateway(config);

        const context: AppContext = {
            config,
            logger,
            repositories: {}, // TODO: Initialize repositories
            gateways: {
                iam: iamGateway,
            },
            auth: { isAuthenticated: false }, // Initial auth state (not used in server context usually, but required by type)
        };

        const app = createRestApp(context);

        app.listen(config.port, () => {
            logger.info(`Server listening on port ${config.port}`);
        });
    } catch (err) {
        logger.error(err, 'Failed to start server');
        process.exit(1);
    }
};

main();

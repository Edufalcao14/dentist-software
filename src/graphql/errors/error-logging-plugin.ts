import { ApolloServerPlugin } from '@apollo/server';
import Logger from 'bunyan';
import { AppContext } from '../../libs/context';
import { unwrapResolverError } from '@apollo/server/errors';
import { BusinessError } from '../../entities/errors/business-error';

export const errorLoggingPlugin = (
  logger: Logger,
): ApolloServerPlugin<AppContext> => {
  return {
    requestDidStart: async () => {
      return {
        didEncounterErrors: async (rc) => {
          // Log each GraphQL error.
          rc.errors.forEach((error) => {
            const unwrapError = unwrapResolverError(error);
            if (unwrapError instanceof BusinessError) {
              logger.error(
                {
                  error: unwrapError,
                },
                `${error.message}`,
              );
              return;
            }
            logger.error(error);
          });
        },
      };
    },
  };
};

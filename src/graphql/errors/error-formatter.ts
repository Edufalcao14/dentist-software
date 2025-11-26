import { unwrapResolverError } from '@apollo/server/errors';
import { BusinessError } from '../../entities/errors/business-error';
import { GraphQLFormattedError } from 'graphql';

export const errorFormatter = (
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError => {
  const unwrapError = unwrapResolverError(error);
  if (unwrapError instanceof BusinessError) {
    return {
      ...formattedError,
      extensions: {
        ...formattedError.extensions,
        details: unwrapError.details,
      },
    };
  }
  return formattedError;
};

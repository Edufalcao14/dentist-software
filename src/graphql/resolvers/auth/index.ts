import { Usecases } from '../../../usecases';
import { Resolvers } from '../../__generated__/resolvers-types';
import { initAuthQueryResolvers } from './auth-query';
import { initAuthMutationResolvers } from './auth-mutation';
import { initMeResolvers } from './me';
import { initAuthPayloadResolvers } from './auth-payload';
import { initAuthTokensResolvers } from './auth-tokens';

export const initAuthModuleResolvers = (usecases: Usecases): Resolvers => {
  return {
    Query: {
      ...initAuthQueryResolvers(usecases),
    },
    Mutation: {
      ...initAuthMutationResolvers(usecases),
    },
    Me: initMeResolvers(),
    AuthPayload: initAuthPayloadResolvers(),
    AuthTokens: initAuthTokensResolvers(),
  };
};

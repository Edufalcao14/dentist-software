import { Usecases } from '../../usecases';
import { Resolvers } from '../__generated__/resolvers-types';
import { initAuthModuleResolvers } from './auth';
import { initScalars } from './scalars';
import { initUserModuleResolvers } from './user';

export const initResolvers = (usecases: Usecases): Resolvers => {
  const {
    Query: userQueries,
    Mutation: userMutations,
    ...userResolvers
  } = initUserModuleResolvers(usecases);

  const {
    Query: authQueries,
    Mutation: authMutations,
    ...authResolvers
  } = initAuthModuleResolvers(usecases);

  return {
    ...initScalars(),
    Query: {
      ...userQueries,
      ...authQueries,
    },
    Mutation: {
      ...userMutations,
      ...authMutations,
    },
    ...userResolvers,
    ...authResolvers,
  };
};

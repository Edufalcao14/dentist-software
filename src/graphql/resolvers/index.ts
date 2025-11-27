import { initScalars } from './scalars';
import { initDentistModuleResolvers } from './dentist';
import { Resolvers } from '../__generated__/resolvers-types';
import { Usecases } from '../../usecases';

export const initResolvers = (usecases: Usecases): Resolvers => {
  const {
    Query: dentistQueries,
    Mutation: dentistMutations,
    ...dentistResolvers
  } = initDentistModuleResolvers(usecases);

  return {
    ...initScalars(),
    Query: {
      ...dentistQueries,
    },
    Mutation: {
      ...dentistMutations,
    },
    ...dentistResolvers,
  };
};

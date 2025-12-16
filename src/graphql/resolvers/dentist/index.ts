import { Usecases } from '../../../usecases';
import { Resolvers } from '../../__generated__/resolvers-types';
import { initDentistResolvers } from './dentist';
import { initDentistMutationResolvers } from './dentist-mutation';
import { initDentistQueryResolvers } from './dentist-query';

export const initDentistModuleResolvers = (usecases: Usecases): Resolvers => {
  return {
    Query: {
      ...initDentistQueryResolvers(usecases),
    },
    Mutation: {
      ...initDentistMutationResolvers(usecases),
    },
    Dentist: initDentistResolvers(),
  };
};

import { initScalars } from './scalars';
import { initDentistModuleResolvers } from './dentist';
import { initPatientModuleResolvers } from './patient';
import { initAuthModuleResolvers } from './auth';
import { initUserResolvers } from './user/user';
import { Resolvers } from '../__generated__/resolvers-types';
import { Usecases } from '../../usecases';

export const initResolvers = (usecases: Usecases): Resolvers => {
  const {
    Query: dentistQueries,
    Mutation: dentistMutations,
    ...dentistResolvers
  } = initDentistModuleResolvers(usecases);

  const {
    Query: patientQueries,
    Mutation: patientMutations,
    ...patientResolvers
  } = initPatientModuleResolvers(usecases);

  const {
    Query: authQueries,
    Mutation: authMutations,
    ...authResolvers
  } = initAuthModuleResolvers(usecases);

  return {
    ...initScalars(),
    Query: {
      ...dentistQueries,
      ...patientQueries,
      ...authQueries,
    },
    Mutation: {
      ...dentistMutations,
      ...patientMutations,
      ...authMutations,
    },
    User: initUserResolvers(),
    ...dentistResolvers,
    ...patientResolvers,
    ...authResolvers,
  };
};

import { Usecases } from '../../../usecases';
import { Resolvers } from '../../__generated__/resolvers-types';
import { initPatientResolvers } from './patient';
import { initPatientMutationResolvers } from './patient-mutation';
import { initPatientQueryResolvers } from './patient-query';

export const initPatientModuleResolvers = (usecases: Usecases): Resolvers => {
  return {
    Query: {
      ...initPatientQueryResolvers(usecases),
    },
    Mutation: {
      ...initPatientMutationResolvers(usecases),
    },
    Patient: initPatientResolvers(),
  };
};

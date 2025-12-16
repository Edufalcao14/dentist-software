import { Usecases } from '../../../usecases';
import { Resolvers } from '../../__generated__/resolvers-types';
import { initMedicalRecordResolver } from './medical-record';
import { initMedicalRecordRowResolver } from './medical-record-row';
import { initMedicalRecordQueryResolvers } from './medical-record-query';
import { initMedicalRecordMutationResolvers } from './medical-record-mutation';

export const initMedicalRecordResolvers = (usecases: Usecases): Resolvers => {
  return {
    MedicalRecord: initMedicalRecordResolver(),
    MedicalRecordRow: initMedicalRecordRowResolver(),
    Query: initMedicalRecordQueryResolvers(usecases),
    Mutation: initMedicalRecordMutationResolvers(usecases),
  };
};

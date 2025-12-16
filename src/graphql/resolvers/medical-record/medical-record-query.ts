import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  QueryGetMedicalRecordByIdArgs,
  QueryGetMedicalRecordByPatientIdArgs,
  QueryResolvers,
} from '../../__generated__/resolvers-types';
import { MedicalRecordEntity } from '../../../entities/medical-record/medical-record';

export const initMedicalRecordQueryResolvers = (
  usecases: Usecases,
): Pick<
  QueryResolvers,
  'getMedicalRecordById' | 'getMedicalRecordByPatientId'
> => {
  return {
    getMedicalRecordById: async (
      _,
      args: QueryGetMedicalRecordByIdArgs,
      context: AppContext,
    ): Promise<MedicalRecordEntity> => {
      return await usecases.medicalRecord.getById(context, args.id);
    },
    getMedicalRecordByPatientId: async (
      _,
      args: QueryGetMedicalRecordByPatientIdArgs,
      context: AppContext,
    ): Promise<MedicalRecordEntity> => {
      return await usecases.medicalRecord.getByPatientId(
        context,
        args.patientId,
      );
    },
  };
};

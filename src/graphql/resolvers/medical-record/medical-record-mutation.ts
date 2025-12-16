import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  MutationCreateMedicalRecordArgs,
  MutationUpdateMedicalRecordArgs,
  MutationDeleteMedicalRecordArgs,
  MutationDeleteMedicalRecordRowArgs,
  MutationResolvers,
} from '../../__generated__/resolvers-types';
import { MedicalRecordEntity } from '../../../entities/medical-record/medical-record';

export const initMedicalRecordMutationResolvers = (
  usecases: Usecases,
): Pick<
  MutationResolvers,
  | 'createMedicalRecord'
  | 'updateMedicalRecord'
  | 'deleteMedicalRecord'
  | 'deleteMedicalRecordRow'
> => {
  return {
    createMedicalRecord: async (
      _,
      args: MutationCreateMedicalRecordArgs,
      context: AppContext,
    ): Promise<MedicalRecordEntity> => {
      return await usecases.medicalRecord.create(context, {
        user_id: args.input.user_id,
        rows: args.input.rows.map((row) => ({
          question: row.question,
          answer: row.answer,
        })),
      });
    },
    updateMedicalRecord: async (
      _,
      args: MutationUpdateMedicalRecordArgs,
      context: AppContext,
    ): Promise<MedicalRecordEntity> => {
      return await usecases.medicalRecord.update(context, args.id, {
        rows: args.input.rows.map((row) => ({
          id: row.id ?? undefined,
          question: row.question,
          answer: row.answer,
        })),
      });
    },
    deleteMedicalRecord: async (
      _,
      args: MutationDeleteMedicalRecordArgs,
      context: AppContext,
    ): Promise<MedicalRecordEntity> => {
      return await usecases.medicalRecord.delete(context, args.id);
    },
    deleteMedicalRecordRow: async (
      _,
      args: MutationDeleteMedicalRecordRowArgs,
      context: AppContext,
    ): Promise<boolean> => {
      await usecases.medicalRecord.deleteRow(context, args.rowId);
      return true;
    },
  };
};

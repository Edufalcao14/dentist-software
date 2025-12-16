import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  MutationCreatePatientArgs,
  MutationUpdatePatientArgs,
  MutationDeletePatientArgs,
  MutationResolvers,
} from '../../__generated__/resolvers-types';
import { PatientEntity } from '../../../entities/patient/patient';

export const initPatientMutationResolvers = (
  usecases: Usecases,
): Pick<
  MutationResolvers,
  'createPatient' | 'updatePatient' | 'deletePatient'
> => {
  return {
    createPatient: async (
      _,
      args: MutationCreatePatientArgs,
      context: AppContext,
    ): Promise<PatientEntity> => {
      return await usecases.patient.create(context, {
        email: args.input.email ?? null,
        firstname: args.input.firstname ?? null,
        lastname: args.input.lastname ?? null,
        phone_number: args.input.phone_number ?? null,
        cpf: args.input.cpf ?? null,
        birthdate: args.input.birthdate,
        civil_state: args.input.civil_state ?? null,
      });
    },
    updatePatient: async (
      _,
      args: MutationUpdatePatientArgs,
      context: AppContext,
    ): Promise<PatientEntity> => {
      return await usecases.patient.update(context, args.id, {
        cpf: args.input.cpf ?? undefined,
        birthdate: args.input.birthdate ?? undefined,
        civil_state: args.input.civil_state ?? undefined,
      });
    },
    deletePatient: async (
      _,
      args: MutationDeletePatientArgs,
      context: AppContext,
    ): Promise<PatientEntity> => {
      return await usecases.patient.delete(context, args.id);
    },
  };
};

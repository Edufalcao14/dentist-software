import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  MutationCreatePatientArgs,
  MutationUpdatePatientArgs,
  MutationDeletePatientArgs,
  MutationResolvers,
  UserRole as GraphQLUserRole,
  Patient,
} from '../../__generated__/resolvers-types';
import { PatientEntity } from '../../../entities/patient/patient';

const mapPatientEntityToGraphQL = (entity: PatientEntity): Patient => {
  return {
    id: entity.id,
    user_id: entity.user_id ?? null,
    user: entity.user
      ? {
          ...entity.user,
          role:
            entity.user.role === 'dentist'
              ? GraphQLUserRole.Dentist
              : GraphQLUserRole.Patient,
        }
      : null,
    cpf: entity.cpf ?? null,
    birthdate: entity.birthdate,
    civil_state: entity.civil_state ?? null,
  };
};

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
    ): Promise<Patient> => {
      const entity = await usecases.patient.create(context, {
        email: args.input.email ?? null,
        firstname: args.input.firstname ?? null,
        lastname: args.input.lastname ?? null,
        phone_number: args.input.phone_number ?? null,
        cpf: args.input.cpf ?? null,
        birthdate: args.input.birthdate,
        civil_state: args.input.civil_state ?? null,
      });
      return mapPatientEntityToGraphQL(entity);
    },
    updatePatient: async (
      _,
      args: MutationUpdatePatientArgs,
      context: AppContext,
    ): Promise<Patient> => {
      const entity = await usecases.patient.update(context, args.id, {
        cpf: args.input.cpf ?? undefined,
        birthdate: args.input.birthdate ?? undefined,
        civil_state: args.input.civil_state ?? undefined,
      });
      return mapPatientEntityToGraphQL(entity);
    },
    deletePatient: async (
      _,
      args: MutationDeletePatientArgs,
      context: AppContext,
    ): Promise<Patient> => {
      const entity = await usecases.patient.delete(context, args.id);
      return mapPatientEntityToGraphQL(entity);
    },
  };
};

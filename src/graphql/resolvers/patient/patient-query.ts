import { PatientEntity } from '../../../entities/patient/patient';
import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  QueryGetPatientByIdArgs,
  QueryGetPatientByCpfArgs,
  QueryGetPatientByEmailArgs,
  QueryGetAllPatientsArgs,
  QueryResolvers,
  UserRole as GraphQLUserRole,
  Patient,
} from '../../__generated__/resolvers-types';

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

export const initPatientQueryResolvers = (
  usecases: Usecases,
): Pick<
  QueryResolvers,
  'getPatientById' | 'getPatientByCpf' | 'getPatientByEmail' | 'getAllPatients'
> => {
  return {
    getPatientById: async (
      _,
      args: QueryGetPatientByIdArgs,
      context: AppContext,
    ): Promise<Patient> => {
      const entity = await usecases.patient.getById(context, args.id);
      return mapPatientEntityToGraphQL(entity);
    },
    getPatientByCpf: async (
      _,
      args: QueryGetPatientByCpfArgs,
      context: AppContext,
    ): Promise<Patient> => {
      const entity = await usecases.patient.getByCpf(context, args.cpf);
      return mapPatientEntityToGraphQL(entity);
    },
    getPatientByEmail: async (
      _,
      args: QueryGetPatientByEmailArgs,
      context: AppContext,
    ): Promise<Patient> => {
      const entity = await usecases.patient.getByEmail(context, args.email);
      return mapPatientEntityToGraphQL(entity);
    },
    getAllPatients: async (
      _,
      args: QueryGetAllPatientsArgs,
      context: AppContext,
    ): Promise<Patient[]> => {
      const entities = await usecases.patient.getAll(context, {
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });
      return entities.map(mapPatientEntityToGraphQL);
    },
  };
};

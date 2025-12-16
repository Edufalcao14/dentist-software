import { PatientEntity } from '../../../entities/patient/patient';
import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  QueryGetPatientByIdArgs,
  QueryGetPatientByCpfArgs,
  QueryGetPatientByEmailArgs,
  QueryGetAllPatientsArgs,
  QueryResolvers,
} from '../../__generated__/resolvers-types';

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
    ): Promise<PatientEntity> => {
      return usecases.patient.getById(context, args.id);
    },
    getPatientByCpf: async (
      _,
      args: QueryGetPatientByCpfArgs,
      context: AppContext,
    ): Promise<PatientEntity> => {
      return usecases.patient.getByCpf(context, args.cpf);
    },
    getPatientByEmail: async (
      _,
      args: QueryGetPatientByEmailArgs,
      context: AppContext,
    ): Promise<PatientEntity> => {
      return usecases.patient.getByEmail(context, args.email);
    },
    getAllPatients: async (
      _,
      args: QueryGetAllPatientsArgs,
      context: AppContext,
    ): Promise<PatientEntity[]> => {
      return usecases.patient.getAll(context, {
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });
    },
  };
};

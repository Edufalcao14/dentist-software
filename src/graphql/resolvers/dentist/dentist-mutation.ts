import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  MutationCreateDentistArgs,
  MutationUpdateDentistArgs,
  MutationDeleteDentistArgs,
  MutationResolvers,
} from '../../__generated__/resolvers-types';
import { DentistEntity } from '../../../entities/dentist/dentist';

export const initDentistMutationResolvers = (
  usecases: Usecases,
): Pick<
  MutationResolvers,
  'createDentist' | 'updateDentist' | 'deleteDentist'
> => {
  return {
    createDentist: async (
      _,
      args: MutationCreateDentistArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return await usecases.dentist.create(context, {
        firstname: args.input.firstname,
        lastname: args.input.lastname,
        phone_number: args.input.phone_number,
        email: args.input.email,
        password: args.input.password,
        cro_number: args.input.cro_number,
        specialization: args.input.specialization ?? null,
        role: args.input.role ?? null,
        is_active: args.input.is_active,
        clinic_id: args.input.clinic_id ?? null,
      });
    },
    updateDentist: async (
      _,
      args: MutationUpdateDentistArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return await usecases.dentist.update(context, args.id, {
        firstname: args.input.firstname ?? undefined,
        lastname: args.input.lastname ?? undefined,
        phone_number: args.input.phone_number ?? undefined,
        email: args.input.email ?? undefined,
        cro_number: args.input.cro_number ?? undefined,
        ...(args.input.specialization !== undefined && {
          specialization: args.input.specialization,
        }),
        ...(args.input.role !== undefined && { role: args.input.role }),
        is_active: args.input.is_active ?? undefined,
        ...(args.input.clinic_id !== undefined && {
          clinic_id: args.input.clinic_id,
        }),
      });
    },
    deleteDentist: async (
      _,
      args: MutationDeleteDentistArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return await usecases.dentist.delete(context, args.id);
    },
  };
};

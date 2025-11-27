import { DentistEntity } from '../../../entities/dentist/dentist';
import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  QueryGetDentistByIdArgs,
  QueryGetDentistByEmailArgs,
  QueryResolvers,
} from '../../__generated__/resolvers-types';

export const initDentistQueryResolvers = (
  usecases: Usecases,
): Pick<QueryResolvers, 'getDentistById' | 'getDentistByEmail'> => {
  return {
    getDentistById: async (
      _,
      args: QueryGetDentistByIdArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return usecases.dentist.getById(context, args.id);
    },
    getDentistByEmail: async (
      _,
      args: QueryGetDentistByEmailArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return usecases.dentist.getByEmail(context, args.email);
    },
  };
};

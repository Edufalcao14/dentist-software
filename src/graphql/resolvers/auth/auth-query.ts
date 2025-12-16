import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import { QueryResolvers } from '../../__generated__/resolvers-types';

export const initAuthQueryResolvers = (
  usecases: Usecases,
): Pick<QueryResolvers, 'getMe'> => {
  return {
    getMe: async (_, __, context: AppContext) => {
      return usecases.auth.getMe(context);
    },
  };
};

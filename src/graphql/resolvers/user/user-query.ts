import { UserEntity } from '../../../entities/user/user';
import { Usecases } from '../../../usecases';
import { QueryResolvers } from '../../__generated__/resolvers-types';

export const initUserQueryResolvers = (
  usecases: Usecases,
): Pick<QueryResolvers, 'users' | 'user'> => {
  return {
    users: async (_, __, context): Promise<UserEntity[]> => {
      return usecases.user.getAll(context);
    },
    user: async (_, args, context): Promise<UserEntity> => {
      return usecases.user.getById(context, args.id);
    },
  };
};

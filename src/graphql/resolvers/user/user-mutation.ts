import { AppContext } from '../../../libs/context';
import { UserEntity } from '../../../entities/user/user';
import { Usecases } from '../../../usecases';
import {
  MutationCreateUserArgs,
  MutationResolvers,
} from '../../__generated__/resolvers-types';

export const initUserMutationResolvers = (
  usecases: Usecases,
): Pick<MutationResolvers, 'createUser'> => {
  return {
    createUser: async (
      _,
      args: MutationCreateUserArgs,
      context: AppContext,
    ): Promise<UserEntity> => {
      return usecases.user.create(context, {
        email: args.input.email,
        password: args.input.password,
        firstName: args.input.firstName,
        lastName: args.input.lastName,
      });
    },
  };
};

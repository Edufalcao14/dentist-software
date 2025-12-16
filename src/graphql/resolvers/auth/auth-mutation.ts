import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  MutationSignInArgs,
  MutationRefreshTokenArgs,
  MutationResolvers,
} from '../../__generated__/resolvers-types';
import { AuthPayload } from '../../../entities/user/auth-payload';
import { AuthTokensEntity } from '../../../entities/auth/auth-tokens';

export const initAuthMutationResolvers = (
  usecases: Usecases,
): Pick<MutationResolvers, 'signIn' | 'refreshToken'> => {
  return {
    signIn: async (
      _,
      args: MutationSignInArgs,
      context: AppContext,
    ): Promise<AuthPayload> => {
      return await usecases.auth.signIn(context, {
        email: args.input.email,
        password: args.input.password,
      });
    },
    refreshToken: async (
      _,
      args: MutationRefreshTokenArgs,
      context: AppContext,
    ): Promise<AuthTokensEntity> => {
      return await usecases.auth.refreshToken(context, {
        refreshToken: args.input.refreshToken,
      });
    },
  };
};

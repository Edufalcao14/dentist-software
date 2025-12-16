import { refreshToken } from './refresh-token.logic';
import { getMe } from './get-me.logic';
import { signIn } from './sign-in.logic';

export const initAuthUsecases = () => {
  return {
    signIn,
    refreshToken,
    getMe,
  };
};

export type AuthUsecases = ReturnType<typeof initAuthUsecases>;

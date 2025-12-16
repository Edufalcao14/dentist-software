import { AuthTokensResolvers } from '../../__generated__/resolvers-types';

export const initAuthTokensResolvers = (): AuthTokensResolvers => ({
  accessToken: (parent) => {
    return parent.accessToken;
  },
  refreshToken: (parent) => {
    return parent.refreshToken;
  },
  expiredAt: (parent) => {
    return parent.expiredAt;
  },
});

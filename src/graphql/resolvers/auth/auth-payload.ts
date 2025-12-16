import { AuthPayloadResolvers } from '../../__generated__/resolvers-types';

export const initAuthPayloadResolvers = (): AuthPayloadResolvers => ({
  accessToken: (parent) => {
    return parent.accessToken;
  },
  refreshToken: (parent) => {
    return parent.refreshToken;
  },
  user: (parent) => {
    return parent.user;
  },
});

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
  patient: (parent) => {
    return parent.patient ?? null;
  },
  dentist: (parent) => {
    return parent.dentist ?? null;
  },
});

import { MeResolvers } from '../../__generated__/resolvers-types';

export const initMeResolvers = (): MeResolvers => ({
  id: (parent) => {
    return parent.id;
  },
  displayName: (parent) => {
    return parent.displayName;
  },
  email: (parent) => {
    return parent.email;
  },
  externalId: (parent) => {
    return parent.externalId;
  },
  createdAt: (parent) => {
    return parent.createdAt;
  },
  updatedAt: (parent) => {
    return parent.updatedAt;
  },
  deletedAt: (parent) => {
    return parent.deletedAt;
  },
  teamId: (parent) => {
    return parent.teamId;
  },
  dentist: (parent) => {
    return parent.dentist ?? null;
  },
  patient: (parent) => {
    return parent.patient ?? null;
  },
});

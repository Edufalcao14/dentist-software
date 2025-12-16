import {
  UserResolvers,
  UserRole as GraphQLUserRole,
} from '../../__generated__/resolvers-types';

export const initUserResolvers = (): UserResolvers => ({
  id: (parent) => {
    return parent.id;
  },
  external_id: (parent) => {
    return parent.external_id ?? null;
  },
  email: (parent) => {
    return parent.email;
  },
  firstname: (parent) => {
    return parent.firstname;
  },
  lastname: (parent) => {
    return parent.lastname;
  },
  phone_number: (parent) => {
    return parent.phone_number;
  },
  role: (parent) => {
    return parent.role === 'dentist'
      ? GraphQLUserRole.Dentist
      : GraphQLUserRole.Patient;
  },
});

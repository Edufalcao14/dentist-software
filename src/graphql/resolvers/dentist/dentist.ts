import {
  DentistResolvers,
  UserRole as GraphQLUserRole,
} from '../../__generated__/resolvers-types';

export const initDentistResolvers = (): DentistResolvers => ({
  id: (parent) => {
    return parent.id;
  },
  user_id: (parent) => {
    return parent.user_id;
  },
  user: (parent) => {
    return {
      ...parent.user,
      role:
        parent.user.role === 'dentist'
          ? GraphQLUserRole.Dentist
          : GraphQLUserRole.Patient,
    };
  },
  cro_number: (parent) => {
    return parent.cro_number;
  },
  specialization: (parent) => {
    return parent.specialization;
  },
  role: (parent) => {
    return parent.role;
  },
  is_active: (parent) => {
    return parent.is_active;
  },
  clinic_id: (parent) => {
    return parent.clinic_id;
  },
});

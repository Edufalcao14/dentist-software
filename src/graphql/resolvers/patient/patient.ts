import { PatientResolvers } from '../../__generated__/resolvers-types';

export const initPatientResolvers = (): PatientResolvers => ({
  id: (parent) => {
    return parent.id;
  },
  user_id: (parent) => {
    return parent.user_id ?? null;
  },
  user: (parent) => {
    return parent.user ?? null;
  },
  cpf: (parent) => {
    return parent.cpf ?? null;
  },
  birthdate: (parent) => {
    return parent.birthdate;
  },
  civil_state: (parent) => {
    return parent.civil_state ?? null;
  },
});

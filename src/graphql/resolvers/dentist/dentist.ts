import { Usecases } from '../../../usecases';
import { DentistResolvers } from '../../__generated__/resolvers-types';
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initDentistResolvers = (usecases: Usecases): DentistResolvers => ({
  id: (parent) => {
    return parent.id;
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
  email: (parent) => {
    return parent.email;
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
  external_id: (parent) => {
    return parent.external_id;
  },
});

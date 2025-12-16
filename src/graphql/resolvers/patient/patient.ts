import { PatientResolvers } from '../../__generated__/resolvers-types';
import { AppContext } from '../../../libs/context';

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
  medicalRecord: async (parent, _, context: AppContext) => {
    try {
      const medicalRecord =
        await context.repositories.medicalRecord.getByPatientId(
          parseInt(parent.id, 10),
        );
      return medicalRecord ?? null;
    } catch (error) {
      // If medical record doesn't exist, return null
      return null;
    }
  },
});

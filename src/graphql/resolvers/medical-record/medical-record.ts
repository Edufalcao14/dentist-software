import { MedicalRecordResolvers } from '../../__generated__/resolvers-types';

export const initMedicalRecordResolver = (): MedicalRecordResolvers => {
  return {
    id: (parent) => parent.id,
    patient_id: (parent) => parent.patient_id,
    rows: (parent) => parent.rows,
    created_at: (parent) => parent.created_at,
    updated_at: (parent) => parent.updated_at,
  };
};

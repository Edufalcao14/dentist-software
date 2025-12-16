import { MedicalRecordRowResolvers } from '../../__generated__/resolvers-types';

export const initMedicalRecordRowResolver = (): MedicalRecordRowResolvers => {
  return {
    id: (parent) => parent.id,
    question: (parent) => parent.question,
    answer: (parent) => parent.answer,
    medical_record_id: (parent) => parent.medical_record_id,
    created_at: (parent) => parent.created_at,
    updated_at: (parent) => parent.updated_at,
  };
};

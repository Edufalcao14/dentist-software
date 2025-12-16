export type CreateMedicalRecordRowInput = {
  question: string;
  answer: string;
};

export type CreateMedicalRecordInput = {
  patient_id: string;
  rows: CreateMedicalRecordRowInput[];
};

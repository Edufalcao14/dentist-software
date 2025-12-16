export type CreateMedicalRecordRowInput = {
  question: string;
  answer: string;
};

export type CreateMedicalRecordInput = {
  user_id: string;
  rows: CreateMedicalRecordRowInput[];
};

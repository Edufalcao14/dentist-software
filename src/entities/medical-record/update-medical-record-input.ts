export type UpdateMedicalRecordRowInput = {
  id?: string;
  question: string;
  answer: string;
};

export type UpdateMedicalRecordInput = {
  rows: UpdateMedicalRecordRowInput[];
};

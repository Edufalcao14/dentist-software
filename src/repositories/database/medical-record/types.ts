export type CreateMedicalRecordRowData = {
  question: string;
  answer: string;
};

export type CreateMedicalRecordData = {
  patient_id: number;
  rows: CreateMedicalRecordRowData[];
};

export type UpdateMedicalRecordRowData = {
  id?: number;
  question: string;
  answer: string;
};

export type UpdateMedicalRecordData = {
  rows: UpdateMedicalRecordRowData[];
};

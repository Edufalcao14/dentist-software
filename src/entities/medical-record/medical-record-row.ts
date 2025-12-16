export type MedicalRecordRowEntity = {
  id: string;
  question: string;
  answer: string;
  medical_record_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

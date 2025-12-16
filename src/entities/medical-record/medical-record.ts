import { MedicalRecordRowEntity } from './medical-record-row';

export type MedicalRecordEntity = {
  id: string;
  patient_id: string;
  rows: MedicalRecordRowEntity[];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

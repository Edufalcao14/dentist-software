import { MedicalRecord, MedicalRecordRow } from '@prisma/client';
import { MedicalRecordEntity } from '../../../../entities/medical-record/medical-record';
import { MedicalRecordRowEntity } from '../../../../entities/medical-record/medical-record-row';

type MedicalRecordWithRows = MedicalRecord & {
  rows: MedicalRecordRow[];
};

export const mapRowToEntity = (
  row: MedicalRecordRow,
): MedicalRecordRowEntity => {
  return {
    id: row.id.toString(),
    question: row.question,
    answer: row.answer,
    medical_record_id: row.medical_record_id.toString(),
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
};

export const mapToEntity = (
  medicalRecord: MedicalRecordWithRows,
): MedicalRecordEntity => {
  return {
    id: medicalRecord.id.toString(),
    patient_id: medicalRecord.patient_id.toString(),
    rows: medicalRecord.rows.map(mapRowToEntity),
    created_at: medicalRecord.created_at,
    updated_at: medicalRecord.updated_at,
    deleted_at: medicalRecord.deleted_at,
  };
};

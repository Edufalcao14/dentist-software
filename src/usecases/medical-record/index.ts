import { createMedicalRecord } from './create-medical-record.logic';
import { getMedicalRecordById } from './get-medical-record-by-id.logic';
import { getMedicalRecordByPatientId } from './get-medical-record-by-patient-id.logic';
import { updateMedicalRecord } from './update-medical-record.logic';
import { deleteMedicalRecord } from './delete-medical-record.logic';
import { deleteMedicalRecordRow } from './delete-medical-record-row.logic';

export const medicalRecordUsecases = {
  create: createMedicalRecord,
  getById: getMedicalRecordById,
  getByPatientId: getMedicalRecordByPatientId,
  update: updateMedicalRecord,
  delete: deleteMedicalRecord,
  deleteRow: deleteMedicalRecordRow,
};

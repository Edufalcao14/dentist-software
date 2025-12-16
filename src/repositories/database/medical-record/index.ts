import { PrismaClient } from '@prisma/client';
import { initCreateMedicalRecordRepository } from './create-medical-record';
import { initGetMedicalRecordByIdRepository } from './get-medical-record-by-id';
import { initGetMedicalRecordByPatientIdRepository } from './get-medical-record-by-patient-id';
import { initUpdateMedicalRecordRepository } from './update-medical-record';
import { initSoftDeleteMedicalRecordRepository } from './soft-delete-medical-record';
import { initDeleteMedicalRecordRowRepository } from './delete-medical-record-row';

export const initMedicalRecordRepository = (db: PrismaClient) => ({
  create: initCreateMedicalRecordRepository(db),
  getById: initGetMedicalRecordByIdRepository(db),
  getByPatientId: initGetMedicalRecordByPatientIdRepository(db),
  update: initUpdateMedicalRecordRepository(db),
  delete: initSoftDeleteMedicalRecordRepository(db),
  deleteRow: initDeleteMedicalRecordRowRepository(db),
});

export type MedicalRecordRepository = ReturnType<
  typeof initMedicalRecordRepository
>;

import { PrismaClient } from '@prisma/client';
import { initDentistRepositories } from './dentist';
import { initUserRepositories } from './user';
import { initPatientRepositories } from './patient';
import { initMedicalRecordRepository } from './medical-record';

export const initRepositories = (db: PrismaClient) => {
  return {
    dentist: initDentistRepositories(db),
    user: initUserRepositories(db),
    patient: initPatientRepositories(db),
    medicalRecord: initMedicalRecordRepository(db),
  };
};

export type Repositories = ReturnType<typeof initRepositories>;

import { PrismaClient } from '@prisma/client';
import { initCreatePatientRepository } from './create-patient';
import { initGetPatientByIdRepository } from './get-patient-by-id';
import { initGetPatientByCpfRepository } from './get-patient-by-cpf';
import { initGetPatientByEmailRepository } from './get-patient-by-email';
import { initGetPatientByUserIdRepository } from './get-patient-by-user-id';
import { initGetAllPatientsRepository } from './get-all-patients';
import { initUpdatePatientRepository } from './update-patient';
import { initSoftDeletePatientRepository } from './soft-delete-patient';

export type { CreatePatientData, UpdatePatientData } from './types';

export const initPatientRepositories = (db: PrismaClient) => {
  return {
    create: initCreatePatientRepository(db),
    getById: initGetPatientByIdRepository(db),
    getByCpf: initGetPatientByCpfRepository(db),
    getByEmail: initGetPatientByEmailRepository(db),
    getByUserId: initGetPatientByUserIdRepository(db),
    getAll: initGetAllPatientsRepository(db),
    update: initUpdatePatientRepository(db),
    softDelete: initSoftDeletePatientRepository(db),
  };
};

export type PatientRepositories = ReturnType<typeof initPatientRepositories>;

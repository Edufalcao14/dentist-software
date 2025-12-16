export { initRepositories } from './database';
export type { Repositories } from './database';
export type { CreateDentistData, UpdateDentistData } from './database/dentist';
export type { DentistRepositories } from './database/dentist';
export type { CreateUserData, UpdateUserData } from './database/user';
export type { UserRepositories } from './database/user';
export type { CreatePatientData, UpdatePatientData } from './database/patient';
export type { PatientRepositories } from './database/patient';
export type {
  CreateMedicalRecordData,
  UpdateMedicalRecordData,
} from './database/medical-record/types';
export type { MedicalRecordRepository } from './database/medical-record';

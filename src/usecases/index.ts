import { initDentistUsecases } from './dentist';
import { initPatientUsecases } from './patient';
import { initAuthUsecases } from './auth';
import { medicalRecordUsecases } from './medical-record';

export const initUsecases = () => {
  return {
    dentist: initDentistUsecases(),
    patient: initPatientUsecases(),
    auth: initAuthUsecases(),
    medicalRecord: medicalRecordUsecases,
  };
};

export type Usecases = ReturnType<typeof initUsecases>;

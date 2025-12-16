import { initDentistUsecases } from './dentist';
import { initPatientUsecases } from './patient';
import { initAuthUsecases } from './auth';

export const initUsecases = () => {
  return {
    dentist: initDentistUsecases(),
    patient: initPatientUsecases(),
    auth: initAuthUsecases(),
  };
};

export type Usecases = ReturnType<typeof initUsecases>;

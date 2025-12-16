import { initDentistUsecases } from './dentist';
import { initPatientUsecases } from './patient';

export const initUsecases = () => {
  return {
    dentist: initDentistUsecases(),
    patient: initPatientUsecases(),
  };
};

export type Usecases = ReturnType<typeof initUsecases>;

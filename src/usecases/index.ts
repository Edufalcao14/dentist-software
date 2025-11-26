import { initDentistUsecases } from './dentist';

export const initUsecases = () => {
  return {
    dentist: initDentistUsecases(),
  };
};

export type Usecases = ReturnType<typeof initUsecases>;

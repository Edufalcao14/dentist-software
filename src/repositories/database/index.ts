import { PrismaClient } from '@prisma/client';
import { initDentistRepositories } from './dentist';
import { initUserRepositories } from './user';
import { initPatientRepositories } from './patient';

export const initRepositories = (db: PrismaClient) => {
  return {
    dentist: initDentistRepositories(db),
    user: initUserRepositories(db),
    patient: initPatientRepositories(db),
  };
};

export type Repositories = ReturnType<typeof initRepositories>;

import { PrismaClient } from '@prisma/client';
import { initDentistRepositories } from './dentist';

export const initRepositories = (db: PrismaClient) => {
  return {
    dentist: initDentistRepositories(db),
  };
};

export type Repositories = ReturnType<typeof initRepositories>;

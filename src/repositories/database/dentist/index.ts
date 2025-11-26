import { PrismaClient } from '@prisma/client';
import { initCreateDentistRepository } from './create-dentist';
import { initGetDentistByIdRepository } from './get-dentist-by-id';
import { initGetDentistByEmailRepository } from './get-dentist-by-email';
import { initGetAllDentistsRepository } from './get-all-dentists';
import { initUpdateDentistRepository } from './update-dentist';
import { initSoftDeleteDentistRepository } from './soft-delete-dentist';

export type { CreateDentistData, UpdateDentistData } from './types';

export const initDentistRepositories = (db: PrismaClient) => {
  return {
    create: initCreateDentistRepository(db),
    getById: initGetDentistByIdRepository(db),
    getByEmail: initGetDentistByEmailRepository(db),
    getAll: initGetAllDentistsRepository(db),
    update: initUpdateDentistRepository(db),
    softDelete: initSoftDeleteDentistRepository(db),
  };
};

export type DentistRepositories = ReturnType<typeof initDentistRepositories>;


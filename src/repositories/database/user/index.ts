import { PrismaClient } from '@prisma/client';
import { initCreateUserRepository } from './create-user';
import { initGetUserByIdRepository } from './get-user-by-id';
import { initGetUserByEmailRepository } from './get-user-by-email';
import { initGetUserByExternalIdRepository } from './get-user-by-external-id';
import { initUpdateUserRepository } from './update-user';

export type { CreateUserData, UpdateUserData } from './types';

export const initUserRepositories = (db: PrismaClient) => {
  return {
    create: initCreateUserRepository(db),
    getById: initGetUserByIdRepository(db),
    getByEmail: initGetUserByEmailRepository(db),
    getByExternalId: initGetUserByExternalIdRepository(db),
    update: initUpdateUserRepository(db),
  };
};

export type UserRepositories = ReturnType<typeof initUserRepositories>;

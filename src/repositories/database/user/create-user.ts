import { PrismaClient } from '@prisma/client';
import { UserEntity } from '../../../entities/user/user';
import { mapToEntity } from './mapper/map-to-entity';
import { CreateUserData } from './types';

export const initCreateUserRepository = (db: PrismaClient) => {
  return async (data: CreateUserData): Promise<UserEntity> => {
    const user = await db.user.create({
      data: {
        external_id: data.external_id ?? null,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        phone_number: data.phone_number,
        role: data.role,
      },
    });

    return mapToEntity(user);
  };
};

import { PrismaClient } from '@prisma/client';
import { UserEntity } from '../../../entities/user/user';
import { UpdateUserData } from './types';
import { mapToEntity } from './mapper/map-to-entity';

export const initUpdateUserRepository = (db: PrismaClient) => {
  return async (id: number, data: UpdateUserData): Promise<UserEntity> => {
    const user = await db.user.update({
      where: {
        id,
      },
      data,
    });

    return mapToEntity(user);
  };
};

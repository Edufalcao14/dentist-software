import { PrismaClient } from '@prisma/client';
import { UserEntity } from '../../../entities/user/user';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetUserByIdRepository = (db: PrismaClient) => {
  return async (id: number): Promise<UserEntity | null> => {
    const user = await db.user.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!user) {
      return null;
    }

    return mapToEntity(user);
  };
};

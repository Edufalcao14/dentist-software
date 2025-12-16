import { PrismaClient } from '@prisma/client';
import { UserEntity } from '../../../entities/user/user';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetUserByEmailRepository = (db: PrismaClient) => {
  return async (email: string): Promise<UserEntity | null> => {
    const user = await db.user.findFirst({
      where: {
        email,
        deleted_at: null,
      },
    });

    if (!user) {
      return null;
    }

    return mapToEntity(user);
  };
};

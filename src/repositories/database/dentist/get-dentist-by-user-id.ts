import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetDentistByUserIdRepository = (db: PrismaClient) => {
  return async (userId: string): Promise<DentistEntity | null> => {
    const dentist = await db.dentist.findFirst({
      where: {
        user_id: parseInt(userId),
        deleted_at: null,
      },
      include: {
        user: true,
      },
    });

    if (!dentist) {
      return null;
    }

    return mapToEntity(dentist);
  };
};

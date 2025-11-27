import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetDentistByEmailRepository = (db: PrismaClient) => {
  return async (email: string): Promise<DentistEntity | null> => {
    const dentist = await db.dentist.findFirst({
      where: {
        email,
        deleted_at: null,
      },
    });

    if (!dentist) {
      return null;
    }

    return mapToEntity(dentist);
  };
};


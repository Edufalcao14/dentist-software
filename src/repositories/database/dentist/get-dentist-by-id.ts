import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetDentistByIdRepository = (db: PrismaClient) => {
  return async (id: number): Promise<DentistEntity | null> => {
    const dentist = await db.dentist.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!dentist) {
      return null;
    }

    return mapToEntity(dentist);
  };
};

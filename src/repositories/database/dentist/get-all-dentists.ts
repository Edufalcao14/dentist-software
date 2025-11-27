import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetAllDentistsRepository = (db: PrismaClient) => {
  return async (): Promise<DentistEntity[]> => {
    const dentists = await db.dentist.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return dentists.map((dentist) => mapToEntity(dentist));
  };
};

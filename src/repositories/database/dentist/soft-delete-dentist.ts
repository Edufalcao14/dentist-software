import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { mapToEntity } from './mapper/map-to-entity';

export const initSoftDeleteDentistRepository = (db: PrismaClient) => {
  return async (id: number): Promise<DentistEntity> => {
    const dentist = await db.dentist.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return mapToEntity(dentist);
  };
};


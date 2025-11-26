import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { UpdateDentistData } from './types';
import { mapToEntity } from './mapper/map-to-entity';

export const initUpdateDentistRepository = (db: PrismaClient) => {
  return async (
    id: number,
    data: UpdateDentistData,
  ): Promise<DentistEntity> => {
    const dentist = await db.dentist.update({
      where: {
        id,
      },
      data,
    });

    return mapToEntity(dentist);
  };
};


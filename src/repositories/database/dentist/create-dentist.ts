import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { CreateDentistData } from './types';
import { mapToEntity } from './mapper/map-to-entity';

export const initCreateDentistRepository = (db: PrismaClient) => {
  return async (data: CreateDentistData): Promise<DentistEntity> => {
    const dentist = await db.dentist.create({
      data,
    });

    return mapToEntity(dentist);
  };
};


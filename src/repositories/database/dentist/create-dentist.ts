import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { CreateDentistData } from './types';
import { mapToEntity } from './mapper/map-to-entity';
import { mapToPrismaCreateData } from './mapper/map-to-prisma-data';

export const initCreateDentistRepository = (db: PrismaClient) => {
  return async (data: CreateDentistData): Promise<DentistEntity> => {
    const prismaData = mapToPrismaCreateData(data);

    const dentist = await db.dentist.create({
      data: prismaData,
      include: {
        user: true,
      },
    });

    if (!dentist.user) {
      throw new Error('User not found for dentist');
    }

    return mapToEntity(dentist);
  };
};

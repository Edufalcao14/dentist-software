import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetDentistByExternalIdRepository = (db: PrismaClient) => {
  return async (externalId: string): Promise<DentistEntity | null> => {
    const dentist = await db.dentist.findFirst({
      where: {
        external_id: externalId,
        deleted_at: null,
      },
    });

    if (!dentist) {
      return null;
    }

    return mapToEntity(dentist);
  };
};

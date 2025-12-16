import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetDentistByExternalIdRepository = (db: PrismaClient) => {
  return async (externalId: string): Promise<DentistEntity | null> => {
    const user = await db.user.findFirst({
      where: {
        external_id: externalId,
        role: 'dentist',
        deleted_at: null,
      },
      include: {
        dentist: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!user || !user.dentist || user.dentist.deleted_at) {
      return null;
    }

    return mapToEntity(user.dentist);
  };
};

import { PrismaClient } from '@prisma/client';
import { MedicalRecordEntity } from '../../../entities/medical-record/medical-record';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetMedicalRecordByIdRepository = (db: PrismaClient) => {
  return async (id: number): Promise<MedicalRecordEntity | null> => {
    const medicalRecord = await db.medicalRecord.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        rows: {
          where: {
            deleted_at: null,
          },
        },
      },
    });

    if (!medicalRecord) {
      return null;
    }

    return mapToEntity(medicalRecord);
  };
};

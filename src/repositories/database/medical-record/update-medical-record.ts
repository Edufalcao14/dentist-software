import { PrismaClient } from '@prisma/client';
import { MedicalRecordEntity } from '../../../entities/medical-record/medical-record';
import { UpdateMedicalRecordData } from './types';
import { mapToEntity } from './mapper/map-to-entity';
import { mapToPrismaUpdateData } from './mapper/map-to-prisma-data';

export const initUpdateMedicalRecordRepository = (db: PrismaClient) => {
  return async (
    id: number,
    data: UpdateMedicalRecordData,
  ): Promise<MedicalRecordEntity> => {
    const prismaData = mapToPrismaUpdateData(data);

    const medicalRecord = await db.medicalRecord.update({
      where: { id },
      data: prismaData,
      include: {
        rows: {
          where: {
            deleted_at: null,
          },
        },
      },
    });

    return mapToEntity(medicalRecord);
  };
};

import { PrismaClient } from '@prisma/client';
import { MedicalRecordEntity } from '../../../entities/medical-record/medical-record';
import { CreateMedicalRecordData } from './types';
import { mapToEntity } from './mapper/map-to-entity';
import { mapToPrismaCreateData } from './mapper/map-to-prisma-data';

export const initCreateMedicalRecordRepository = (db: PrismaClient) => {
  return async (
    data: CreateMedicalRecordData,
  ): Promise<MedicalRecordEntity> => {
    const prismaData = mapToPrismaCreateData(data);

    const medicalRecord = await db.medicalRecord.create({
      data: prismaData,
      include: {
        rows: true,
      },
    });

    return mapToEntity(medicalRecord);
  };
};

import { PrismaClient } from '@prisma/client';
import { MedicalRecordEntity } from '../../../entities/medical-record/medical-record';
import { mapToEntity } from './mapper/map-to-entity';

export const initSoftDeleteMedicalRecordRepository = (db: PrismaClient) => {
  return async (id: number): Promise<MedicalRecordEntity> => {
    const now = new Date();

    // Soft delete all rows first
    await db.medicalRecordRow.updateMany({
      where: {
        medical_record_id: id,
        deleted_at: null,
      },
      data: {
        deleted_at: now,
      },
    });

    // Then soft delete the medical record
    const medicalRecord = await db.medicalRecord.update({
      where: { id },
      data: {
        deleted_at: now,
      },
      include: {
        rows: true,
      },
    });

    return mapToEntity(medicalRecord);
  };
};

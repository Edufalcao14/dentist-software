import { PrismaClient } from '@prisma/client';
import { MedicalRecordEntity } from '../../../entities/medical-record/medical-record';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetMedicalRecordByPatientIdRepository = (db: PrismaClient) => {
  return async (patientId: number): Promise<MedicalRecordEntity | null> => {
    const medicalRecord = await db.medicalRecord.findFirst({
      where: {
        patient_id: patientId,
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

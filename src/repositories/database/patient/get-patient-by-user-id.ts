import { PrismaClient } from '@prisma/client';
import { PatientEntity } from '../../../entities/patient/patient';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetPatientByUserIdRepository = (db: PrismaClient) => {
  return async (userId: string): Promise<PatientEntity | null> => {
    const patient = await db.patient.findFirst({
      where: {
        user_id: parseInt(userId),
        deleted_at: null,
      },
      include: {
        user: true,
        medical_record: {
          include: {
            rows: true,
          },
        },
      },
    });

    if (!patient) {
      return null;
    }

    return mapToEntity(patient);
  };
};

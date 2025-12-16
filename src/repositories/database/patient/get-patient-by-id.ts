import { PrismaClient } from '@prisma/client';
import { PatientEntity } from '../../../entities/patient/patient';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetPatientByIdRepository = (db: PrismaClient) => {
  return async (id: number): Promise<PatientEntity | null> => {
    const patient = await db.patient.findUnique({
      where: {
        id,
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

    if (!patient || patient.deleted_at) {
      return null;
    }

    return mapToEntity(patient);
  };
};

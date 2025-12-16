import { PrismaClient } from '@prisma/client';
import { PatientEntity } from '../../../entities/patient/patient';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetPatientByEmailRepository = (db: PrismaClient) => {
  return async (email: string): Promise<PatientEntity | null> => {
    const user = await db.user.findFirst({
      where: {
        email,
        role: 'patient',
        deleted_at: null,
      },
      include: {
        patient: {
          include: {
            user: true,
            medical_record: {
              include: {
                rows: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.patient || user.patient.deleted_at) {
      return null;
    }

    return mapToEntity(user.patient);
  };
};

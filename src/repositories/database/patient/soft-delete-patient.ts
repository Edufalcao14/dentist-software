import { PrismaClient } from '@prisma/client';
import { PatientEntity } from '../../../entities/patient/patient';
import { mapToEntity } from './mapper/map-to-entity';

export const initSoftDeletePatientRepository = (db: PrismaClient) => {
  return async (id: number): Promise<PatientEntity> => {
    const patient = await db.patient.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      include: {
        user: true,
      },
    });

    // Also soft delete the user if it exists
    if (patient.user_id) {
      await db.user.update({
        where: {
          id: patient.user_id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    }

    return mapToEntity(patient);
  };
};

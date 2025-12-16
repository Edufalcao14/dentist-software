import { PrismaClient } from '@prisma/client';
import { PatientEntity } from '../../../entities/patient/patient';
import { UpdatePatientData } from './types';
import { mapToEntity } from './mapper/map-to-entity';

export const initUpdatePatientRepository = (db: PrismaClient) => {
  return async (
    id: number,
    data: UpdatePatientData,
  ): Promise<PatientEntity> => {
    const patient = await db.patient.update({
      where: {
        id,
      },
      data,
      include: {
        user: true,
      },
    });

    return mapToEntity(patient);
  };
};

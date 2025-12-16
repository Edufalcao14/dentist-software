import { PrismaClient } from '@prisma/client';
import { PatientEntity } from '../../../entities/patient/patient';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetPatientByCpfRepository = (db: PrismaClient) => {
  return async (cpf: string): Promise<PatientEntity | null> => {
    const patient = await db.patient.findFirst({
      where: {
        cpf,
        deleted_at: null,
      },
      include: {
        user: true,
      },
    });

    if (!patient) {
      return null;
    }

    return mapToEntity(patient);
  };
};

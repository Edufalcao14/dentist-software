import { PrismaClient } from '@prisma/client';
import { PatientEntity } from '../../../entities/patient/patient';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetAllPatientsRepository = (db: PrismaClient) => {
  return async (filters?: {
    limit?: number;
    offset?: number;
  }): Promise<PatientEntity[]> => {
    const patients = await db.patient.findMany({
      where: {
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
      orderBy: {
        created_at: 'desc',
      },
      take: filters?.limit,
      skip: filters?.offset,
    });

    return patients.map((patient) => mapToEntity(patient));
  };
};

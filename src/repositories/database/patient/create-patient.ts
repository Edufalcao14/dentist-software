import { PrismaClient } from '@prisma/client';
import { PatientEntity } from '../../../entities/patient/patient';
import { CreatePatientData } from './types';
import { mapToEntity } from './mapper/map-to-entity';
import { mapToPrismaCreateData } from './mapper/map-to-prisma-data';

export const initCreatePatientRepository = (db: PrismaClient) => {
  return async (data: CreatePatientData): Promise<PatientEntity> => {
    const prismaData = mapToPrismaCreateData(data);

    const patient = await db.patient.create({
      data: prismaData,
      include: {
        user: true,
      },
    });

    return mapToEntity(patient);
  };
};

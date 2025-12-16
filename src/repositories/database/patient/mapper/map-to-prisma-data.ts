import { Prisma } from '@prisma/client';
import { CreatePatientData } from '../types';

export const mapToPrismaCreateData = (
  data: CreatePatientData,
): Prisma.PatientUncheckedCreateInput => {
  const prismaData: Prisma.PatientUncheckedCreateInput = {
    cpf: data.cpf,
    birthdate: data.birthdate,
    civil_state: data.civil_state ?? null,
  };

  if (data.user_id != null) {
    prismaData.user_id = data.user_id;
  }

  return prismaData;
};

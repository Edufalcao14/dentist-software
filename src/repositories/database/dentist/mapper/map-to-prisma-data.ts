import { Prisma } from '@prisma/client';
import { CreateDentistData } from '../types';
import { DentistRole } from '../../../../entities/dentist/dentist-role';
import { DentistSpecialization } from '../../../../entities/dentist/dentist-specialization';

export const mapToPrismaCreateData = (
  data: CreateDentistData,
): Prisma.DentistUncheckedCreateInput => {
  const prismaData: Prisma.DentistUncheckedCreateInput = {
    firstname: data.firstname,
    lastname: data.lastname,
    phone_number: data.phone_number,
    email: data.email,
    cro_number: data.cro_number,
    is_active: data.is_active ?? true,
    external_id: data.external_id ?? null,
    // Default values: role defaults to Owner, specialization defaults to generalist
    specialization:
      data.specialization && data.specialization !== ''
        ? data.specialization
        : DentistSpecialization.GENERALIST,
    role: data.role && data.role !== '' ? data.role : DentistRole.OWNER,
  };

  // Only include clinic_id if it's not null
  if (data.clinic_id != null) {
    prismaData.clinic_id = data.clinic_id;
  }

  return prismaData;
};

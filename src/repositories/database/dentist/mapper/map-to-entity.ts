import { Dentist } from '@prisma/client';
import { DentistEntity } from '../../../../entities/dentist/dentist';
import { DentistRole } from '../../../../entities/dentist/dentist-role';
import { DentistSpecialization } from '../../../../entities/dentist/dentist-specialization';

export const mapToEntity = (dentist: Dentist): DentistEntity => {
  return {
    id: dentist.id.toString(),
    firstname: dentist.firstname,
    lastname: dentist.lastname,
    phone_number: dentist.phone_number,
    email: dentist.email,
    cro_number: dentist.cro_number,
    specialization:
      (dentist.specialization as DentistSpecialization) ||
      DentistSpecialization.GENERALIST,
    role: (dentist.role as DentistRole) || DentistRole.ADMIN,
    is_active: dentist.is_active,
    clinic_id: dentist.clinic_id?.toString() ?? null,
    external_id: dentist.external_id ?? null,
  };
};

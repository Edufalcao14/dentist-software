import { Dentist } from '@prisma/client';
import { DentistEntity } from '../../../../entities/dentist/dentist';

export const mapToEntity = (dentist: Dentist): DentistEntity => {
  return {
    id: dentist.id.toString(),
    firstname: dentist.firstname,
    lastname: dentist.lastname,
    phone_number: dentist.phone_number,
    email: dentist.email,
    cro_number: dentist.cro_number,
    specialization: dentist.specialization,
    role: dentist.role,
    is_active: dentist.is_active,
    clinic_id: dentist.clinic_id?.toString() ?? null,
    external_id: dentist.external_id ?? null,
  };
};


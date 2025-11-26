import { DentistEntity } from '../../../entities/dentist/dentist';

export const mapToEntity = (dentist: {
  id: number;
  firstname: string;
  lastname: string;
  phone_number: string;
  email: string;
  cro_number: string;
  specialization: string;
  role: string;
  is_active: boolean;
  clinic_id: number | null;
  external_id: string | null;
}): DentistEntity => {
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


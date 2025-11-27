import { DentistRole } from './dentist-role';
import { DentistSpecialization } from './dentist-specialization';

export type DentistEntity = {
  id: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  email: string;
  cro_number: string;
  specialization: DentistSpecialization;
  role: DentistRole;
  is_active: boolean;
  clinic_id: string | null;
  external_id: string | null;
};

import { DentistRole } from './dentist-role';
import { DentistSpecialization } from './dentist-specialization';
import { UserEntity } from '../user/user';

export type DentistEntity = {
  id: string;
  user_id: string;
  user: UserEntity;
  cro_number: string;
  specialization: DentistSpecialization;
  role: DentistRole;
  is_active: boolean;
  clinic_id: string | null;
};

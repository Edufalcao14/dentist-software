import { UserEntity } from './user';
import { PatientEntity } from '../patient/patient';
import { DentistEntity } from '../dentist/dentist';

export type AuthPayload = {
  refreshToken: string;
  accessToken: string;
  user: UserEntity;
  patient?: PatientEntity | null;
  dentist?: DentistEntity | null;
};

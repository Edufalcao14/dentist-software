import { DentistEntity } from '../dentist/dentist';
import { PatientEntity } from '../patient/patient';

export type MeEntity = {
  id: string;
  displayName: string;
  email: string;
  externalId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  teamId: string | null;
  dentist?: DentistEntity;
  patient?: PatientEntity;
};

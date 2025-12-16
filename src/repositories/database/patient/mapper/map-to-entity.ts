import { Patient, User } from '@prisma/client';
import { PatientEntity } from '../../../../entities/patient/patient';
import { mapToEntity as mapUserToEntity } from '../../user/mapper/map-to-entity';

type PatientWithUser = Patient & {
  user: User | null;
};

export const mapToEntity = (patient: PatientWithUser): PatientEntity => {
  return {
    id: patient.id.toString(),
    user_id: patient.user_id?.toString() ?? null,
    user: patient.user ? mapUserToEntity(patient.user) : null,
    cpf: patient.cpf ?? null,
    birthdate: patient.birthdate,
    civil_state: patient.civil_state ?? null,
    created_at: patient.created_at,
    updated_at: patient.updated_at,
    deleted_at: patient.deleted_at ?? null,
  };
};

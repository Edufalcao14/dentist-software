import { Dentist, User } from '@prisma/client';
import { DentistEntity } from '../../../../entities/dentist/dentist';
import { DentistRole } from '../../../../entities/dentist/dentist-role';
import { DentistSpecialization } from '../../../../entities/dentist/dentist-specialization';
import { mapToEntity as mapUserToEntity } from '../../user/mapper/map-to-entity';

type DentistWithUser = Dentist & {
  user: User;
};

export const mapToEntity = (dentist: DentistWithUser): DentistEntity => {
  return {
    id: dentist.id.toString(),
    user_id: dentist.user_id.toString(),
    user: mapUserToEntity(dentist.user),
    cro_number: dentist.cro_number,
    specialization:
      (dentist.specialization as DentistSpecialization) ||
      DentistSpecialization.GENERALIST,
    role: (dentist.role as DentistRole) || DentistRole.ADMIN,
    is_active: dentist.is_active,
    clinic_id: dentist.clinic_id?.toString() ?? null,
  };
};

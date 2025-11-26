import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';
import { NotFoundError } from '../../entities/errors/not-found-error';

export const getDentistById = async (
  context: AppContext,
  id: string,
): Promise<DentistEntity> => {
  const dentist = await context.db.dentist.findUnique({
    where: {
      id: parseInt(id, 10),
      deleted_at: null,
    },
  });

  if (!dentist) {
    throw new NotFoundError('Dentist not found', { id });
  }

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
  };
};

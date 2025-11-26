import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';
import { NotFoundError } from '../../entities/errors/not-found-error';

export const deleteDentist = async (
  context: AppContext,
  id: string,
): Promise<DentistEntity> => {
  const existingDentist = await context.db.dentist.findUnique({
    where: {
      id: parseInt(id, 10),
      deleted_at: null,
    },
  });

  if (!existingDentist) {
    throw new NotFoundError('Dentist not found', { id });
  }

  const dentist = await context.db.dentist.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      deleted_at: new Date(),
    },
  });

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

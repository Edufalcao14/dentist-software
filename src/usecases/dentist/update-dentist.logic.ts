import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';
import { NotFoundError } from '../../entities/errors/not-found-error';

export type UpdateDentistInput = {
  firstname?: string;
  lastname?: string;
  phone_number?: string;
  email?: string;
  cro_number?: string;
  specialization?: string | null;
  role?: string | null;
  is_active?: boolean;
  clinic_id?: string | null;
};

export const updateDentist = async (
  context: AppContext,
  id: string,
  input: UpdateDentistInput,
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
      ...(input.firstname !== undefined && { firstname: input.firstname }),
      ...(input.lastname !== undefined && { lastname: input.lastname }),
      ...(input.phone_number !== undefined && {
        phone_number: input.phone_number,
      }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.cro_number !== undefined && { cro_number: input.cro_number }),
      ...(input.specialization !== undefined && {
        specialization: input.specialization ?? '',
      }),
      ...(input.role !== undefined && { role: input.role ?? 'Associate' }),
      ...(input.is_active !== undefined && { is_active: input.is_active }),
      ...(input.clinic_id !== undefined && {
        clinic_id: input.clinic_id
          ? parseInt(input.clinic_id, 10)
          : existingDentist.clinic_id,
      }),
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

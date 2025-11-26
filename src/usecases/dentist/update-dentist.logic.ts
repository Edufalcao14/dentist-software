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
  const existingDentist = await context.repositories.dentist.getById(
    parseInt(id, 10),
  );

  if (!existingDentist) {
    throw new NotFoundError('Dentist not found', { id });
  }

  // If email or name changes, update Firebase user
  if (existingDentist.external_id) {
    const firebaseUpdates: {
      email?: string;
      displayName?: string;
    } = {};

    if (input.email !== undefined && input.email !== existingDentist.email) {
      firebaseUpdates.email = input.email;
    }

    const newFirstname = input.firstname ?? existingDentist.firstname;
    const newLastname = input.lastname ?? existingDentist.lastname;
    const currentDisplayName = `${existingDentist.firstname} ${existingDentist.lastname}`;
    const newDisplayName = `${newFirstname} ${newLastname}`;

    if (newDisplayName !== currentDisplayName) {
      firebaseUpdates.displayName = newDisplayName;
    }

    if (Object.keys(firebaseUpdates).length > 0) {
      await context.gateways.iam.updateUser(
        existingDentist.external_id,
        firebaseUpdates,
      );
    }
  }

  const updateData: {
    firstname?: string;
    lastname?: string;
    phone_number?: string;
    email?: string;
    cro_number?: string;
    specialization?: string | null;
    role?: string | null;
    is_active?: boolean;
    clinic_id?: number | null;
  } = {
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
      clinic_id: input.clinic_id ? parseInt(input.clinic_id, 10) : null,
    }),
  };

  return await context.repositories.dentist.update(
    parseInt(id, 10),
    updateData,
  );
};

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

  // Update User if email, firstname, lastname, or phone_number change
  const userUpdates: {
    email?: string;
    firstname?: string;
    lastname?: string;
    phone_number?: string;
  } = {};

  if (input.email !== undefined && input.email !== existingDentist.user.email) {
    userUpdates.email = input.email;
  }

  if (
    input.firstname !== undefined &&
    input.firstname !== existingDentist.user.firstname
  ) {
    userUpdates.firstname = input.firstname;
  }

  if (
    input.lastname !== undefined &&
    input.lastname !== existingDentist.user.lastname
  ) {
    userUpdates.lastname = input.lastname;
  }

  if (
    input.phone_number !== undefined &&
    input.phone_number !== existingDentist.user.phone_number
  ) {
    userUpdates.phone_number = input.phone_number;
  }

  // If email or name changes, update Firebase user
  if (existingDentist.user.external_id && Object.keys(userUpdates).length > 0) {
    const firebaseUpdates: {
      email?: string;
      displayName?: string;
    } = {};

    if (userUpdates.email) {
      firebaseUpdates.email = userUpdates.email;
    }

    const newFirstname =
      userUpdates.firstname ?? existingDentist.user.firstname;
    const newLastname = userUpdates.lastname ?? existingDentist.user.lastname;
    const currentDisplayName = `${existingDentist.user.firstname} ${existingDentist.user.lastname}`;
    const newDisplayName = `${newFirstname} ${newLastname}`;

    if (newDisplayName !== currentDisplayName) {
      firebaseUpdates.displayName = newDisplayName;
    }

    if (Object.keys(firebaseUpdates).length > 0) {
      await context.gateways.iam.updateUser(
        existingDentist.user.external_id,
        firebaseUpdates,
      );
    }

    // Update User in database
    await context.repositories.user.update(
      parseInt(existingDentist.user_id, 10),
      userUpdates,
    );
  }

  // Update Dentist-specific fields
  const updateData: {
    cro_number?: string;
    specialization?: string | null;
    role?: string | null;
    is_active?: boolean;
    clinic_id?: number | null;
  } = {
    ...(input.cro_number !== undefined && { cro_number: input.cro_number }),
    ...(input.specialization !== undefined && {
      specialization: input.specialization,
    }),
    ...(input.role !== undefined && { role: input.role }),
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

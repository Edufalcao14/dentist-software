import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';
import { NotFoundError } from '../../entities/errors/not-found-error';

export const getDentistByEmail = async (
  context: AppContext,
  email: string,
): Promise<DentistEntity> => {
  const dentist = await context.repositories.dentist.getByEmail(email);

  if (!dentist) {
    throw new NotFoundError('Dentist not found', { email });
  }

  return dentist;
};

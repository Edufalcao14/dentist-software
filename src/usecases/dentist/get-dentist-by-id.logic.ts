import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';
import { NotFoundError } from '../../entities/errors/not-found-error';

export const getDentistById = async (
  context: AppContext,
  id: string,
): Promise<DentistEntity> => {
  const dentist = await context.repositories.dentist.getById(parseInt(id, 10));

  if (!dentist) {
    throw new NotFoundError('Dentist not found', { id });
  }

  return dentist;
};

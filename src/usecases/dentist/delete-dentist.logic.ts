import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';
import { NotFoundError } from '../../entities/errors/not-found-error';

export const deleteDentist = async (
  context: AppContext,
  id: string,
): Promise<DentistEntity> => {
  const existingDentist = await context.repositories.dentist.getById(
    parseInt(id, 10),
  );

  if (!existingDentist) {
    throw new NotFoundError('Dentist not found', { id });
  }

  return await context.repositories.dentist.softDelete(parseInt(id, 10));
};

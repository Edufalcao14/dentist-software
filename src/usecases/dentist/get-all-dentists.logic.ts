import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';

export const getAllDentists = async (
  context: AppContext,
): Promise<DentistEntity[]> => {
  return await context.repositories.dentist.getAll();
};

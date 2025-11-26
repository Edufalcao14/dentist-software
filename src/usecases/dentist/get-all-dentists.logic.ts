import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';

export const getAllDentists = async (
  context: AppContext,
): Promise<DentistEntity[]> => {
  const dentists = await context.db.dentist.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return dentists.map((dentist) => ({
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
  }));
};

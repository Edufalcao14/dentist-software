import { AppContext } from '../../libs/context';
import { PatientEntity } from '../../entities/patient/patient';
import { ensureDentistAccess } from './authorization';

export const getAllPatients = async (
  context: AppContext,
  filters?: {
    limit?: number;
    offset?: number;
  },
): Promise<PatientEntity[]> => {
  await ensureDentistAccess(context);

  return await context.repositories.patient.getAll(filters);
};

import { AppContext } from '../../libs/context';
import { PatientEntity } from '../../entities/patient/patient';
import { NotFoundError } from '../../entities/errors/not-found-error';
import { ensureDentistAccess } from './authorization';

export const getPatientById = async (
  context: AppContext,
  id: string,
): Promise<PatientEntity> => {
  await ensureDentistAccess(context);

  const patient = await context.repositories.patient.getById(parseInt(id, 10));

  if (!patient) {
    throw new NotFoundError('Patient not found', { id });
  }

  return patient;
};

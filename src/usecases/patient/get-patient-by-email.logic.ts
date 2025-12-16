import { AppContext } from '../../libs/context';
import { PatientEntity } from '../../entities/patient/patient';
import { NotFoundError } from '../../entities/errors/not-found-error';
import { ensureDentistAccess } from './authorization';

export const getPatientByEmail = async (
  context: AppContext,
  email: string,
): Promise<PatientEntity> => {
  await ensureDentistAccess(context);

  const patient = await context.repositories.patient.getByEmail(email);

  if (!patient) {
    throw new NotFoundError('Patient not found', { email });
  }

  return patient;
};

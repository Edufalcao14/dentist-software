import { AppContext } from '../../libs/context';
import { PatientEntity } from '../../entities/patient/patient';
import { NotFoundError } from '../../entities/errors/not-found-error';
import { ensureDentistAccess } from './authorization';

export const getPatientByCpf = async (
  context: AppContext,
  cpf: string,
): Promise<PatientEntity> => {
  await ensureDentistAccess(context);

  const patient = await context.repositories.patient.getByCpf(cpf);

  if (!patient) {
    throw new NotFoundError('Patient not found', { cpf });
  }

  return patient;
};

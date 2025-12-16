import { AppContext } from '../../libs/context';
import { PatientEntity } from '../../entities/patient/patient';
import { NotFoundError } from '../../entities/errors/not-found-error';
import { ensureDentistAccess } from './authorization';

export const deletePatient = async (
  context: AppContext,
  id: string,
): Promise<PatientEntity> => {
  await ensureDentistAccess(context);

  const existingPatient = await context.repositories.patient.getById(
    parseInt(id, 10),
  );

  if (!existingPatient) {
    throw new NotFoundError('Patient not found', { id });
  }

  return await context.repositories.patient.softDelete(parseInt(id, 10));
};

import { AppContext } from '../../libs/context';
import { MedicalRecordEntity } from '../../entities/medical-record/medical-record';
import { NotFoundError } from '../../entities/errors/not-found-error';
import { ensureDentistAccess } from '../patient/authorization';

export const getMedicalRecordById = async (
  context: AppContext,
  id: string,
): Promise<MedicalRecordEntity> => {
  await ensureDentistAccess(context);

  const medicalRecord = await context.repositories.medicalRecord.getById(
    parseInt(id, 10),
  );

  if (!medicalRecord) {
    throw new NotFoundError('Prontuário médico não encontrado');
  }

  return medicalRecord;
};

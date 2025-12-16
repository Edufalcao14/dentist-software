import { AppContext } from '../../libs/context';
import { ensureDentistAccess } from '../patient/authorization';

export const deleteMedicalRecordRow = async (
  context: AppContext,
  rowId: string,
): Promise<void> => {
  await ensureDentistAccess(context);

  await context.repositories.medicalRecord.deleteRow(parseInt(rowId, 10));
};

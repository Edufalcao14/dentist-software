import { AppContext } from '../../libs/context';
import { UpdateMedicalRecordInput } from '../../entities/medical-record/update-medical-record-input';
import { MedicalRecordEntity } from '../../entities/medical-record/medical-record';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import { NotFoundError } from '../../entities/errors/not-found-error';
import { ensureDentistAccess } from '../patient/authorization';
import * as yup from 'yup';

export const updateMedicalRecord = async (
  context: AppContext,
  id: string,
  input: UpdateMedicalRecordInput,
): Promise<MedicalRecordEntity> => {
  await ensureDentistAccess(context);
  validateInput(input);

  const existingRecord = await context.repositories.medicalRecord.getById(
    parseInt(id, 10),
  );
  if (!existingRecord) {
    throw new NotFoundError('Prontuário médico não encontrado');
  }

  const medicalRecordData = {
    rows: input.rows.map((row) => ({
      id: row.id ? parseInt(row.id, 10) : undefined,
      question: row.question,
      answer: row.answer,
    })),
  };

  return await context.repositories.medicalRecord.update(
    parseInt(id, 10),
    medicalRecordData,
  );
};

function validateInput(input: UpdateMedicalRecordInput) {
  const rowSchema = yup.object({
    id: yup.string().optional(),
    question: yup
      .string()
      .required('pergunta é obrigatória')
      .max(500, 'pergunta deve ter no máximo 500 caracteres'),
    answer: yup
      .string()
      .required('resposta é obrigatória')
      .max(1000, 'resposta deve ter no máximo 1000 caracteres'),
  });

  const schema = yup.object<UpdateMedicalRecordInput>({
    rows: yup
      .array()
      .of(rowSchema)
      .required('linhas são obrigatórias')
      .min(1, 'pelo menos uma linha é obrigatória'),
  });

  try {
    schema.validateSync(input, { abortEarly: false });
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      const errorMessage = (error as yup.ValidationError).errors.join(', ');
      throw new BadUserInputError(errorMessage);
    }
    throw error;
  }
}

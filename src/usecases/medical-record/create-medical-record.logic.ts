import { AppContext } from '../../libs/context';
import { CreateMedicalRecordInput } from '../../entities/medical-record/create-medical-record-input';
import { MedicalRecordEntity } from '../../entities/medical-record/medical-record';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import { ensureDentistAccess } from '../patient/authorization';
import * as yup from 'yup';

export const createMedicalRecord = async (
  context: AppContext,
  input: CreateMedicalRecordInput,
): Promise<MedicalRecordEntity> => {
  await ensureDentistAccess(context);
  validateInput(input);

  const medicalRecordData = {
    patient_id: parseInt(input.patient_id, 10),
    rows: input.rows.map((row) => ({
      question: row.question,
      answer: row.answer,
    })),
  };

  return await context.repositories.medicalRecord.create(medicalRecordData);
};

function validateInput(input: CreateMedicalRecordInput) {
  const rowSchema = yup.object({
    question: yup
      .string()
      .required('pergunta é obrigatória')
      .max(500, 'pergunta deve ter no máximo 500 caracteres'),
    answer: yup
      .string()
      .required('resposta é obrigatória')
      .max(1000, 'resposta deve ter no máximo 1000 caracteres'),
  });

  const schema = yup.object<CreateMedicalRecordInput>({
    patient_id: yup.string().required('ID do paciente é obrigatório'),
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

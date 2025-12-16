import { AppContext } from '../../libs/context';
import { PatientEntity } from '../../entities/patient/patient';
import { NotFoundError } from '../../entities/errors/not-found-error';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import { ensureDentistAccess } from './authorization';
import * as yup from 'yup';

export type UpdatePatientInput = {
  cpf?: string | null;
  birthdate?: Date;
  civil_state?: string | null;
};

export const updatePatient = async (
  context: AppContext,
  id: string,
  input: UpdatePatientInput,
): Promise<PatientEntity> => {
  await ensureDentistAccess(context);

  const existingPatient = await context.repositories.patient.getById(
    parseInt(id, 10),
  );

  if (!existingPatient) {
    throw new NotFoundError('Patient not found', { id });
  }

  validateInput(input);

  const updateData: {
    cpf?: string | null;
    birthdate?: Date;
    civil_state?: string | null;
  } = {
    ...(input.cpf !== undefined && { cpf: input.cpf }),
    ...(input.birthdate !== undefined && { birthdate: input.birthdate }),
    ...(input.civil_state !== undefined && { civil_state: input.civil_state }),
  };

  return await context.repositories.patient.update(
    parseInt(id, 10),
    updateData,
  );
};

function validateInput(input: UpdatePatientInput) {
  const schema = yup.object<UpdatePatientInput>({
    cpf: yup
      .string()
      .nullable()
      .optional()
      .max(14, 'CPF deve ter no máximo 14 caracteres'),
    birthdate: yup.date().optional(),
    civil_state: yup
      .string()
      .nullable()
      .optional()
      .max(50, 'estado civil deve ter no máximo 50 caracteres'),
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

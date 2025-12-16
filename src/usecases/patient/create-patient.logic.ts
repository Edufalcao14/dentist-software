import { AppContext } from '../../libs/context';
import { CreatePatientInput } from '../../entities/patient/create-patient-input';
import { PatientEntity } from '../../entities/patient/patient';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import { UserRole } from '../../entities/user/user-role';
import { ensureDentistAccess } from './authorization';
import * as yup from 'yup';

export const createPatient = async (
  context: AppContext,
  input: CreatePatientInput,
): Promise<PatientEntity> => {
  await ensureDentistAccess(context);
  validateInput(input);

  let userId: number | null = null;

  // Create User if email is provided
  if (input.email) {
    const user = await context.repositories.user.create({
      email: input.email,
      firstname: input.firstname ?? '',
      lastname: input.lastname ?? '',
      phone_number: input.phone_number ?? '',
      role: UserRole.PATIENT,
    });
    userId = parseInt(user.id, 10);
  }

  const patientData = {
    user_id: userId,
    cpf: input.cpf,
    birthdate: input.birthdate,
    civil_state: input.civil_state ?? null,
  };

  return await context.repositories.patient.create(patientData);
};

function validateInput(input: CreatePatientInput) {
  const schema = yup.object<CreatePatientInput>({
    email: yup
      .string()
      .nullable()
      .optional()
      .email('email deve ser um endereço de email válido')
      .max(255, 'email deve ter no máximo 255 caracteres'),
    firstname: yup
      .string()
      .nullable()
      .optional()
      .max(100, 'nome deve ter no máximo 100 caracteres'),
    lastname: yup
      .string()
      .nullable()
      .optional()
      .max(100, 'sobrenome deve ter no máximo 100 caracteres'),
    phone_number: yup
      .string()
      .nullable()
      .optional()
      .max(20, 'telefone deve ter no máximo 20 caracteres'),
    cpf: yup
      .string()
      .nullable()
      .required('CPF é obrigatório')
      .max(14, 'CPF deve ter no máximo 14 caracteres'),
    birthdate: yup.date().required('data de nascimento é obrigatória'),
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

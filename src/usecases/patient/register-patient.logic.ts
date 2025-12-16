import { AppContext } from '../../libs/context';
import { RegisterPatientInput } from '../../entities/patient/register-patient-input';
import { UserRole } from '../../entities/user/user-role';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import * as yup from 'yup';

export const registerPatient = async (
  context: AppContext,
  input: RegisterPatientInput,
) => {
  validateInput(input);

  // First, create user in Firebase (IAM Gateway)
  const displayName = `${input.firstname} ${input.lastname}`;
  const externalId = await context.gateways.iam.createUser(
    input.email,
    input.password,
    displayName,
  );

  // Then, create User in database
  const user = await context.repositories.user.create({
    external_id: externalId,
    email: input.email,
    firstname: input.firstname,
    lastname: input.lastname,
    phone_number: input.phone_number,
    role: UserRole.PATIENT,
  });

  // Create patient record
  const patientData = {
    user_id: parseInt(user.id, 10),
    cpf: input.cpf,
    birthdate: input.birthdate,
    civil_state: input.civil_state ?? null,
  };

  await context.repositories.patient.create(patientData);

  // Sign in the newly created user to return tokens
  const authTokens = await context.gateways.iam.signIn(
    input.email,
    input.password,
  );

  return {
    accessToken: authTokens.accessToken,
    refreshToken: authTokens.refreshToken,
    user,
  };
};

function validateInput(input: RegisterPatientInput) {
  const schema = yup.object<RegisterPatientInput>({
    email: yup
      .string()
      .required('email é obrigatório')
      .email('email deve ser um endereço de email válido')
      .max(255, 'email deve ter no máximo 255 caracteres'),
    password: yup
      .string()
      .required('senha é obrigatória')
      .min(6, 'senha deve ter no mínimo 6 caracteres')
      .max(100, 'senha deve ter no máximo 100 caracteres'),
    firstname: yup
      .string()
      .required('nome é obrigatório')
      .notOneOf([''], 'nome não pode estar vazio')
      .max(100, 'nome deve ter no máximo 100 caracteres'),
    lastname: yup
      .string()
      .required('sobrenome é obrigatório')
      .notOneOf([''], 'sobrenome não pode estar vazio')
      .max(100, 'sobrenome deve ter no máximo 100 caracteres'),
    phone_number: yup
      .string()
      .required('telefone é obrigatório')
      .notOneOf([''], 'telefone não pode estar vazio')
      .max(20, 'telefone deve ter no máximo 20 caracteres'),
    cpf: yup
      .string()
      .required('CPF é obrigatório')
      .notOneOf([''], 'CPF não pode estar vazio')
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

import { AppContext } from '../../libs/context';
import { CreateDentistInput } from '../../entities/dentist/create-dentist-input';
import { DentistEntity } from '../../entities/dentist/dentist';
import { DentistRole } from '../../entities/dentist/dentist-role';
import { DentistSpecialization } from '../../entities/dentist/dentist-specialization';
import { UserRole } from '../../entities/user/user-role';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import * as yup from 'yup';

export const createDentist = async (
  context: AppContext,
  input: CreateDentistInput,
): Promise<DentistEntity> => {
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
    role: UserRole.DENTIST,
  });

  // Finally, create dentist with the user_id
  const dentistData = {
    user_id: parseInt(user.id, 10),
    cro_number: input.cro_number,
    specialization: input.specialization ?? null,
    role: input.role ?? null,
    is_active: input.is_active,
    ...(input.clinic_id && { clinic_id: parseInt(input.clinic_id, 10) }),
  };

  return await context.repositories.dentist.create(dentistData);
};

function validateInput(input: CreateDentistInput) {
  const schema = yup.object<CreateDentistInput>({
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
    email: yup
      .string()
      .email('email deve ser um endereço de email válido')
      .required('email é obrigatório')
      .notOneOf([''], 'email não pode estar vazio')
      .max(255, 'email deve ter no máximo 255 caracteres'),
    password: yup
      .string()
      .required('senha é obrigatória')
      .min(6, 'senha deve ter no mínimo 6 caracteres')
      .max(100, 'senha deve ter no máximo 100 caracteres'),
    cro_number: yup
      .string()
      .required('número CRO é obrigatório')
      .notOneOf([''], 'número CRO não pode estar vazio')
      .max(50, 'número CRO deve ter no máximo 50 caracteres'),
    specialization: yup
      .string()
      .nullable()
      .oneOf(
        Object.values(DentistSpecialization),
        `especialização deve ser uma das seguintes: ${Object.values(DentistSpecialization).join(', ')}`,
      ),
    role: yup
      .string()
      .nullable()
      .oneOf(
        Object.values(DentistRole),
        `função deve ser uma das seguintes: ${Object.values(DentistRole).join(', ')}`,
      ),
    is_active: yup.boolean().required('is_active é obrigatório'),
    clinic_id: yup
      .string()
      .nullable()
      .optional()
      .test(
        'clinic_id-valid',
        'clinic_id deve ser uma string numérica válida maior que zero',
        (value: string | null | undefined) => {
          if (value === null || value === undefined) return true;
          const num = parseInt(value, 10);
          return !isNaN(num) && num > 0;
        },
      ),
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

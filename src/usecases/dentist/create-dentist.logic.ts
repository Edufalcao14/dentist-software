import { AppContext } from '../../libs/context';
import { CreateDentistInput } from '../../entities/dentist/create-dentist-input';
import { DentistEntity } from '../../entities/dentist/dentist';
import { DentistRole } from '../../entities/dentist/dentist-role';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import * as yup from 'yup';

export const createDentist = async (
  context: AppContext,
  input: CreateDentistInput,
): Promise<DentistEntity> => {
  validateInput(input);

  const dentistData: {
    firstname: string;
    lastname: string;
    phone_number: string;
    email: string;
    cro_number: string;
    specialization: string;
    role: string;
    is_active: boolean;
    clinic_id?: number;
  } = {
    firstname: input.firstname,
    lastname: input.lastname,
    phone_number: input.phone_number,
    email: input.email,
    cro_number: input.cro_number,
    specialization: input.specialization ?? '',
    role: input.role ?? DentistRole.OWNER,
    is_active: input.is_active,
  };

  if (input.clinic_id) {
    dentistData.clinic_id = parseInt(input.clinic_id, 10);
  }

  const dentist = await context.db.dentist.create({
    data: dentistData as any,
  });

  return {
    id: dentist.id.toString(),
    firstname: dentist.firstname,
    lastname: dentist.lastname,
    phone_number: dentist.phone_number,
    email: dentist.email,
    cro_number: dentist.cro_number,
    specialization: dentist.specialization,
    role: dentist.role,
    is_active: dentist.is_active,
    clinic_id: dentist.clinic_id?.toString() ?? null,
  };
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
    cro_number: yup
      .string()
      .required('número CRO é obrigatório')
      .notOneOf([''], 'número CRO não pode estar vazio')
      .max(50, 'número CRO deve ter no máximo 50 caracteres'),
    specialization: yup
      .string()
      .nullable()
      .max(100, 'especialização deve ter no máximo 100 caracteres'),
    role: yup
      .string()
      .nullable()
      .oneOf(
        Object.values(DentistRole),
        'função deve ser uma das seguintes: Admin, Associate, Hygienist',
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

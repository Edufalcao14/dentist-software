import { AppContext } from '../../libs/context';
import * as yup from 'yup';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import { SignInInput } from '../../entities/auth/sign-in-input';
import { AuthPayload } from '../../entities/user/auth-payload';
import { NotFoundError } from '../../entities/errors/not-found-error';
import { UserRole } from '../../entities/user/user-role';

export const signIn = async (
  ctx: AppContext,
  input: SignInInput,
): Promise<AuthPayload> => {
  await validateInput(input);

  // Check existing user
  const user = await ctx.repositories.user.getByEmail(input.email);

  if (!user) {
    throw new NotFoundError(
      'Email ou mot de passe incorrect. Veuillez réessayer.',
    );
  }

  const tokens = await ctx.gateways.iam.signIn(input.email, input.password);

  // Fetch patient or dentist based on user role
  let patient = null;
  let dentist = null;

  if (user.role === UserRole.PATIENT) {
    patient = await ctx.repositories.patient.getByUserId(user.id);
  } else if (user.role === UserRole.DENTIST) {
    dentist = await ctx.repositories.dentist.getByUserId(user.id);
  }

  return {
    refreshToken: tokens.refreshToken,
    accessToken: tokens.accessToken,
    user: user,
    patient,
    dentist,
  };
};

async function validateInput(input: SignInInput) {
  const schema = yup.object().shape({
    email: yup.string().email().required().min(1),
    password: yup.string().required().min(1),
  });

  try {
    await schema.validate(input, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new BadUserInputError(error.message);
    }
    throw error;
  }
}

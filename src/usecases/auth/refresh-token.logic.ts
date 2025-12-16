import * as yup from 'yup';
import { AppContext } from '../../libs/context';
import { AuthTokensEntity } from '../../entities/auth/auth-tokens';
import { RefreshTokenInput } from '../../entities/auth/refresh-token-input';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';

export const refreshToken = async (
  ctx: AppContext,
  input: RefreshTokenInput,
): Promise<AuthTokensEntity> => {
  await validateInput(input);

  const tokens = await ctx.gateways.iam.refreshToken(input.refreshToken);

  return tokens;
};

async function validateInput(input: RefreshTokenInput) {
  const schema = yup.object().shape({
    refreshToken: yup.string().required().min(1),
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

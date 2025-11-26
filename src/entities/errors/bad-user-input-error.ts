import { BadRequestError } from './bad-request-error';

export class BadUserInputError extends BadRequestError {
  constructor(message: string, details?: Record<string, any>, stack?: string) {
    super(message, details, stack);
    this.name = 'BadUserInputError';
  }
}

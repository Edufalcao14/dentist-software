import { BusinessError } from './business-error';

export class BadRequestError extends BusinessError {
  constructor(message: string, details?: Record<string, any>, stack?: string) {
    super(message, details, stack);
    this.name = 'BadRequestError';
  }
}

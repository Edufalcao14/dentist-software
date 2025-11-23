import { BusinessError } from './business-error';

export class UnknownError extends BusinessError {
    constructor(
        message: string,
        details?: Record<string, any>,
        stack?: string,
    ) {
        super(message, details, stack);
        this.name = 'UnknownError';
    }
}

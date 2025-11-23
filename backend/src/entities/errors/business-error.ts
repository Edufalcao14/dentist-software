export class BusinessError extends Error {
    constructor(
        public message: string,
        public details?: Record<string, any>,
        public stack?: string,
    ) {
        super(message);
        this.name = 'BusinessError';
    }
}

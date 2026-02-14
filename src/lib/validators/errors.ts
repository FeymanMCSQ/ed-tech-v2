export class AiBatchError extends Error {
    constructor(public stage: 'json_parse' | 'schema' | 'auth' | 'network', message: string) {
        super(message);
        this.name = 'AiBatchError';
    }
}

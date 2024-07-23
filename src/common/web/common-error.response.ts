export class ErrorResponse {
    constructor(
        readonly path: string,
        readonly timestamp: Date,
        readonly message: string
    ) 
    {}
}
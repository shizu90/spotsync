export class UserAlreadyDeletedError extends Error 
{
    constructor(message: string) 
    {
        super(message);
    }
}
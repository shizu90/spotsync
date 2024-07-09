export class UserGroupRequestNotFoundError extends Error 
{
    constructor(message: string) 
    {
        super(message);
    }
}
export class UserGroupNotFoundError extends Error 
{
    constructor(message: string) 
    {
        super(message);
    }
}
export class LikeNotFoundError extends Error 
{
    constructor(message: string) 
    {
        super(message);
    }
}
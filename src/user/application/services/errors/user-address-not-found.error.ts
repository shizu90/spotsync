export class UserAddressNotFoundError extends Error 
{
    public constructor(message: string) 
    {
        super(message);
    }
}
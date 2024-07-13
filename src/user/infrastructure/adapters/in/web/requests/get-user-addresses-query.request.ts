export class GetUserAddressesQueryRequest 
{
    public name?: string;
    public main?: boolean;
    public sort?: string;
    public sort_direction?: 'asc' | 'desc';
    public paginate?: boolean;
    public page?: number;
    public limit?: number;
}
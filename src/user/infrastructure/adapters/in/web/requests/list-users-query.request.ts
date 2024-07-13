export class ListUsersQueryRequest 
{
    public name?: string;
    public sort?: string;
    public sort_direction?: 'asc' | 'desc';
    public page?: number;
    public paginate?: boolean;
    public limit?: number;
}
export class ListGroupRolesQueryRequest 
{
    public name?: string;
    public is_immutable?: boolean;
    public sort?: string;
    public sort_direction?: 'asc' | 'desc';
    public page?: number;
    public paginate?: boolean;
    public limit?: number;
}
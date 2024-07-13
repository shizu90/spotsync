export class ListGroupMembersQueryRequest 
{
    readonly name?: string;
    readonly role_id?: string;
    readonly sort?: string;
    readonly sort_direction?: 'asc' | 'desc';
    readonly page?: number;
    readonly paginate?: boolean;
    readonly limit?: number;
}
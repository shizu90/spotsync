export class GetGroupDto 
{
    constructor(
        readonly id: string,
        readonly name: string,
        readonly about: string,
        readonly group_picture: string,
        readonly banner_picture: string,
        readonly visibility_configuration: {
            post_visibility: string,
            event_visibility: string,
            group_visibility: string
        },
        readonly created_at: Date,
        readonly updated_at: Date,
        readonly is_member: boolean,
        readonly group_member: {
            id: string,
            user_id: string,
            joined_at: Date,
            is_creator: boolean,
            role: {
                id: string
                name: string,
                permissions: string[]
            }
        } | null
    ) 
    {}
}
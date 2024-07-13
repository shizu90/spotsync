import { GroupVisibility } from "src/group/domain/group-visibility.enum";

export class UpdateGroupVisibilityRequest 
{
    public id: string;
    public group_visibility: GroupVisibility;
    public post_visibility: GroupVisibility;
    public event_visibility: GroupVisibility;
}
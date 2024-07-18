import { GetGroupCommand } from "src/group/application/ports/in/commands/get-group.command";
import { ListGroupsCommand } from "src/group/application/ports/in/commands/list-groups.command";
import { CreateGroupRequest } from "../requests/create-group.request";
import { CreateGroupCommand } from "src/group/application/ports/in/commands/create-group.command";
import { UpdateGroupRequest } from "../requests/update-group.request";
import { UpdateGroupCommand } from "src/group/application/ports/in/commands/update-group.command";
import { UpdateGroupVisibilityCommand } from "src/group/application/ports/in/commands/update-group-visibility.command";
import { UpdateGroupVisibilityRequest } from "../requests/update-group-visibility.request";
import { DeleteGroupCommand } from "src/group/application/ports/in/commands/delete-group.command";
import { ListGroupsQueryRequest } from "../requests/list-groups-query.request";

export class GroupRequestMapper 
{
    public static listGroupsCommand(query: ListGroupsQueryRequest): ListGroupsCommand 
    {
        return new ListGroupsCommand(
            query.name, 
            query.group_visibility, 
            query.sort, 
            query.sort_direction, 
            Number.isNaN(Number(query.page)) ? 0 : Number(query.page), 
            Boolean(query.paginate), 
            Number.isNaN(Number(query.limit)) ? 0 : Number(query.limit)
        );
    }

    public static getGroupCommand(id: string): GetGroupCommand
    {
        return new GetGroupCommand(
            id
        );
    }
    
    public static createGroupCommand(request: CreateGroupRequest): CreateGroupCommand
    {
        return new CreateGroupCommand(
            request.name, 
            request.about
        );
    }

    public static updateGroupCommand(id: string, request: UpdateGroupRequest): UpdateGroupCommand
    {
        return new UpdateGroupCommand(
            id, 
            request.name, 
            request.about
        );
    }

    public static updateGroupVisibilityCommand(id: string, request: UpdateGroupVisibilityRequest): UpdateGroupVisibilityCommand 
    {
        return new UpdateGroupVisibilityCommand(
            id, 
            request.group_visibility, 
            request.post_visibility, 
            request.event_visibility
        );
    }

    public static deleteGroupCommand(id: string): DeleteGroupCommand 
    {
        return new DeleteGroupCommand(
            id
        );
    }
}
import { ListGroupRolesCommand } from "src/group/application/ports/in/commands/list-group-roles.command";
import { ListGroupRolesQueryRequest } from "../requests/list-group-roles-query.request";
import { CreateGroupRoleRequest } from "../requests/create-group-role.request";
import { CreateGroupRoleCommand } from "src/group/application/ports/in/commands/create-group-role.command";
import { UpdateGroupRoleRequest } from "../requests/update-group-role.request";
import { UpdateGroupRoleCommand } from "src/group/application/ports/in/commands/update-group-role.command";
import { RemoveGroupRoleCommand } from "src/group/application/ports/in/commands/remove-group-role.command";
import { GetGroupRoleCommand } from "src/group/application/ports/in/commands/get-group-role.command";

export class GroupRoleRequestMapper 
{
    public static listGroupRolesCommand(groupId: string, query: ListGroupRolesQueryRequest): ListGroupRolesCommand
    {
        return new ListGroupRolesCommand(
            groupId, 
            query.name, 
            query.is_immutable, 
            query.sort, 
            query.sort_direction, 
            Number.isNaN(Number(query.page)) ? 0 : Number(query.page), 
            Boolean(query.paginate), 
            Number.isNaN(Number(query.limit)) ? 0 : Number(query.limit)
        );
    }

    public static getGroupRoleCommand(groupId: string, roleId: string): GetGroupRoleCommand 
    {
        return new GetGroupRoleCommand(
            roleId,
            groupId
        );
    }

    public static createGroupRoleCommand(groupId: string, request: CreateGroupRoleRequest): CreateGroupRoleCommand 
    {
        return new CreateGroupRoleCommand(
            groupId, 
            request.name, 
            request.hex_color, 
            request.permissions
        );
    }

    public static updateGroupRoleCommand(groupId: string, roleId: string, request: UpdateGroupRoleRequest): UpdateGroupRoleCommand 
    {
        return new UpdateGroupRoleCommand(
            roleId,
            groupId,
            request.name,
            request.hex_color,
            request.permissions
        );
    }

    public static removeGroupRoleCommand(groupId: string, roleId: string): RemoveGroupRoleCommand
    {
        return new RemoveGroupRoleCommand(
            roleId,
            groupId
        );
    }
}
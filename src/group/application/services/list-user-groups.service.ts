import { Injectable } from "@nestjs/common";
import { ListUserGroupsUseCase } from "../ports/in/use-cases/list-user-groups.use-case";
import { ListUserGroupsCommand } from "../ports/in/commands/list-user-groups.command";
import { Pagination } from "src/common/pagination.dto";
import { GetUserGroupDto } from "../ports/out/dto/get-user-group.dto";

@Injectable()
export class ListUserGroupsService implements ListUserGroupsUseCase 
{
    constructor() 
    {}

    public async execute(command: ListUserGroupsCommand): Promise<Pagination<GetUserGroupDto>> 
    {
        return null;
    }
}
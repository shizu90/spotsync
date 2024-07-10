import { Injectable } from "@nestjs/common";
import { ListGroupsUseCase } from "../ports/in/use-cases/list-groups.use-case";
import { ListGroupsCommand } from "../ports/in/commands/list-groups.command";
import { Pagination } from "src/common/pagination.dto";
import { GetGroupDto } from "../ports/out/dto/get-group.dto";

@Injectable()
export class ListGroupsService implements ListGroupsUseCase 
{
    constructor() 
    {}

    public async execute(command: ListGroupsCommand): Promise<Pagination<GetGroupDto>> 
    {
        return null;
    }
}
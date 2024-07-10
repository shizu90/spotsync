import { Injectable } from "@nestjs/common";
import { RemoveUserGroupMemberUseCase } from "../ports/in/use-cases/remove-user-group-member.use-case";
import { RemoveUserGroupMemberCommand } from "../ports/in/commands/remove-user-group-member.command";

@Injectable()
export class RemoveUserGroupMemberService implements RemoveUserGroupMemberUseCase 
{
    constructor() 
    {}

    public async execute(command: RemoveUserGroupMemberCommand): Promise<void> 
    {}
}
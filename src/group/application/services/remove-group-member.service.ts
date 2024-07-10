import { Injectable } from "@nestjs/common";
import { RemoveGroupMemberUseCase } from "../ports/in/use-cases/remove-group-member.use-case";
import { RemoveGroupMemberCommand } from "../ports/in/commands/remove-group-member.command";

@Injectable()
export class RemoveGroupMemberService implements RemoveGroupMemberUseCase 
{
    constructor() 
    {}

    public async execute(command: RemoveGroupMemberCommand): Promise<void> 
    {}
}
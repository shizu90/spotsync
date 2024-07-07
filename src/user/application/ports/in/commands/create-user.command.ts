import { Command } from "src/common/common.command";

export class CreateUserCommand extends Command
{
    constructor(
        readonly name: string,
        readonly email: string,
        readonly password: string,
        readonly birthDate: Date
    ) 
    {super();}
}
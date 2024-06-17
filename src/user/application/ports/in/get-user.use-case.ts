import { UseCase } from "src/common/common.use-case";
import { GetUserCommand } from "./get-user.command";
import { User } from "src/user/domain/user.model";

export abstract class GetUserUseCase implements UseCase<GetUserCommand, Promise<User>> 
{
    abstract execute(command: GetUserCommand): Promise<User>;
}
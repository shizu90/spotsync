import { UseCase } from "src/common/common.use-case";
import { UpdateUserCredentialsCommand } from "./update-user-credentials.command";
import { User } from "src/user/domain/user.model";

export abstract class UpdateUserCredentialsUseCase implements UseCase<UpdateUserCredentialsCommand, Promise<User>> 
{
    abstract execute(command: UpdateUserCredentialsCommand): Promise<User>;
}
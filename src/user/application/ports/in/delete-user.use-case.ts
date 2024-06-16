import { UseCase } from "src/common/common.use-case";
import { DeleteUserCommand } from "./delete-user.command";

export abstract class DeleteUserUseCase implements UseCase<DeleteUserCommand, Promise<void>> 
{
    abstract execute(command: DeleteUserCommand): Promise<void>;
}
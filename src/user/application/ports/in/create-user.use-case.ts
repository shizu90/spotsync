import { User } from "src/user/domain/user.model";
import { CreateUserCommand } from "./create-user.command";
import { UseCase } from "src/common/common.use-case";

export const CreateUserUseCaseProvider = 'CreateUserUseCaseProvider';

export interface CreateUserUseCase extends UseCase<CreateUserCommand, Promise<User>> 
{}
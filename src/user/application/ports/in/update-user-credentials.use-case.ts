import { UseCase } from "src/common/common.use-case";
import { UpdateUserCredentialsCommand } from "./update-user-credentials.command";
import { User } from "src/user/domain/user.model";

export interface UpdateUserCredentialsUseCase extends UseCase<UpdateUserCredentialsCommand, Promise<User>> 
{}
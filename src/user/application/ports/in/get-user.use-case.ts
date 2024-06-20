import { UseCase } from "src/common/common.use-case";
import { GetUserCommand } from "./get-user.command";
import { User } from "src/user/domain/user.model";

export const GetUserUseCaseProvider = 'GetUserUseCase';

export interface GetUserUseCase extends UseCase<GetUserCommand, Promise<User>> 
{}
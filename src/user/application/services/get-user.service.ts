import { Inject, Injectable } from "@nestjs/common";
import { GetUserUseCase } from "../ports/in/get-user.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { GetUserCommand } from "../ports/in/get-user.command";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";

@Injectable()
export class GetUserService implements GetUserUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: GetUserCommand): Promise<User> 
    {
        const user: User = this.userRepository.findById(command.id);

        if(user == null || user.isDeleted()) {
            throw new UserNotFoundError(`User ${command.id} not found.`);
        }

        return user;
    }
}
import { User } from "src/user/domain/user.model";
import { DeleteUserCommand } from "../ports/in/delete-user.command";
import { DeleteUserUseCase } from "../ports/in/delete-user.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteUserService implements DeleteUserUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository
    )
    {}

    public async execute(command: DeleteUserCommand): Promise<void> 
    {
        const user: User = await this.userRepository.findById(command.id);

        if(user == null) {
            throw new UserNotFoundError(`User ${command.id} not found.`);
        }

        if(user.isDeleted()) {
            throw new UserNotFoundError(`User ${command.id} not found.`);
        }

        user.delete();
        
        this.userRepository.update(user);
    }
}
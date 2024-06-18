import { User } from "src/user/domain/user.model";
import { DeleteUserCommand } from "../ports/in/delete-user.command";
import { DeleteUserUseCase } from "../ports/in/delete-user.use-case";
import { UserCredentialsRepository } from "../ports/out/user-credentials.repository";
import { UserRepository } from "../ports/out/user.repository";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { UserAlreadyDeletedError } from "./errors/user-already-deleted.error";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteUserService implements DeleteUserUseCase 
{
    constructor(
        protected userRepository: UserRepository,
        protected userCredentialsRepository: UserCredentialsRepository
    )
    {}

    public async execute(command: DeleteUserCommand): Promise<void> 
    {
        const user: User = this.userRepository.findById(command.id);

        if(user == null) {
            throw new UserNotFoundError(`User ${command.id} not found.`);
        }

        if(user.isDeleted()) {
            throw new UserAlreadyDeletedError(`User ${command.id} already deleted.`);
        }

        user.delete();
        
        this.userRepository.update(user);
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { SignOutUseCase } from "../ports/in/use-cases/sign-out.use-case";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { SignOutCommand } from "../ports/in/commands/sign-out.command";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { UnauthorizedAccessError } from "./errors/unauthorized-acess.error";

@Injectable()
export class SignOutService implements SignOutUseCase 
{
    public constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: SignOutCommand): Promise<void> 
    {
        if(command.userId === null || command.userId === undefined) {
            throw new UnauthorizedAccessError(`Unable to logout`);
        }
        
        const user = await this.userRepository.findById(command.userId);

        if(user === null) {
            throw new UserNotFoundError(`User not found`);
        }

        user.credentials().logout();

        this.userRepository.updateCredentials(user.credentials());
    }
}
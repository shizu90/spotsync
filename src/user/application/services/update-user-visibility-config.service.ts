import { Inject, Injectable } from "@nestjs/common";
import { UpdateUserVisibilityConfigUseCase } from "../ports/in/use-cases/update-user-visibility-config.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UpdateUserVisibilityConfigCommand } from "../ports/in/commands/update-user-visibility-config.command";

@Injectable()
export class UpdateUserVisibilityConfigService implements UpdateUserVisibilityConfigUseCase 
{
    public constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: UpdateUserVisibilityConfigCommand): Promise<void> 
    {
        
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "src/group/application/ports/out/group-member.repository";
import { GroupPermissionName } from "src/group/domain/group-permission-name.enum";
import { DeleteSpotEventCommand } from "../ports/in/commands/delete-spot-event.command";
import { DeleteSpotEventUseCase } from "../ports/in/use-cases/delete-spot-event.use-case";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";

@Injectable()
export class DeleteSpotEventService implements DeleteSpotEventUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
    ) {}

    public async execute(command: DeleteSpotEventCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvent = await this.spotEventRepository.findById(command.id);

        if (authenticatedUser.id() != spotEvent.creator().id()) {
            if (spotEvent.group()) {
                const member = (await this.groupMemberRepository.findBy({
                    userId: authenticatedUser.id(),
                    groupId: spotEvent.group().id(),
                })).at(0);
    
                if (!member) {
                    throw new UnauthorizedAccessError();
                }

                if (!member.canExecute(GroupPermissionName.DELETE_EVENTS)) {
                    throw new UnauthorizedAccessError();
                }
            } else {
                throw new UnauthorizedAccessError();
            }
        }

        await this.spotEventRepository.delete(spotEvent.id());
    }
}
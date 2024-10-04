import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "src/group/application/ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "src/group/application/ports/out/group.repository";
import { GroupNotFoundError } from "src/group/application/services/errors/group-not-found.error";
import { GroupPermissionName } from "src/group/domain/group-permission-name.enum";
import { SpotEventStatus } from "src/spot-event/domain/spot-event-status.enum";
import { SpotEventVisibility } from "src/spot-event/domain/spot-event-visibility.enum";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";
import { SpotRepository, SpotRepositoryProvider } from "src/spot/application/ports/out/spot.repository";
import { SpotNotFoundError } from "src/spot/application/services/errors/spot-not-found.error";
import { CreateSpotEventCommand } from "../ports/in/commands/create-spot-event.command";
import { CreateSpotEventUseCase } from "../ports/in/use-cases/create-spot-event.use-case";
import { SpotEventDto } from "../ports/out/dto/spot-event.dto";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";

@Injectable()
export class CreateSpotEventService implements CreateSpotEventUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(SpotRepositoryProvider)
        protected spotRepository: SpotRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: CreateSpotEventCommand): Promise<SpotEventDto> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        let spotEventVisibility = command.visibility;
        let group = null;

        if (command.groupId) {
            group = await this.groupRepository.findById(command.groupId);

            if (!group) {
                throw new GroupNotFoundError();
            }

            const member = (await this.groupMemberRepository.findBy({
                userId: authenticatedUser.id(),
                groupId: group.id(),
            })).at(0);

            if (!member) {
                throw new UnauthorizedAccessError();
            }

            if (!member.canExecute(GroupPermissionName.CREATE_EVENTS)) {
                throw new UnauthorizedAccessError();
            }

            spotEventVisibility = SpotEventVisibility[group.visibilitySettings().spotEvents().toString()];

            if (!spotEventVisibility) {
                throw new UnauthorizedAccessError();
            }
        }

        const spot = await this.spotRepository.findById(command.spotId);

        if (!spot) {
            throw new SpotNotFoundError();
        }

        const spotEvent = SpotEvent.create(
            randomUUID(),
            command.name,
            command.description,
            command.startDate,
            command.endDate,
            spot,
            authenticatedUser,
            [],
            spotEventVisibility,
            SpotEventStatus.SCHEDULED,
            group,
        );

        await this.spotEventRepository.store(spotEvent);

        return SpotEventDto.fromModel(spotEvent);
    }
}
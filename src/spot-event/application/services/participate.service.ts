import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "src/group/application/ports/out/group-member.repository";
import { ParticipateCommand } from "../ports/in/commands/participate.command";
import { ParticipateUseCase } from "../ports/in/use-cases/participate.command";
import { SpotEventParticipantDto } from "../ports/out/dto/spot-event-participant.dto";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";
import { AlreadyParticipatingError } from "./errors/already-participating.error";

@Injectable()
export class ParticipateService implements ParticipateUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
    ) {}

    public async execute(command: ParticipateCommand): Promise<SpotEventParticipantDto> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvent = await this.spotEventRepository.findById(command.id);

        const participant = spotEvent.findParticipantByUserId(authenticatedUser.id());

        if (participant) {
            throw new AlreadyParticipatingError();
        }

        if (spotEvent.group()) {
            const member = (await this.groupMemberRepository.findBy({
                userId: authenticatedUser.id(),
                groupId: spotEvent.group().id(),
            })).at(0);

            if (!member) {
                throw new UnauthorizedAccessError();
            }
        }

        const newParticipant = spotEvent.addParticipant(authenticatedUser);

        await this.spotEventRepository.update(spotEvent);

        return SpotEventParticipantDto.fromModel(newParticipant);
    }
}
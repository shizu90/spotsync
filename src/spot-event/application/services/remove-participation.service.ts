import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { RemoveParticipationCommand } from "../ports/in/commands/remove-participation.command";
import { RemoveParticipationUseCase } from "../ports/in/use-cases/remove-participation.use-case";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";
import { ParticipantNotFoundError } from "./errors/participant-not-found.error";
import { SpotEventNotFoundError } from "./errors/spot-event-not-found.error";

@Injectable()
export class RemoveParticipationService implements RemoveParticipationUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: RemoveParticipationCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvent = await this.spotEventRepository.findById(command.spotEventId);

        if (!spotEvent) {
            throw new SpotEventNotFoundError();
        }

        const participant = spotEvent.findParticipantByUserId(authenticatedUser.id());

        if (!participant) {
            throw new ParticipantNotFoundError();
        }

        if (!(spotEvent.creator().id() == authenticatedUser.id() || participant.user().id() == authenticatedUser.id())) {
            throw new UnauthorizedAccessError();
        }

        spotEvent.removeParticipant(authenticatedUser);

        await this.spotEventRepository.update(spotEvent);
    }
}
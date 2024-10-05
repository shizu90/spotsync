import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { EndSpotEventCommand } from "../ports/in/commands/end-spot-event.command";
import { EndSpotEventUseCase } from "../ports/in/use-cases/end-spot-event.use-case";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";
import { SpotEventHasEndedError } from "./errors/spot-event-ended.error";
import { SpotEventNotFoundError } from "./errors/spot-event-not-found.error";

@Injectable()
export class EndSpotEventService implements EndSpotEventUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: EndSpotEventCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvent = await this.spotEventRepository.findById(command.id);

        if (!spotEvent) {
            throw new SpotEventNotFoundError();
        }

        if (spotEvent.creator().id() != authenticatedUser.id()) {
            throw new UnauthorizedAccessError();
        }

        if (!spotEvent.isOngoing() || !spotEvent.isScheduled()) {
            throw new SpotEventHasEndedError();
        }

        spotEvent.end();

        await this.spotEventRepository.update(spotEvent);
    }
}
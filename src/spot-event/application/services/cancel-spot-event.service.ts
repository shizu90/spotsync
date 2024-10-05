import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { CancelSpotEventCommand } from "../ports/in/commands/cancel-spot-event.command";
import { CancelSpotEventUseCase } from "../ports/in/use-cases/cancel-spot-event.use-case";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";
import { SpotEventNotFoundError } from "./errors/spot-event-not-found.error";
import { SpotEventHasStartedError } from "./errors/spot-event-started.error";

@Injectable()
export class CancelSpotEventService implements CancelSpotEventUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: CancelSpotEventCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvent = await this.spotEventRepository.findById(command.id);

        if (!spotEvent) {
            throw new SpotEventNotFoundError();
        }

        if (spotEvent.creator().id() != authenticatedUser.id()) {
            throw new UnauthorizedAccessError();
        }

        if (!spotEvent.isScheduled()) {
            throw new SpotEventHasStartedError();
        }

        spotEvent.cancel();

        await this.spotEventRepository.update(spotEvent);
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { StartSpotEventCommand } from "../ports/in/commands/start-spot-event.command";
import { StartSpotEventUseCase } from "../ports/in/use-cases/start-spot-event.use-case";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";
import { SpotEventHasStartedError } from "./errors/spot-event-started.error";

@Injectable()
export class StartSpotEventService implements StartSpotEventUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: StartSpotEventCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvent = await this.spotEventRepository.findById(command.id);

        if (spotEvent.creator().id() != authenticatedUser.id()) {
            throw new UnauthorizedAccessError();
        }

        if (!spotEvent.isScheduled()) {
            throw new SpotEventHasStartedError();
        }

        spotEvent.start();

        await this.spotEventRepository.update(spotEvent);
    }
}
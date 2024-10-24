import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { UpdateSpotEventCommand } from "../ports/in/commands/update-spot-event.command";
import { UpdateSpotEventUseCase } from "../ports/in/use-cases/update-spot-event.use-case";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";
import { SpotEventNotFoundError } from "./errors/spot-event-not-found.error";
import { SpotEventHasStartedError } from "./errors/spot-event-started.error";

@Injectable()
export class UpdateSpotEventService implements UpdateSpotEventUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: UpdateSpotEventCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvent = await this.spotEventRepository.findById(command.id);

        if (!spotEvent) {
            throw new SpotEventNotFoundError();
        }

        if (spotEvent.creator().id() != authenticatedUser.id()) {
            throw new UnauthorizedAccessError();
        }

        if (spotEvent.isOngoing()) {
            throw new SpotEventHasStartedError();
        }

        if (command.name) {
            spotEvent.changeName(command.name);
        }

        if (command.description) {
            spotEvent.changeDescription(command.description);
        }

        if (command.startDate) {
            spotEvent.changeStartDate(command.startDate);
        }

        if (command.endDate) {
            spotEvent.changeEndDate(command.endDate);
        }

        if (command.notifyMinutes) {
            spotEvent.changeNotifyMinutes(command.notifyMinutes);
        }

        await this.spotEventRepository.update(spotEvent);
    }
}
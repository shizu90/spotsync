import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { RatableSubject } from "src/rating/domain/ratable-subject.enum";
import { Ratable } from "src/rating/domain/ratable.interface";
import { SpotEventRepository, SpotEventRepositoryProvider } from "src/spot-event/application/ports/out/spot-event.repository";
import { SpotEventNotFoundError } from "src/spot-event/application/services/errors/spot-event-not-found.error";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "src/spot-folder/application/ports/out/spot-folder.repository";
import { SpotFolderNotFoundError } from "src/spot-folder/application/services/errors/spot-folder-not-found.error";
import { SpotRepository, SpotRepositoryProvider } from "src/spot/application/ports/out/spot.repository";
import { SpotNotFoundError } from "src/spot/application/services/errors/spot-not-found.error";
import { CreateRatingCommand } from "../ports/in/commands/create-rating.command";
import { CreateRatingUseCase } from "../ports/in/use-cases/create-rating.use-case";
import { RatingDto } from "../ports/out/dto/rating.dto";
import { RatingRepository, RatingRepositoryProvider } from "../ports/out/rating.repository";
import { AlreadyRatedError } from "./errors/already-rated.error";
import { InvalidSubjectError } from "./errors/invalid-subject.error";

@Injectable()
export class CreateRatingService implements CreateRatingUseCase {
    constructor(
        @Inject(RatingRepositoryProvider)
        protected ratingRepository: RatingRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
        @Inject(SpotRepositoryProvider)
        protected spotRepository: SpotRepository,
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
    ) {}

    public async execute(command: CreateRatingCommand): Promise<RatingDto> {
        const authenticatedUser = await this.getAuthenticatedUserUseCase.execute(null);

        const alreadyRated = await this.ratingRepository.findBy({
            subject: command.subject,
            subjectId: command.subjectId,
            userId: authenticatedUser.id(),
        });

        if (alreadyRated) {
            throw new AlreadyRatedError();
        }

        let subject: Ratable = null;

        switch(command.subject) {
            case RatableSubject.SPOT:
                const spot = await this.spotRepository.findById(command.subjectId);

                if (!spot) {
                    throw new SpotNotFoundError();
                }
                subject = spot;
                break;
            case RatableSubject.SPOT_EVENT:
                const spotEvent = await this.spotEventRepository.findById(command.subjectId);

                if (!spotEvent) {
                    throw new SpotEventNotFoundError();
                }
                subject = spotEvent;
                break;
            case RatableSubject.SPOT_FOLDER:
                const spotFolder = await this.spotFolderRepository.findById(command.subjectId);

                if (!spotFolder) {
                    throw new SpotFolderNotFoundError();
                }
                subject = spotFolder;
                break;
            default: 
                throw new InvalidSubjectError();
        }

        const rating = subject.rate(command.value, authenticatedUser, command.comment);

        await this.ratingRepository.store(rating);

        return RatingDto.fromModel(rating);
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UpdateRatingCommand } from "../ports/in/commands/update-rating.command";
import { UpdateRatingUseCase } from "../ports/in/use-cases/update-rating.use-case";
import { RatingRepository, RatingRepositoryProvider } from "../ports/out/rating.repository";
import { RatingNotFoundError } from "./errors/rating-not-found.error";

@Injectable()
export class UpdateRatingService implements UpdateRatingUseCase {
    constructor(
        @Inject(RatingRepositoryProvider)
        protected ratingRepository: RatingRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase
    ) {}

    public async execute(command: UpdateRatingCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUserUseCase.execute(null);

        const rating = await this.ratingRepository.findById(command.id);

        if (!rating) {
            throw new RatingNotFoundError();
        }

        if (rating.user().id() !== authenticatedUser.id()) {
            throw new RatingNotFoundError();
        }

        if (command.value) {
            rating.changeValue(command.value);
        }

        if (command.comment !== null && command.comment !== undefined) {
            rating.changeComment(command.comment);
        }

        await this.ratingRepository.update(rating);
    }
}
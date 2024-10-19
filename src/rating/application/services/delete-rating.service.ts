import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { DeleteRatingCommand } from "../ports/in/commands/delete-rating.command";
import { DeleteRatingUseCase } from "../ports/in/use-cases/delete-rating.use-case";
import { RatingRepository, RatingRepositoryProvider } from "../ports/out/rating.repository";
import { RatingNotFoundError } from "./errors/rating-not-found.error";

@Injectable()
export class DeleteRatingService implements DeleteRatingUseCase {
    constructor(
        @Inject(RatingRepositoryProvider)
        protected ratingRepository: RatingRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: DeleteRatingCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUserUseCase.execute(null);

        const rating = await this.ratingRepository.findById(command.id);

        if (!rating) {
            throw new RatingNotFoundError();
        }

        if (rating.user().id() !== authenticatedUser.id()) {
            throw new RatingNotFoundError();
        }

        await this.ratingRepository.delete(rating.id());
    }
}
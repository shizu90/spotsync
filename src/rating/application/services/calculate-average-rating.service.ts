import { Inject, Injectable } from "@nestjs/common";
import { CalculateAverageRatingCommand } from "../ports/in/commands/calculate-average-rating.command";
import { CalculateAverageRatingUseCase } from "../ports/in/use-cases/calculate-average-rating.use-case";
import { RatingRepository, RatingRepositoryProvider } from "../ports/out/rating.repository";

@Injectable()
export class CalculateAverageRatingService implements CalculateAverageRatingUseCase {
    constructor(
        @Inject(RatingRepositoryProvider)
        protected ratingRepository: RatingRepository,
    ) {}

    public async execute(command: CalculateAverageRatingCommand): Promise<number> {
        const ratings = await this.ratingRepository.findBy({
            subject: command.subject,
            subjectId: command.subjectId,
        });

        if (ratings.length === 0) {
            return 0;
        }

        const totalRating = ratings.reduce((acc, rating) => acc + rating.value(), 0);

        return totalRating / ratings.length;
    }
}
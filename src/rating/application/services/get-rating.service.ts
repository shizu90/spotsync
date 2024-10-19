import { Inject, Injectable } from "@nestjs/common";
import { GetRatingCommand } from "../ports/in/commands/get-rating.command";
import { GetRatingUseCase } from "../ports/in/use-cases/get-rating.use-case";
import { RatingDto } from "../ports/out/dto/rating.dto";
import { RatingRepository, RatingRepositoryProvider } from "../ports/out/rating.repository";
import { RatingNotFoundError } from "./errors/rating-not-found.error";

@Injectable()
export class GetRatingService implements GetRatingUseCase {
    constructor(
        @Inject(RatingRepositoryProvider)
        protected ratingRepository: RatingRepository,
    ) {}

    public async execute(command: GetRatingCommand): Promise<RatingDto> {
        const rating = await this.ratingRepository.findById(command.id);

        if (!rating) {
            throw new RatingNotFoundError();
        }

        return RatingDto.fromModel(rating);
    }
}
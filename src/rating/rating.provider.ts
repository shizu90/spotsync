import { Provider } from "@nestjs/common";
import { CalculateAverageRatingUseCaseProvider } from "./application/ports/in/use-cases/calculate-average-rating.use-case";
import { CreateRatingUseCaseProvider } from "./application/ports/in/use-cases/create-rating.use-case";
import { DeleteRatingUseCaseProvider } from "./application/ports/in/use-cases/delete-rating.use-case";
import { GetRatingUseCaseProvider } from "./application/ports/in/use-cases/get-rating.use-case";
import { ListRatingsUseCaseProvider } from "./application/ports/in/use-cases/list-ratings.use-case";
import { UpdateRatingUseCaseProvider } from "./application/ports/in/use-cases/update-rating.use-case";
import { RatingRepositoryProvider } from "./application/ports/out/rating.repository";
import { CalculateAverageRatingService } from "./application/services/calculate-average-rating.service";
import { CreateRatingService } from "./application/services/create-rating.service";
import { DeleteRatingService } from "./application/services/delete-rating.service";
import { GetRatingService } from "./application/services/get-rating.service";
import { ListRatingsService } from "./application/services/list-ratings.service";
import { UpdateRatingService } from "./application/services/update-rating.service";
import { RatingRepositoryImpl } from "./infrastructure/adapters/out/rating.db";

export const Providers: Provider[] = [
    {
        provide: ListRatingsUseCaseProvider,
        useClass: ListRatingsService,
    },
    {
        provide: GetRatingUseCaseProvider,
        useClass: GetRatingService,
    },
    {
        provide: CreateRatingUseCaseProvider,
        useClass: CreateRatingService,
    },
    {
        provide: UpdateRatingUseCaseProvider,
        useClass: UpdateRatingService,
    },
    {
        provide: DeleteRatingUseCaseProvider,
        useClass: DeleteRatingService,
    },
    {
        provide: CalculateAverageRatingUseCaseProvider,
        useClass: CalculateAverageRatingService,
    },
    {
        provide: RatingRepositoryProvider,
        useClass: RatingRepositoryImpl,
    }
];
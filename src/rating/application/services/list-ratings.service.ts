import { Inject, Injectable } from "@nestjs/common";
import { Pagination } from "src/common/core/common.repository";
import { ListRatingsCommand } from "../ports/in/commands/list-ratings.command";
import { ListRatingsUseCase } from "../ports/in/use-cases/list-ratings.use-case";
import { RatingDto } from "../ports/out/dto/rating.dto";
import { RatingRepository, RatingRepositoryProvider } from "../ports/out/rating.repository";

@Injectable()
export class ListRatingsService implements ListRatingsUseCase {
    constructor(
        @Inject(RatingRepositoryProvider)
        protected ratingRepository: RatingRepository,
    ) {}

    public async execute(command: ListRatingsCommand): Promise<Array<RatingDto> | Pagination<RatingDto>> {
        const ratings = await this.ratingRepository.paginate({
            filters: {
                subject: command.subject,
                subjectId: command.subjectId,
                userId: command.userId,
                value: command.value,
            },
            sort: command.sort,
            sortDirection: command.sortDirection,
            page: command.page,
            limit: command.limit,
            paginate: command.paginate,
        });

        const items = ratings.items.map((rating) => RatingDto.fromModel(rating));

        if (command.paginate) {
            return new Pagination(items, ratings.total, ratings.current_page, ratings.limit);
        } else {
            return items;
        }
    }
}
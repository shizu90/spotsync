import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Pagination } from "src/common/core/common.repository";
import { FavoriteRepository, FavoriteRepositoryProvider } from "src/favorite/application/ports/out/favorite.repository";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "src/group/application/ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "src/group/application/ports/out/group.repository";
import { SpotEventVisibility } from "src/spot-event/domain/spot-event-visibility.enum";
import { ListSpotEventsCommand } from "../ports/in/commands/list-spot-events.command";
import { ListSpotEventsUseCase } from "../ports/in/use-cases/list-spot-events.use-case";
import { SpotEventDto } from "../ports/out/dto/spot-event.dto";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";

@Injectable()
export class ListSpotEventsService implements ListSpotEventsUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(FavoriteRepositoryProvider)
        protected favoriteRepository: FavoriteRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: ListSpotEventsCommand): Promise<Pagination<SpotEventDto> | Array<SpotEventDto>> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvents = await this.spotEventRepository.paginate({
            filters: {
                spotId: command.spotId,
                groupId: command.groupId,
                startDate: command.startDate,
                endDate: command.endDate,
                status: command.status,
            },
            sort: command.sort,
            sortDirection: command.sortDirection,
            page: command.page,
            limit: command.limit,
            paginate: command.paginate,
        });

        
        const items = await Promise.all(spotEvents.items.map(async spotEvent => {
            switch(spotEvent.visibility()) {
                case SpotEventVisibility.PRIVATE:
                    if (spotEvent.group()) {
                        const member = (await this.groupMemberRepository.findBy({
                            userId: authenticatedUser.id(),
                            groupId: spotEvent.group().id(),
                        })).at(0);

                        if (!member) {
                            return null;
                        }
                    } else {
                        return null;
                    }
                    break;
                case SpotEventVisibility.PUBLIC:
                default: break;
            }

            const favorite = (await this.favoriteRepository.findBy({
                userId: authenticatedUser.id(),
                subjectId: spotEvent.id(),
                subject: FavoritableSubject.SPOT_EVENT,
            })).at(0);

            const totalFavorites = (await this.favoriteRepository.countBy({
                subjectId: spotEvent.id(),
                subject: FavoritableSubject.SPOT_EVENT,
            }));

            return SpotEventDto.fromModel(spotEvent)
                .setFavoritedAt(favorite?.createdAt())
                .setTotalFavorites(totalFavorites);
        }));

        if (command.paginate) {
            return new Pagination(
                items,
                spotEvents.total,
                spotEvents.current_page,
                spotEvents.limit
            );
        } else {
            return items;
        }
    }
}
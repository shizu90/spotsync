import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { FavoriteRepository, FavoriteRepositoryProvider } from "src/favorite/application/ports/out/favorite.repository";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "src/group/application/ports/out/group-member.repository";
import { GetSpotEventCommand } from "../ports/in/commands/get-spot-event.command";
import { GetSpotEventUseCase } from "../ports/in/use-cases/get-spot-event.use-case";
import { SpotEventDto } from "../ports/out/dto/spot-event.dto";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";
import { SpotEventNotFoundError } from "./errors/spot-event-not-found.error";

@Injectable()
export class GetSpotEventService implements GetSpotEventUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(FavoriteRepositoryProvider)
        protected favoriteRepository: FavoriteRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: GetSpotEventCommand): Promise<SpotEventDto> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvent = await this.spotEventRepository.findById(command.id);

        if (!spotEvent) {
            throw new SpotEventNotFoundError();
        }

        if (spotEvent.group()) {
            const member = (await this.groupMemberRepository.findBy({
                userId: authenticatedUser.id(),
                groupId: spotEvent.group().id(),
            })).at(0);

            if (!member) {
                throw new UnauthorizedAccessError();
            }
        }

        const favorite = (await this.favoriteRepository.findBy({
            userId: authenticatedUser.id(),
            subjectId: spotEvent.id(),
            subject: FavoritableSubject.SPOT_EVENT,
        })).at(0);


        const totalFavorites = await this.favoriteRepository.countBy({
            subjectId: spotEvent.id(),
            subject: FavoritableSubject.SPOT_EVENT,
        });

        return SpotEventDto.fromModel(spotEvent)
            .setFavoritedAt(favorite?.createdAt())
            .setTotalFavorites(totalFavorites);
    }
}
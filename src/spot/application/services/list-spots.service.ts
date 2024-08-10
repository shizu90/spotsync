import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Pagination } from "src/common/core/common.repository";
import { calculateDistance } from "src/spot/domain/calculate-distance.helper";
import { UserAddressRepository, UserAddressRepositoryProvider } from "src/user/application/ports/out/user-address.repository";
import { ListSpotsCommand } from "../ports/in/commands/list-spots.command";
import { ListSpotsUseCase } from "../ports/in/use-cases/list-spots.use-case";
import { GetSpotDto } from "../ports/out/dto/get-spot.dto";
import { SpotRepository, SpotRepositoryProvider } from "../ports/out/spot.repository";

@Injectable()
export class ListSpotsService implements ListSpotsUseCase 
{
    constructor(
        @Inject(SpotRepositoryProvider)
        protected spotRepository: SpotRepository,
        @Inject(UserAddressRepositoryProvider)
        protected userAddressRepository: UserAddressRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: ListSpotsCommand): Promise<Pagination<GetSpotDto>> 
    {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);
        const mainAddress = (await this.userAddressRepository.findBy({
            userId: authenticatedUser.id(),
            main: true
        })).at(0);

        const spots = await this.spotRepository.paginate({
            filters: {
                name: command.name,
                type: command.type,
                creatorId: command.creatorId,
            },
            sort: command.sort,
            sortDirection: command.sortDirection,
            page: command.page,
            limit: command.limit,
            paginate: command.paginate
        });

        const items = await Promise.all(spots.items.map(async (s) => {
            const totalSpotVisits = await this.spotRepository.countVisitedSpotsBy({
                spotId: s.id()
            });

            const totalFavorites = await this.spotRepository.countFavoritedSpotsBy({
                spotId: s.id()
            });
            
            const visited = (await this.spotRepository.findVisitedSpotBy({
                userId: authenticatedUser.id(),
                spotId: s.id()
            })).at(0);

            const favorited = (await this.spotRepository.findFavoritedSpotBy({
                userId: authenticatedUser.id(),
                spotId: s.id()
            })).at(0);

            let distance = 0;

            if (mainAddress !== null && mainAddress !== undefined) {
                distance = calculateDistance(
                    {lat: mainAddress.latitude(), long: mainAddress.longitude()},
                    {lat: s.address().latitude(), long: s.address().longitude()}
                );
            }

            return new GetSpotDto(
                s.id(),
                s.name(),
                s.description(),
                s.type(),
                {
                    area: s.address().area(),
                    sub_area: s.address().subArea(),
                    locality: s.address().locality(),
                    country_code: s.address().countryCode(),
                    latitude: s.address().latitude(),
                    longitude: s.address().longitude()
                },
                s.photos().map((p) => {return {id: p.id(), file_path: p.filePath()}}),
                s.creator().id(),
                distance,
                visited !== null && visited !== undefined,
                favorited !== null && favorited !== undefined,
                0,
                0,
                totalSpotVisits,
                totalFavorites,
                0,
                s.createdAt(),
                s.updatedAt()
            );
        }));

        return new Pagination(items, spots.total, spots.current_page);
    }
}
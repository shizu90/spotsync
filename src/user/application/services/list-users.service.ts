import { Inject, Injectable } from "@nestjs/common";
import { ListUsersUseCase } from "../ports/in/use-cases/list-users.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { ListUsersCommand } from "../ports/in/commands/list-users.command";
import { Pagination } from "src/common/pagination.dto";
import { GetUserProfileDto } from "../ports/out/dto/get-user-profile.dto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "src/follower/application/ports/out/follow.repository";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";
import { UserVisibility } from "src/user/domain/user-visibility.enum";

@Injectable()
export class ListUsersService implements ListUsersUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(FollowRepositoryProvider)
        protected followRepository: FollowRepository,
        @Inject(UserAddressRepositoryProvider)
        protected userAddressRepository: UserAddressRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: ListUsersCommand): Promise<Pagination<GetUserProfileDto>> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);
        
        const users = await this.userRepository.findBy({
            name: command.name,
            sort: command.sort,
            sortDirection: command.sortDirection,
            page: command.page,
            paginate: command.paginate,
            limit: command.limit,
            isDeleted: false
        });

        const items: GetUserProfileDto[] = await Promise.all(users.map(async (u) => {
            if(u) {
                const isFollowing = (await this.followRepository.findBy({fromUserId: authenticatedUserId, toUserId: u.id()})).at(0);

                let userMainAddress = (await this.userAddressRepository.findBy({userId: u.id(), main: true})).at(0);

                if(authenticatedUserId !== u.id()) {
                    if(u.visibilityConfiguration().addressVisibility() === UserVisibility.PRIVATE) {
                        userMainAddress = undefined;
                    }
                    if(u.visibilityConfiguration().addressVisibility() === UserVisibility.FOLLOWERS && !isFollowing) {
                        userMainAddress = undefined;
                    }
                }

                return new GetUserProfileDto(
                    u.id(),
                    u.biograph(),
                    u.createdAt(),
                    u.updatedAt(),
                    u.profilePicture(),
                    u.bannerPicture(),
                    {
                        profile_visibility: u.visibilityConfiguration().profileVisibility(),
                        address_visibility: u.visibilityConfiguration().addressVisibility(),
                        poi_folder_visibility: u.visibilityConfiguration().poiFolderVisibility(),
                        visited_poi_visibility: u.visibilityConfiguration().visitedPoiVisibility(),
                        post_visibility: u.visibilityConfiguration().postVisibility()
                    },
                    {name: u.credentials().name()},
                    userMainAddress ? {
                        id: userMainAddress.id(),
                        area: userMainAddress.area(),
                        sub_area: userMainAddress.subArea(),
                        country_code: userMainAddress.countryCode(),
                        locality: userMainAddress.locality(),
                        name: userMainAddress.name(),
                        latitude: userMainAddress.latitude(),
                        longitude: userMainAddress.longitude(),
                        created_at: userMainAddress.createdAt(),
                        updated_at: userMainAddress.updatedAt()
                    } : null,
                    isFollowing ? true : false
                );
            }
        }));

        return new Pagination(items, items.length);
    }
}
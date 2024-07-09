import { Inject, Injectable } from "@nestjs/common";
import { GetUserProfileUseCase } from "../ports/in/use-cases/get-user-profile.use-case";
import { GetUserProfileCommand } from "../ports/in/commands/get-user-profile.command";
import { GetUserProfileDto } from "../ports/out/dto/get-user-profile.dto";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "src/follower/application/ports/out/follow.repository";

@Injectable()
export class GetUserProfileService implements GetUserProfileUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(UserAddressRepositoryProvider)
        protected userAddressRepository: UserAddressRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(FollowRepositoryProvider)
        protected followRepository: FollowRepository
    ) 
    {}

    public async execute(command: GetUserProfileCommand): Promise<GetUserProfileDto> 
    {
        const user = await (command.id ? 
            this.userRepository.findById(command.id) :
            this.userRepository.findByName(command.name)
        );

        if(user === null || user === undefined || user.isDeleted()) {
            throw new UserNotFoundError(`User ${command.id || command.name} not found`);
        }

        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const isFollowing = (await this.followRepository.findBy({fromUserId: authenticatedUserId, toUserId: user.id()})).at(0);

        const userMainAddress = (await this.userAddressRepository.findBy({userId: user.id(), main: true})).at(0);

        return new GetUserProfileDto(
            user.id(),
            user.biograph(),
            user.createdAt(),
            user.updatedAt(),
            user.profilePicture(),
            user.bannerPicture(),
            {
                profile_visibility: user.visibilityConfiguration().profileVisibility(),
                address_visibility: user.visibilityConfiguration().addressVisibility(),
                poi_folder_visibility: user.visibilityConfiguration().poiFolderVisibility(),
                visited_poi_visibility: user.visibilityConfiguration().visitedPoiVisibility(),
                post_visibility: user.visibilityConfiguration().postVisibility()
            },
            {
                name: user.credentials().name()
            },
            userMainAddress ? {
                id: userMainAddress.id(),
                name: userMainAddress.name(),
                area: userMainAddress.area(),
                country_code: userMainAddress.countryCode(),
                latitude: userMainAddress.latitude(),
                longitude: userMainAddress.longitude(),
                locality: userMainAddress.locality(),
                sub_area: userMainAddress.subArea(),
                created_at: userMainAddress.createdAt(),
                updated_at: userMainAddress.updatedAt()
            } : null,
            isFollowing ? true : false
        );
    }
}
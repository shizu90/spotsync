import { Inject, Injectable } from '@nestjs/common';
import {
    GetAuthenticatedUserUseCase,
    GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/core/common.repository';
import {
    FollowRepository,
    FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { ListUsersCommand } from '../ports/in/commands/list-users.command';
import { ListUsersUseCase } from '../ports/in/use-cases/list-users.use-case';
import { GetUserProfileDto } from '../ports/out/dto/get-user-profile.dto';
import {
    UserAddressRepository,
    UserAddressRepositoryProvider,
} from '../ports/out/user-address.repository';
import {
    UserRepository,
    UserRepositoryProvider,
} from '../ports/out/user.repository';

@Injectable()
export class ListUsersService implements ListUsersUseCase {
	constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: ListUsersCommand,
	): Promise<Pagination<GetUserProfileDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const pagination = await this.userRepository.paginate({
			filters: {
				name: command.name,
				firstName: command.firstName,
				lastName: command.lastName,
				fullName: command.fullName,
				isDeleted: false,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			page: command.page,
			paginate: command.paginate,
			limit: command.limit,
		});

		const items = await Promise.all(
			pagination.items.map(async (u) => {
				const isFollowing = (
					await this.followRepository.findBy({
						fromUserId: authenticatedUser.id(),
						toUserId: u.id(),
					})
				).at(0);

				let userMainAddress = (
					await this.userAddressRepository.findBy({
						userId: u.id(),
						main: true,
					})
				).at(0);

				if (authenticatedUser.id() !== u.id()) {
					if (
						u.visibilityConfiguration().addresses() ===
						UserVisibility.PRIVATE
					) {
						userMainAddress = undefined;
					}
					if (
						u.visibilityConfiguration().addresses() ===
							UserVisibility.FOLLOWERS &&
						!isFollowing
					) {
						userMainAddress = undefined;
					}
				}

				const totalFollowers = await this.followRepository.countBy({
					toUserId: u.id(),
				});
				const totalFollowing = await this.followRepository.countBy({
					fromUserId: u.id(),
				});

				return new GetUserProfileDto(
					u.id(),
					u.firstName(),
					u.lastName(),
					u.profileThemeColor(),
					u.biograph(),
					u.createdAt(),
					u.updatedAt(),
					u.profilePicture(),
					u.bannerPicture(),
					{ name: u.credentials().name() },
					{
						profile: u.visibilityConfiguration().profile(),
						addresses: u.visibilityConfiguration().addresses(),
						favorite_spot_events: u
							.visibilityConfiguration()
							.favoriteSpotEvents(),
						favorite_spot_folders: u
							.visibilityConfiguration()
							.favoriteSpotFolders(),
						favorite_spots: u
							.visibilityConfiguration()
							.favoriteSpots(),
						posts: u.visibilityConfiguration().posts(),
						spot_folders: u.visibilityConfiguration().spotFolders(),
						visited_spots: u
							.visibilityConfiguration()
							.visitedSpots(),
					},
					totalFollowers,
					totalFollowing,
					userMainAddress
						? {
								id: userMainAddress.id(),
								area: userMainAddress.area(),
								sub_area: userMainAddress.subArea(),
								country_code: userMainAddress.countryCode(),
								locality: userMainAddress.locality(),
								name: userMainAddress.name(),
								latitude: userMainAddress.latitude(),
								longitude: userMainAddress.longitude(),
								created_at: userMainAddress.createdAt(),
								updated_at: userMainAddress.updatedAt(),
							}
						: null,
					isFollowing ? true : false,
				);
			}),
		);

		return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
	}
}

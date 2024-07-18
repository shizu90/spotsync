import { Inject, Injectable } from '@nestjs/common';
import { ListUsersUseCase } from '../ports/in/use-cases/list-users.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';
import { ListUsersCommand } from '../ports/in/commands/list-users.command';
import { GetUserProfileDto } from '../ports/out/dto/get-user-profile.dto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../ports/out/user-address.repository';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { Pagination } from 'src/common/common.repository';

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
		const authenticatedUserId = this.getAuthenticatedUser.execute(null);

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
						fromUserId: authenticatedUserId,
						toUserId: u.id(),
					})
				).at(0);

				let userMainAddress = (
					await this.userAddressRepository.findBy({
						userId: u.id(),
						main: true,
					})
				).at(0);

				if (authenticatedUserId !== u.id()) {
					if (
						u.visibilityConfiguration().addressVisibility() ===
						UserVisibility.PRIVATE
					) {
						userMainAddress = undefined;
					}
					if (
						u.visibilityConfiguration().addressVisibility() ===
							UserVisibility.FOLLOWERS &&
						!isFollowing
					) {
						userMainAddress = undefined;
					}
				}

				const totalFollowers = (
					await this.followRepository.findBy({ toUserId: u.id() })
				).length;
				const totalFollowing = (
					await this.followRepository.findBy({ fromUserId: u.id() })
				).length;

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
					{
						profile_visibility: u
							.visibilityConfiguration()
							.profileVisibility(),
						address_visibility: u
							.visibilityConfiguration()
							.addressVisibility(),
						poi_folder_visibility: u
							.visibilityConfiguration()
							.poiFolderVisibility(),
						visited_poi_visibility: u
							.visibilityConfiguration()
							.visitedPoiVisibility(),
						post_visibility: u
							.visibilityConfiguration()
							.postVisibility(),
					},
					{ name: u.credentials().name() },
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

		return new Pagination(items, pagination.total, pagination.current_page);
	}
}

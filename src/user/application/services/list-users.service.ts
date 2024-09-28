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
import { UserDto } from '../ports/out/dto/user.dto';
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
	): Promise<Pagination<UserDto> | Array<UserDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const pagination = await this.userRepository.paginate({
			filters: {
				name: command.name,
				displayName: command.displayName,
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
				).length > 0;

				let userMainAddress = (
					await this.userAddressRepository.findBy({
						userId: u.id(),
						main: true,
					})
				).at(0);

				if (authenticatedUser.id() !== u.id()) {
					if (
						u.visibilitySettings().addresses() ===
						UserVisibility.PRIVATE
					) {
						userMainAddress = undefined;
					}
					if (
						u.visibilitySettings().addresses() ===
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

				return UserDto.fromModel(u)
					.removeSensitiveData()
					.setFollowing(isFollowing)
					.setMainAddress(userMainAddress)
					.setTotalFollowers(totalFollowers)
					.setTotalFollowing(totalFollowing);
			}),
		);

		if (!command.paginate) {
			return items;
		}

		return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
	}
}

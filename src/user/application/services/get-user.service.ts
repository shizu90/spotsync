import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { GetUserCommand } from '../ports/in/commands/get-user.command';
import { GetUserUseCase } from '../ports/in/use-cases/get-user-profile.use-case';
import { UserDto } from '../ports/out/dto/user.dto';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../ports/out/user-address.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';
import { UserNotFoundError } from './errors/user-not-found.error';

@Injectable()
export class GetUserService implements GetUserUseCase {
	constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
	) {}

	public async execute(
		command: GetUserCommand,
	): Promise<UserDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const user = await (command.id
			? this.userRepository.findById(command.id)
			: this.userRepository.findByName(command.name));

		if (user === null || user === undefined || user.isDeleted()) {
			throw new UserNotFoundError();
		}

		const isFollowing =
			(
				await this.followRepository.findBy({
					fromUserId: authenticatedUser.id(),
					toUserId: user.id(),
				})
			).length > 0;

		let userMainAddress = (
			await this.userAddressRepository.findBy({
				userId: user.id(),
				main: true,
			})
		).at(0);

		if (authenticatedUser.id() !== user.id()) {
			if (
				user.visibilitySettings().addresses() ===
				UserVisibility.PRIVATE
			) {
				userMainAddress = undefined;
			}
			if (
				user.visibilitySettings().addresses() ===
					UserVisibility.FOLLOWERS &&
				!isFollowing
			) {
				userMainAddress = undefined;
			}
		}

		const totalFollowers = await this.followRepository.countBy({
			toUserId: user.id(),
		});
		const totalFollowing = await this.followRepository.countBy({
			fromUserId: user.id(),
		});

		return UserDto.fromModel(user)
			.removeSensitiveData()
			.setFollowing(isFollowing)
			.setMainAddress(userMainAddress)
			.setTotalFollowers(totalFollowers)
			.setTotalFollowing(totalFollowing);
	}
}

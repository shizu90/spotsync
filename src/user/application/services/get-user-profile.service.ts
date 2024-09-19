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
import { GetUserProfileCommand } from '../ports/in/commands/get-user-profile.command';
import { GetUserProfileUseCase } from '../ports/in/use-cases/get-user-profile.use-case';
import { GetUserProfileDto } from '../ports/out/dto/get-user-profile.dto';
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
export class GetUserProfileService implements GetUserProfileUseCase {
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
		command: GetUserProfileCommand,
	): Promise<GetUserProfileDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const user = await (command.id
			? this.userRepository.findById(command.id)
			: this.userRepository.findByName(command.name));

		if (user === null || user === undefined || user.isDeleted()) {
			throw new UserNotFoundError(`User not found`);
		}

		const isFollowing =
			(
				await this.followRepository.findBy({
					fromUserId: authenticatedUser.id(),
					toUserId: user.id(),
				})
			).length > 0
				? true
				: false;

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

		return new GetUserProfileDto(
			user.id(),
			user.status(),
			user.createdAt(),
			user.updatedAt(),
			{
				name: user.credentials().name(),
			},
			{
				birth_date: user.profile().birthDate(),
				display_name: user.profile().displayName(),
				theme_color: user.profile().themeColor(),
				biograph: user.profile().biograph(),
				profile_picture: user.profile().profilePicture(),
				banner_picture: user.profile().bannerPicture(),
				visibility: user.profile().visibility(),
			},
			{
				profile: user.visibilitySettings().profile(),
				addresses: user.visibilitySettings().addresses(),
				visited_spots: user.visibilitySettings().visitedSpots(),
				posts: user.visibilitySettings().posts(),
				favorite_spots: user.visibilitySettings().favoriteSpots(),
				favorite_spot_events: user.visibilitySettings().favoriteSpotEvents(),
				favorite_spot_folders: user.visibilitySettings().favoriteSpotFolders(),
				spot_folders: user.visibilitySettings().spotFolders(),
			},
			totalFollowers,
			totalFollowing,
			userMainAddress && {
				id: userMainAddress.id(),
				name: userMainAddress.name(),
				area: userMainAddress.area(),
				sub_area: userMainAddress.subArea(),
				locality: userMainAddress.locality(),
				latitude: userMainAddress.latitude(),
				longitude: userMainAddress.longitude(),
				country_code: userMainAddress.countryCode(),
				created_at: userMainAddress.createdAt(),
				updated_at: userMainAddress.updatedAt(),
			},
			isFollowing,
		);
	}
}

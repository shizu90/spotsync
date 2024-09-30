import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import { GetUserProfileCommand } from '../../ports/in/commands/get-user.command';
import { GetUserProfileDto } from '../../ports/out/dto/get-user-profile.dto';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { GetUserProfileService } from '../get-user.service';
import { mockUser, mockUserAddress } from './user-mock.helper';

describe('GetUserProfileService', () => {
	let service: GetUserProfileService;
	let userRepository: jest.Mocked<UserRepository>;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let followRepository: jest.Mocked<FollowRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			GetUserProfileService,
		).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
		followRepository = unitRef.get(FollowRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get user profile', async () => {
		const user = mockUser();

		const command = new GetUserProfileCommand(user.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		userRepository.findById.mockResolvedValue(user);
		followRepository.findBy.mockResolvedValue([]);
		followRepository.countBy.mockResolvedValue(0);
		userAddressRepository.findBy.mockResolvedValue([mockUserAddress()]);

		const profile = await service.execute(command);

		expect(profile).toBeInstanceOf(GetUserProfileDto);
		expect(profile.id).toBe(user.id());
		expect(profile.address).toBeDefined();
		expect(profile.total_followers).toBe(0);
		expect(profile.total_following).toBe(0);
		expect(profile.following).toBe(false);
	});

	it('should not get user profile if user does not exist', async () => {
		const user = mockUser();

		const command = new GetUserProfileCommand(randomUUID());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		userRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			UserNotFoundError,
		);
	});
});

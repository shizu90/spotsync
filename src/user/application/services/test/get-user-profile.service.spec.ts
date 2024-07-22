import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { GetUserProfileService } from '../get-user-profile.service';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import { TestBed } from '@automock/jest';
import { mockUser } from './user-mock.helper';
import { GetUserProfileCommand } from '../../ports/in/commands/get-user-profile.command';
import { randomUUID } from 'crypto';

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

		const command = new GetUserProfileCommand(
			randomUUID()
		);

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(user.id());
		followRepository.findBy.mockResolvedValue([]);
		userAddressRepository.findBy.mockResolvedValue([]);

		const userProfile = await service.execute(command);

		expect(userProfile.first_name).toBe(user.firstName());
	});
});
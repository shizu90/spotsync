import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UpdateUserProfileCommand } from '../../ports/in/commands/update-user-profile.command';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { UpdateUserProfileService } from '../update-user-profile.service';
import { mockUser } from './user-mock.helper';

describe('UpdateUserProfileService', () => {
	let service: UpdateUserProfileService;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			UpdateUserProfileService,
		).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should update user profile', async () => {
		const user = mockUser();

		const command = new UpdateUserProfileCommand(
			user.id(),
			'New Test First Name',
			'New Test Last Name',
		);

		getAuthenticatedUser.execute.mockResolvedValue(user);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(user.firstName()).toBe(command.firstName);
		expect(user.lastName()).toBe(command.lastName);
	});

	it('should no update user profile if user is not authorized', async () => {
		const user = mockUser();

		const command = new UpdateUserProfileCommand(
			user.id(),
			'New Test First Name',
			'New Test Last Name',
		);

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});

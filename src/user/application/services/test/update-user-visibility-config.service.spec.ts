import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { UpdateUserVisibilitySettingsCommand } from '../../ports/in/commands/update-user-visibility-settings.command';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { UpdateUserVisibilitySettingsService } from '../update-user-visibility-settings.service';
import { mockUser } from './user-mock.helper';

describe('UpdateUserVisibilitySettingsService', () => {
	let service: UpdateUserVisibilitySettingsService;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			UpdateUserVisibilitySettingsService,
		).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should update user visibility settings', async () => {
		const user = mockUser();

		const command = new UpdateUserVisibilitySettingsCommand(
			user.id(),
			UserVisibility.PRIVATE,
			UserVisibility.PRIVATE,
		);

		getAuthenticatedUser.execute.mockResolvedValue(user);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(user.visibilitySettings().profile()).toBe(command.profile);
		expect(user.visibilitySettings().spotFolders()).toBe(
			command.spotFolders,
		);
	});

	it('should not update user visibility config if user is not authorized', async () => {
		const user = mockUser();

		const command = new UpdateUserVisibilitySettingsCommand(user.id());

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});

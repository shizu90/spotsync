import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { UpdateUserVisibilityConfigCommand } from '../../ports/in/commands/update-user-visibility-config.command';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { UpdateUserVisibilityConfigService } from '../update-user-visibility-config.service';
import { mockUser } from './user-mock.helper';

describe('UpdateUserVisibilityConfigService', () => {
	let service: UpdateUserVisibilityConfigService;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			UpdateUserVisibilityConfigService,
		).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should update user visibility config', async () => {
		const user = mockUser();

		const command = new UpdateUserVisibilityConfigCommand(
			user.id(),
			UserVisibility.PRIVATE,
			UserVisibility.PRIVATE,
		);

		getAuthenticatedUser.execute.mockResolvedValue(user);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(user.visibilityConfiguration().profile()).toBe(command.profile);
		expect(user.visibilityConfiguration().spotFolders()).toBe(
			command.spotFolders,
		);
	});

	it('should not update user visibility config if user is not authorized', async () => {
		const user = mockUser();

		const command = new UpdateUserVisibilityConfigCommand(user.id());

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});

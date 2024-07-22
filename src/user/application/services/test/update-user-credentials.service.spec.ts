import { randomUUID } from 'crypto';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserVisibilityConfig } from 'src/user/domain/user-visibility-config.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { User } from 'src/user/domain/user.model';
import { UpdateUserCredentialsCommand } from '../../ports/in/commands/update-user-credentials.command';
import { UpdateUserCredentialsService } from '../update-user-credentials.service';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { TestBed } from '@automock/jest';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { mockUser } from './user-mock.helper';

describe('UpdateUserCredentialsService', () => {
	let service: UpdateUserCredentialsService;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(
			UpdateUserCredentialsService,
		).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should update user credentials', async () => {
		const user = mockUser();

		const command = new UpdateUserCredentialsCommand(
			randomUUID(),
			'New Test',
		);

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(user.id());

		await service.execute(command);

		expect(user.credentials().name()).toBe(command.name);
	});

	it('should not update user credentials if user does not exist', async () => {
		const command = new UpdateUserCredentialsCommand(
			randomUUID(),
			'New Test',
		);

		userRepository.findById.mockResolvedValue(null);
		getAuthenticatedUser.execute.mockReturnValue(randomUUID());

		await expect(service.execute(command)).rejects.toThrow(
			UserNotFoundError,
		);
	});

	it('should not update user credentials if user is not authenticated', async () => {
		const user = mockUser();

		const command = new UpdateUserCredentialsCommand(
			randomUUID(),
			'New Test',
		);

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(randomUUID());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});

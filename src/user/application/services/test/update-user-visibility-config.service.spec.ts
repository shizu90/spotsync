import { randomUUID } from 'crypto';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserVisibilityConfig } from 'src/user/domain/user-visibility-config.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { User } from 'src/user/domain/user.model';
import { UpdateUserVisibilityConfigCommand } from '../../ports/in/commands/update-user-visibility-config.command';
import { UpdateUserVisibilityConfigService } from '../update-user-visibility-config.service';
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

describe('UpdateUserVisibilityConfigService', () => {
	let service: UpdateUserVisibilityConfigService;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeEach(() => {
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
			randomUUID(),
			UserVisibility.PRIVATE,
		);

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(user.id());

		await service.execute(command);

		expect(user.visibilityConfiguration().profileVisibility()).toBe(
			UserVisibility.PRIVATE,
		);
	});

	it('should not update user visibility config if user does not exist', async () => {
		const command = new UpdateUserVisibilityConfigCommand(
			randomUUID(),
			UserVisibility.PRIVATE,
		);
		
		userRepository.findById.mockResolvedValue(null);
		getAuthenticatedUser.execute.mockReturnValue(randomUUID());

		await expect(service.execute(command)).rejects.toThrow(UserNotFoundError);
	});

	it('should not update user visibility config if user is not authenticated', async () => {
		const command = new UpdateUserVisibilityConfigCommand(
			randomUUID(),
			UserVisibility.PRIVATE,
		);
		
		userRepository.findById.mockResolvedValue(mockUser());
		getAuthenticatedUser.execute.mockReturnValue(randomUUID());

		await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
	});
});

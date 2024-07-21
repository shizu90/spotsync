import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { TestBed } from '@automock/jest';
import { DeleteUserService } from '../delete-user.service';
import { randomUUID } from 'crypto';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { mockUser } from './user-mock.helper';
import { DeleteUserCommand } from '../../ports/in/commands/delete-user.command';

describe('DeleteUserService', () => {
	let service: DeleteUserService;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(async () => {
		const { unit, unitRef } = TestBed.create(DeleteUserService).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should delete a user', async () => {
		const user = mockUser();

		const command = new DeleteUserCommand(randomUUID());

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(user.id());

		const deleted = await service.execute(command);

		expect(deleted).toBeUndefined();
	});

	it('should not delete user if user is not found', async () => {
		const command = new DeleteUserCommand(randomUUID());

		userRepository.findById.mockResolvedValue(null);
		getAuthenticatedUser.execute.mockReturnValue(null);

		await expect(service.execute(command)).rejects.toThrow(UserNotFoundError);
	});

	it('should not delete user if user is not authenticated', async () => {
		const command = new DeleteUserCommand(randomUUID());

		userRepository.findById.mockResolvedValue(mockUser());
		getAuthenticatedUser.execute.mockReturnValue(randomUUID());

		await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
	});
});

import { CreateUserService } from '../create-user.service';
import { TestBed } from '@automock/jest';
import { CreateUserCommand } from '../../ports/in/commands/create-user.command';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { mockUser } from './user-mock.helper';

describe('CreateUserService', () => {
	let service: CreateUserService;
	let repository: jest.Mocked<UserRepository>;

	beforeAll(async () => {
		const { unit, unitRef } = TestBed.create(CreateUserService).compile();

		service = unit;
		repository = unitRef.get(UserRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a user', async () => {
		const user = mockUser();

		const command = new CreateUserCommand(
			user.credentials().name(),
			user.credentials().email(),
			user.credentials().password(),
			user.credentials().phoneNumber(),
		);

		repository.findByEmail.mockResolvedValue(null);
		repository.findByName.mockResolvedValue(null);
		repository.store.mockResolvedValue(user);

		const response = await service.execute(command);

		expect(response.first_name).toBe(user.credentials().name());
	});

	it('should not create a user with the same email', async () => {
		const user = mockUser();

		const command = new CreateUserCommand(
			user.credentials().name(),
			user.credentials().email(),
			user.credentials().password(),
			user.credentials().phoneNumber(),
		);

		repository.findByEmail.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UserAlreadyExistsError,
		);
	});

	it('should not create a user with the same name', async () => {
		const user = mockUser();

		const command = new CreateUserCommand(
			user.credentials().name(),
			user.credentials().email(),
			user.credentials().password(),
			user.credentials().phoneNumber(),
		);

		repository.findByName.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UserAlreadyExistsError,
		);
	});
});
